#!/usr/bin/env bash

rm -rf ./cert
mkdir ./cert

openssl genrsa -out ./cert/server.key 2048
openssl rsa -in ./cert/server.key -out ./cert/server.key
openssl req -sha256 -new -key ./cert/server.key -out ./cert/server.csr -subj '/CN=example.com'
openssl x509 -req -sha256 -days 365 -in ./cert/server.csr -signkey ./cert/server.key -out ./cert/server.crt
cat ./cert/server.crt ./cert/server.key > ./cert/cert.pem
