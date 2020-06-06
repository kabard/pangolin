# Pangolin Proxy Server

[![Build Status](https://travis-ci.org/ddimaria/koa-typescript-starter.svg?branch=develop)](https://travis-ci.org/ddimaria/koa-typescript-starter)
[![Coverage Status](https://coveralls.io/repos/github/ddimaria/koa-typescript-starter/badge.svg?branch=develop)](https://coveralls.io/github/ddimaria/koa-typescript-starter?branch=develop)

Pangolin is a api-proxy layer build with KOA2 and typescript.

## What pangolin does?
- Proxy for the multiple back-end service
- API versioning
- plugable polices - add policies on each APIs, e.g. Authentication, caching, 
- analytics on API calls
- Role based Access control on APIs

## In the plate
- Improve API versioning interface and metric for versions
- API version rollout
- DDL for custom policies
- configuration change without restart
- Customization dashbaord for analytics and luece search for analytics
- webhook on api calls.
- cli for admin operation and configuration changes.
- genrator for plugin and polices. 

## Installation
run the docker-compose to spawn up the resources.
```
docker-compose up
```

## Prerequisites
* Node.js (8+): recommend using [nvm](https://github.com/creationix/nvm)
* Docker (if building a docker image) https://www.docker.com/docker-mac


## API documentation
For a swagger version of this documention, see http://localhost:3000/swagger (requires this server to be running).
