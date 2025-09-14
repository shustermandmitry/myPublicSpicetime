#!/bin/bash

find_file_up() {
    local file="$1"
    local dir="$PWD"
    while [[ "$dir" != "/" ]]; do
        if [[ -e "$dir/$file" ]]; then
            echo "$dir/$file"
            return 0
        fi
        dir="$(dirname "$dir")"
    done
    return 1
}

calculate_hash() {
    local file="$1"
    if [[ "$(uname)" == "Darwin" ]]; then
        md5 -q "$file"
    else
        md5sum "$file"
    fi
}

generate_hash_string() {
    local dir="$1"
    local result=""

    for file in "$dir"/*; do
        if [[ -f "$file" ]]; then
            local hash=$(calculate_hash "$file")
            result+="${hash} ${file##*/}"$'\n'
        fi
    done
    echo "$result"
}

update_hashes() {
  echo "$(generate_hash_string "$1")" > "$2"
}

check_hash_changes() {
    local dir="$1"
    local hash_file="$2"

    local current_hash=$(generate_hash_string "$dir")
    if [[ ! -f "$hash_file" ]]; then
        return 1
    fi

    local stored_hash=$(cat "$hash_file")

    if [[ "$current_hash" == "$stored_hash" ]]; then
        return 0
    else
        echo "$current_hash" > "$hash_file"
        return 1
    fi
}
