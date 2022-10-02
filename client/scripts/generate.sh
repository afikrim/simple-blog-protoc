#!/usr/bin/env bash

if [ $# -eq 0 ]; then
    echo "There is no arguments supplied. Please supply the path to the proto folder."
    exit 1
fi

if ! [ -d "$1" ]; then
    echo "Not a directory: $1"
    exit 1
fi

# Generate pb
contracts=$(find . -name "contracts.txt")
while IFS= read -r line
do
    echo "Generating pb for $line"

    generate_script=$(find . -name "generate_pb.sh")
    if [ -z $generate_script ]; then
        echo "generate_pb.sh not found"
        exit 1
    fi

    bash $generate_script $1 $line
done < "$contracts"

# Generate grpc
dependencies_contracts=$(find . -name "dependencies_contracts.txt")
while IFS= read -r line
do
    serviceName=$(echo $line | cut -d':' -f1)
    contractsInString=$(echo $line | cut -d':' -f2)
    contracts=(${contractsInString//,/ })

    for contract in "${contracts[@]}"
    do
        echo "Generating grpc for $contract"

        generate_script=$(find . -name "generate_grpc.sh")
        if [ -z $generate_script ]; then
            echo "generate_grpc.sh not found"
            exit 1
        fi

        bash $generate_script $1 $contract $serviceName
    done
done < "$dependencies_contracts"
