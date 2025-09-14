#!/bin/bash

#
# Copyright (c) 2024. Treenity Inc.
#

# Configuration
GITLAB_HOST="https://gitlab.com"
PROJECT_ID="54382891"
SOURCE_BRANCH="dev"
TARGET_BRANCH="release"
TOKEN_FILE="$HOME/.gitlab_token"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to handle GitLab token
handle_gitlab_token() {
    # First check if token is already in environment
    if [ -n "$GITLAB_TOKEN" ]; then
        return
    fi

    # Check if token file exists and load it
    if [ -f "$TOKEN_FILE" ]; then
        GITLAB_TOKEN=$(cat "$TOKEN_FILE")
        if [ -n "$GITLAB_TOKEN" ]; then
            return
        fi
    fi

    # Token not found, guide user through creation process
    echo -e "${YELLOW}No GitLab token found. Let's set one up:${NC}"
    echo -e "${BLUE}1. Go to ${GITLAB_HOST}/-/user_settings/personal_access_tokens${NC}"
    echo "2. Create a new token with these scopes:"
    echo "   - api"
    echo "   - write_repository"
    echo -n "Enter your GitLab token: "
    read -s GITLAB_TOKEN
    echo

    # Validate token
    echo "Validating token..."
    local response
    response=$(curl --silent --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
        "$GITLAB_HOST/api/v4/user")

    if echo "$response" | jq -e '.id' >/dev/null; then
        echo -e "${GREEN}Token validated successfully!${NC}"
        # Save token securely
        echo "$GITLAB_TOKEN" > "$TOKEN_FILE"
        chmod 600 "$TOKEN_FILE"
    else
        echo "Error: Invalid token"
        GITLAB_TOKEN=""
        exit 1
    fi
}

# Function to validate project access
validate_project_access() {
    local response
    response=$(curl --silent --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
        "$GITLAB_HOST/api/v4/projects/$PROJECT_ID")

    if ! echo "$response" | jq -e '.id' >/dev/null; then
        echo "Error: Cannot access project. Please check your project ID and token permissions."
        exit 1
    fi
}

# Function to create Merge Request
create_mr() {
    local response
    response=$(curl --silent --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
        --data "source_branch=$SOURCE_BRANCH" \
        --data "target_branch=$TARGET_BRANCH" \
        --data "title=Release version update" \
        --data "description=Automated version update with changesets" \
        "$GITLAB_HOST/api/v4/projects/$PROJECT_ID/merge_requests")

    local mr_iid=$(echo "$response" | jq -r '.iid')
    local web_url=$(echo "$response" | jq -r '.web_url')

    if [ "$web_url" != "null" ]; then
        echo -e "${GREEN}Merge Request created successfully!${NC}"
        echo -e "${BLUE}MR URL: $web_url${NC}"
    else
        echo "Error creating Merge Request. Response:"
        echo "$response"
        exit 1
    fi
}

main() {
    # Handle token and project ID
    handle_gitlab_token
    validate_project_access

    # 1. Update local release branch
    echo "Updating local release branch..."
    git fetch origin
    git checkout "$TARGET_BRANCH"
    git pull origin "$TARGET_BRANCH"
    git checkout "$SOURCE_BRANCH"

    # 2. Run changeset and prompt for message
    echo "Running changeset..."
    pnpm changeset

    # 3. Run changeset version
    echo "Running changeset version..."
    pnpm changeset version

    # 4. Update pnpm.lock
    echo "Updating pnpm.lock..."
    pnpm install

    # 5. Commit changes
    echo "Committing changes..."
    git add .
    git commit -m "chore: version packages"

    # 6. Push changes and create MR
    echo "Pushing changes..."
    git push origin "$SOURCE_BRANCH"

    # 7. Create and print MR
    create_mr
}

# Run the script
main "$@"
