#!/bin/bash


if ! docker info >/dev/null 2>&1; then
    echo "🛑 Docker does not seem to be running"
    echo "🐳 Docker starting"
    open -a Docker

    while ! docker info >/dev/null 2>&1;
    do
       sleep 2
       echo "🕐 Waiting when docker will be ready"
    done
fi

echo "🐳 Docker started ✅"

#for PORT in "7080" "7081" "7082" "9000" "9229" "4222" "6222" "8222"
#do
#   echo "✅ Killing port $PORT"
#   lsof -ti:$PORT | xargs kill
#done

#cd $(dirname $0)/../..
#
#MANIFEST=configs/kubernetes-manifests/development
#if [ ! -d "$MANIFEST" ]; then
#  echo "manifest $MANIFEST not found"; exit 1;
#fi
#
#FILE=${MANIFEST}/repository-vol.yaml
#VOL_PATH=$(readlink -f ./db)
#
#if [ ! -f "$FILE" ]; then
#echo "💿 repository-vol.yaml does not exist. File will be created. ✅  "
#cat > $FILE << EOF
#apiVersion: v1
#kind: PersistentVolume
#metadata:
#  name: p-repo-vol
#  labels:
#    type: local
#spec:
#  storageClassName: hostpath
#  capacity:
#    storage: 3Gi
#  accessModes:
#    - ReadWriteMany
#  hostPath:
#    path: ${VOL_PATH}
#    type: DirectoryOrCreate
#  persistentVolumeReclaimPolicy: Retain
#EOF
#fi
#
#sleep 1
kubectl config use-context docker-desktop
kubectl delete --all services
sleep 1

if ! kubectl get role pod-creator >/dev/null 2>&1; then
    echo "🕐 Creating roles"
    kubectl create role pod-creator --verb=create --verb=get --verb=list --verb=update --verb=delete --resource=pods,services,deployments
    kubectl create rolebinding default-pod-creator --role=pod-creator --serviceaccount=default:default --namespace=default
    kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods,services,deployments
    kubectl create rolebinding default-pod-reader --role=pod-reader --serviceaccount=default:default --namespace=default
    echo "✅  Roles for k8s has been create1d"
fi

allow_quit() {
    skaffold delete
    echo "🐳✅ Cluster has been stopped"
    exit 0
}
trap allow_quit SIGINT

while ! skaffold dev --status-check=false
do
   echo "🕐 Wait 10 sec and restart"
   sleep 10
   echo "🐳 Started cluster again"
done
