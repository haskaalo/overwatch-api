#!/bin/bash

docker build -t haskaalo/overwatch-api:$TRAVIS_TAG -t haskaalo/overwatch-api:latest ./packages/webapi
docker push haskaalo/overwatch-api