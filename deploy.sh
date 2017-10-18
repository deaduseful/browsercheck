#!/usr/bin/env bash
MY_BUCKET=browsercheck
#aws s3 mb s3://${MY_BUCKET}
aws s3 cp static/ s3://${MY_BUCKET}/ --recursive --acl public-read
# @see https://serverless.com/blog/serverless-api-gateway-domain/
#serverless create_domain
serverless deploy
