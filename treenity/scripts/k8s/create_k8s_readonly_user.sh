#!/bin/bash

# Check if required commands are available
for cmd in kubectl base64; do
    if ! command -v $cmd &> /dev/null; then
        echo "$cmd could not be found. Please install it and try again."
        exit 1
    fi
done

# Check for required arguments
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <service-account-name> <namespace>"
    exit 1
fi

# Input parameters
SA_USERNAME=$1
NAMESPACE=$2

# Get cluster information from current context
CLUSTER_NAME=$(kubectl config view --minify -o jsonpath='{.clusters[0].name}')
CLUSTER_SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
CERT_AUTH_DATA=$(kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}')

# Create temporary kubeconfig for resource creation
TEMP_KUBECONFIG="temp_kubeconfig"
kubectl config view --raw > $TEMP_KUBECONFIG
export KUBECONFIG=$TEMP_KUBECONFIG

# Temporarily modify the cluster config to skip TLS verification
kubectl config set-cluster $CLUSTER_NAME --insecure-skip-tls-verify=true

echo "Creating service account with the following details:"
echo "Service Account: $SA_USERNAME"
echo "Namespace: $NAMESPACE"
echo "Cluster: $CLUSTER_NAME"
echo "Server: $CLUSTER_SERVER"

# Create namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Create service account
kubectl create serviceaccount $SA_USERNAME -n $NAMESPACE

# Create cluster role binding
kubectl create clusterrolebinding ${SA_USERNAME}-binding \
  --clusterrole edit \
  --serviceaccount=${NAMESPACE}:${SA_USERNAME}

# Create service account token
cat <<EOF | kubectl apply -f - --validate=false
apiVersion: v1
kind: Secret
metadata:
  name: ${SA_USERNAME}-token
  namespace: ${NAMESPACE}
  annotations:
    kubernetes.io/service-account.name: ${SA_USERNAME}
type: kubernetes.io/service-account-token
EOF

# Wait for secret to be populated
echo "Waiting for token to be generated..."
sleep 5

# Get the token
TOKEN=$(kubectl get secret ${SA_USERNAME}-token -n ${NAMESPACE} -o jsonpath='{.data.token}' | base64 --decode)

if [ -z "$TOKEN" ]; then
    echo "Error: Failed to get token"
    rm $TEMP_KUBECONFIG
    exit 1
fi

# Create a new kubeconfig file
NEW_KUBECONFIG="${SA_USERNAME}-kubeconfig"
cat << EOF > $NEW_KUBECONFIG
apiVersion: v1
kind: Config
clusters:
- cluster:
    server: ${CLUSTER_SERVER}
    insecure-skip-tls-verify: true
  name: ${CLUSTER_NAME}
contexts:
- context:
    cluster: ${CLUSTER_NAME}
    user: ${SA_USERNAME}
    namespace: ${NAMESPACE}
  name: ${SA_USERNAME}-context
current-context: ${SA_USERNAME}-context
users:
- name: ${SA_USERNAME}
  user:
    token: ${TOKEN}
EOF

# Clean up temporary config
rm $TEMP_KUBECONFIG

echo
echo "Configuration complete!"
KUBECONFIG=$(pwd)/$NEW_KUBECONFIG kubectl get pods -n $NAMESPACE
