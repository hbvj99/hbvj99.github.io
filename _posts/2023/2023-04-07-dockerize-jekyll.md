---
title: "Dockerize Jekyll website"
excerpt: "A guide on using Docker image and docker container for jekyll theme websites."
header:
  overlay_image: "https://images.unsplash.com/photo-1646627927863-19874c27316b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1980&q=40&h=1080"
  overlay_filter: 0.7
  caption: "Image: [Rubaitful](https://unsplash.com/photos/HSACbYjZsqQ)"
tags:
  - Docker
  - Jekyll
categories:
    - Guides
---

If you are running a static webpage generator that is built by Ruby and Jekyll, chances are you might have faced issues
installing gems and configuring the dev environment across various operating systems.

# What is Docker and Docker container?

Docker is a platform that makes it simpler to build and ship software across many settings and infrastructures by
allowing developers to build, deploy, and operate programs within lightweight, portable containers and images.

## Dockerize your Jekyll theme

### Create Dockerfile

```dockerfile
FROM ruby:3.0

RUN bundle config --global frozen 1

WORKDIR /app/jekyll

COPY Gemfile Gemfile.lock ./

RUN bundle install
```

Run command ```docker build -t jekyll .``` to build a docker image.

### Add host to the config.

Add variable host to the `_config.yml` file.

```
host: "0.0.0.0"
```

### Create Docker compose

```
version: "3.0"

services:
  app:
    image: jekyll
    container_name: app-jekyll-container
    command: [ "jekyll", "serve"]
    ports:
      - "4000:4000"
    volumes:
      - $PWD:/app/jekyll
```

Initiate the container by simply using ```docker-compose up``` and you have the local server running at `http://0.0.0.0:4000`.
