#!/usr/bin/env bash

rm -rf ./cert
mkdir ./cert

openssl genrsa -des3 -out ./cert/rootCA.key 2048
openssl req -x509 -new -nodes -key ./cert/rootCA.key -sha256 -days 1024 -out ./cert/rootCA.pem

openssl req -new -nodes -out ./cert/server.csr -newkey rsa:2048 -keyout ./cert/server.key
openssl x509 -req -in ./cert/server.csr -CA ./cert/rootCA.pem -CAkey ./cert/rootCA.key -CAcreateserial -out ./cert/server.crt -days 500 -sha256 -extfile ./v3.ext
