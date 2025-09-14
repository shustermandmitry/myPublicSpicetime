#!/bin/bash

# Function to display usage information
usage() {
    echo "Usage: $0 <instance_name>"
    echo "This script removes a context, cluster, and user with the specified name from your kubeconfig."
    exit 1
}

# Check if an instance name is provided
if [ $# -eq 0 ]; then
    echo "Error: No instance name provided."
    usage
fi

INSTANCE_NAME="$1"
KUBE_CONFIG="$HOME/.kube/config"
BACKUP_CONFIG="$HOME/.kube/config.bak.$(date +%Y%m%d%H%M%S)"

# Backup existing config
cp "$KUBE_CONFIG" "$BACKUP_CONFIG"
echo "Existing config backed up to $BACKUP_CONFIG"

# Remove context
kubectl config delete-context "$INSTANCE_NAME" &>/dev/null
if [ $? -eq 0 ]; then
    echo "Context '$INSTANCE_NAME' removed."
else
    echo "Context '$INSTANCE_NAME' not found."
fi

# Remove cluster
kubectl config delete-cluster "$INSTANCE_NAME" &>/dev/null
if [ $? -eq 0 ]; then
    echo "Cluster '$INSTANCE_NAME' removed."
else
    echo "Cluster '$INSTANCE_NAME' not found."
fi

# Remove user
kubectl config delete-user "$INSTANCE_NAME" &>/dev/null
if [ $? -eq 0 ]; then
    echo "User '$INSTANCE_NAME' removed."
else
    echo "User '$INSTANCE_NAME' not found."
fi

echo "Removal process completed. If any instances were not found, they may have been named differently or already removed."
echo "You can review your current config using: kubectl config view"
