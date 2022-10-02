#!/usr/bin/env sh

if ! [ -f "$1/$2" ]; then
    echo "Not a file: $1/$2"
    return
fi

if [ -z $3 ]; then
    echo "There is no arguments supplied. Please supply the third args which is the service name."
    return
fi

FILENAME_WITH_EXTENSION=$2
FILENAME=$(echo $FILENAME_WITH_EXTENSION | cut -d'.' -f1)

# Path to this plugin
PROTOC_GEN_JS_PATH="/Users/azizf/Documents/protobuf-javascript/bazel-bin/generator/protoc-gen-js"
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
PROTOC_GEN_GRPC_PATH="./node_modules/.bin/grpc_tools_node_protoc_plugin"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./client/pb/${3}/${FILENAME}"
if ! [ -d "$OUT_DIR" ]; then
    mkdir -p $OUT_DIR
fi


# protoc \
#     --plugin="protoc-gen-js=${PROTOC_GEN_JS_PATH}" \
#     --js_out="import_style=commonjs,binary:${OUT_DIR}" \
#     --grpc-web_out="import_style=commonjs+dts,mode=grpcwebtext:${OUT_DIR}" \
#     --proto_path="$PWD/$1" \
#     $2

protoc \
    --plugin="protoc-gen-js=${PROTOC_GEN_JS_PATH}" \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --plugin="protoc-gen-grpc=${PROTOC_GEN_GRPC_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=grpc-node,mode=grpc-js:${OUT_DIR}" \
    --grpc_out="grpc_js:${OUT_DIR}" \
    --proto_path="$PWD/$1" \
    $2

# protoc \
#     --plugin="protoc-gen-js=${PROTOC_GEN_JS_PATH}" \
#     --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
#     --js_out="import_style=commonjs,binary:${OUT_DIR}" \
#     --ts_out="service=grpc-web,mode=grpc-js:${OUT_DIR}" \
#     --proto_path="$PWD/$1" \
#     $2
