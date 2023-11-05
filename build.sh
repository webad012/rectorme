#!/bin/bash

### usage: bash build.sh

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "Building rector-me image"
docker build -t rector-me $SCRIPT_DIR/docker

echo "Running RectorMe container for building extension"
docker run --rm -v $SCRIPT_DIR:/opt/rectoreme --name RectorMe rector-me