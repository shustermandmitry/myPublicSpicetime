#!/bin/bash

# Check if a config name is provided
if [ $# -eq 0 ]; then
    echo "Error: No config name provided."
    echo "Usage: $0 <new_config_name>"
    exit 1
fi

# Set variables
NEW_CONFIG_NAME="$1"
KUBE_DIR="$HOME/.kube"
EXISTING_CONFIG="$KUBE_DIR/config"
K3S_CONFIG="$KUBE_DIR/$NEW_CONFIG_NAME"
BACKUP_CONFIG="$KUBE_DIR/config.bak.$(date +%Y%m%d%H%M%S)"
MERGED_CONFIG="$KUBE_DIR/config_merged"

# Check if the specified new config exists
if [ ! -f "$K3S_CONFIG" ]; then
    echo "Error: $K3S_CONFIG not found."
    exit 1
fi

# Backup existing config if it exists
if [ -f "$EXISTING_CONFIG" ]; then
    cp "$EXISTING_CONFIG" "$BACKUP_CONFIG"
    echo "Existing config backed up to $BACKUP_CONFIG"
else
    echo "No existing config found. Creating a new one."
    touch "$EXISTING_CONFIG"
fi

# Merge configs
KUBECONFIG="$EXISTING_CONFIG:$K3S_CONFIG" kubectl config view --flatten > "$MERGED_CONFIG"

# Replace existing config with merged config
mv "$MERGED_CONFIG" "$EXISTING_CONFIG"

# Set appropriate permissions
chmod 600 "$EXISTING_CONFIG"

echo "New config '$NEW_CONFIG_NAME' has been merged into $EXISTING_CONFIG"
echo "You can now use 'kubectl config get-contexts' to see available contexts"
echo "Switch contexts using 'kubectl config use-context <context-name>'"
