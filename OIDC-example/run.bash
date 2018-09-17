#!/usr/bin/env bash
sudo docker run -u 0 -p 443:443 -it --rm --name oidc-test -v "$PWD":/usr/src/myapp -w /usr/src/myapp python:3 pip install Flask && openssl req -x509 -newkey rsa:2048 -keyout privkey.pem -out cert.pem -days 365 -subj '/CN=example.com' && sudo python oidc_auth.py
