#!/usr/bin/env bash
docker run -u 0 -p 443:443 -it --rm --name oidc-python-test -v "$PWD":/oidc -w /oidc local/python python oidc_auth.py
