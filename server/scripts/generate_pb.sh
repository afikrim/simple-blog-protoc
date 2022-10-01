#!/usr/bin/env sh

if ! [ -f "$1/$2" ]; then
    echo "Not a file: $1/$2"
    exit 1
fi

FILENAME_WITH_EXTENSION=$2
FILENAME=$(echo $FILENAME_WITH_EXTENSION | cut -d'.' -f1)

# Path to this plugin
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./src/handler/api/pb/${FILENAME}"
if ! [ -d "$OUT_DIR" ]; then
    mkdir -p $OUT_DIR
fi

protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="${OUT_DIR}" \
    --proto_path="$PWD/$1" \
    $2
