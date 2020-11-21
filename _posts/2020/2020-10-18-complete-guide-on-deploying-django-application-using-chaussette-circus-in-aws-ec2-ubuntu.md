---
title: "Complete guide on deploying Django application with Chaussette, Circus in AWS EC2 Ubuntu"
excerpt: "A guide to deploy your very own Django application using Chaussette WSGI Server, Circus as process and socket manager in AWS Ubuntu EC2."
header:
  overlay_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1491&q=30"
  overlay_filter: 0.8
  caption: "Image: [Taylor](https://unsplash.com/photos/M5tzZtFCOfs)"
tags:
  - Django
  - RestFul Web APIs
  - Deployment
  - AWS EC2
  - Ubuntu
  - Chaussette
  - Circus
  - Git server
categories:
  - Guides
---

A guide on deploying Django application using Chaussette WSGI Server, Circus as process and socket manager in AWS Ubuntu 20 LTS EC2 instance.

# What is Chaussette?
[Chaussette](https://chaussette.readthedocs.io/en/1.3.0/) is a WSGI server that you can use to run your Python WSGI applications; for this article, we'll run Django application. It can bind a socket on a port or run in already opened sockets.

We will be using [Circus](https://circus.readthedocs.io/en/latest/) to manager socket/process manager.

# What is Circus?
[Circus](https://circus.readthedocs.io/en/latest/) is a Python program which can be used to monitor and control processes and sockets.


# Setup SSH on local

Once you download the PEM key after creating an instance from AWS console, move it to the ```/home/user/.ssh``` and add config for quick connect;
```bash
cat>config
Host forum # name you prefer
        Hostname 0.0.0.0 # your server IP
        User ubuntu # user
        IdentityFile ~/.ssh/aws-n-virginia-ubuntu.pem # file name
```

Let's connect to the server using SSH using: ```ssh forum```

# Server Setup

The first thing after login is to upgrade everything.

- ```sudo apt-get update && sudo apt-get -y upgrade```

## Install tools
Install useful tools that we will be using;

- ```sudo apt install python-dev build-essential links python3-pip python3-cffi python3-wheel python3-setuptools libffi-dev libreadline-gplv2-dev libncursesw5-dev libssl-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev virtualenv git```


## Nginx

Nginx is a reverse proxy, load balancer, mail proxy and HTTP cache - generic TCP/UDP proxy server.

Install Nginx, enable, setup Firewall.

- ```sudo apt install nginx```
- ```sudo ufw app list``` # view the list
- ```sudo ufw allow 'Nginx HTTP'``` # enable port 80
- ```sudo ufw allow 'Nginx HTTPS'``` # enable port 443
- ```sudo ufw allow 'Nginx Full'``` # optional
- ```sudo systemctl enable nginx && systemctl start nginx```

## PostgreSQL

PostgreSQL is an open-source object-relational database system. Let's install Postgres and setup.

- ```sudo apt-get install postgresql postgresql-contrib```
- ```sudo systemctl enable postgresql && sudo systemctl start postgresql```

Setup database;

- ```sudo -i -u postgres```
- ```psql```
- ```CREATE USER DB_USER WITH PASSWORD 'YOUR_PASSWORD';```
- ```CREATE DATABASE DB_NAME;```
- ```GRANT ALL PRIVILEGES ON DATABASE DB_NAME TO DB_USER;```


## Setup Git Repository in Server 

There are many ways on pushing local or remote code to the deployment server i.e. CI/CD, FTP. We'll be setting up the remote server using Git. 

I learned this great approach working for some company - this will only push the latest HEAD changes from your local dev environment. This method is useful when you don't want to directly pull the changes from Git repository into the server.

Let's name our origin as ```server.git``` and set up the standard folder structure. Appending .git in a directory name helps to quickly identify it as git repository.

- ```mkdir backend && cd backend && mkdir server.git app conf logs media static && cd server.git```

Next we setup a ```server.git``` as bare repo and configure. 

- ```git init --bare && git --bare update-server-info && git config core.bare false && git config receive.denycurrentbranch ignore && git config core.worktree /home/ubuntu/backend/app/```

Add hooks for post-receive so that we checkout file every time when we do push.

```bash
cat > hooks/post-receive <<EOF
#!/bin/bash
git checkout -f
source ../venv/bin/activate
circusctl reload
deactivate
# other scripts path here
EOF
```

<i class="fa fa-info-circle"></i> **Info:** ```post-receive``` is invoked when doing git push and updates. You could customize it to run other commands or notify user. Although anything that might take longer time is better to avoid as suggested in offical [doc](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).
  {: .notice--info}
  {: .text-justify}


and don't forget to make it executable using; 
- ```sudo chmod +x hooks/post-receive```


## Server configs

### Virtual Env

Create a virtual environment Python 3 environment and activate

- ```virtualenv venv -p python3 && source venv/bin/activate```

### Circus and Chaussette
Install it using;

- ```pip install circus chaussette```
- ```cd conf && cat>circus.ini```

```bash
[watcher:webapp]
cmd = chaussette --fd $(circus.sockets.webapp) forum.wsgi.application # Django setting path
uid=ubuntu
endpoint_owner=ubuntu # server user
numprocesses = 3
use_sockets = True
copy_env = True
copy_path = True
virtualenv = /home/ubuntu/backend/venv/ # virtualenv path
stdout_stream.class = FileStream
stdout_stream.filename = /home/ubuntu/backend/logs/app.log
stderr_stream.class = FileStream
stderr_stream.filename = /home/ubuntu/backend/logs/app_err.log

# optionally rotate the log file when it reaches 1 gb
# and save 3 copied of rotated files
stdout_stream.max_bytes = 1073741824
stdout_stream.backup_count = 3
stderr_stream.max_bytes = 1073741824
stderr_stream.backup_count = 3

[env:webapp]
PYTHONPATH=/home/ubuntu/backend/

[socket:webapp]
host = 127.0.0.1
port = 8085
```

Refer [here](https://circus.readthedocs.io/en/latest/for-ops/configuration/) for other configs.

## Config Circus Daemon
- ```circusd --daemon circus.ini && circusctl reloadconfig && circusctl reload```


### Config Nginx
- ```cat>nginx.conf```

```bash
upstream django_project {
    server 127.0.0.1:8085; # for a web port socket see circus.ini [socket:webapp]
    # server unix:///path/to/your/mysite/mysite.sock; # for a file socket
}

# Redirect www.forum.vijaypathak.com.np to forum.vijaypathak.com.np
# server {
#     listen 80;
#     server_name  www.forum.vijaypathak.com.np;
#     return       301 https://forum.vijaypathak.com.np$request_uri;
# }

# Configs for server
server {
    listen 80; # server port

    server_name forum.vijaypathak.com.np; # domain/IP name
    charset     utf-8;

    # Enable when required
    # access_log /home/ubuntu/backend/logs/nginx.access.log;
    # error_log /home/ubuntu/backend/logs/nginx.error.log;

    #limit_conn conn_limit_per_ip 100;
    #limit_req zone=req_limit_per_ip burst=100 nodelay;

    # robots.txt path
    #location /robots.txt {
    #    alias /home/ubuntu/backend/static/robots.txt;
    #}

    # Favicon path
    #location /favicon.ico {
    #    alias /home/ubuntu/backend/static/img/favicon.ico;
    #}

    # Static file
    location /static/ {
            alias /home/ubuntu/backend/static/;
    }

    # Media file
    location /media/ {
        alias /home/ubuntu/backend/media/;
    }

    ## Deny other host names i.e your domain/IP here
    if ($host !~* ^(forum.vijaypathak.com.np)$ ) {
        return 444;
    }

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        # proxy_set_header X-Forwarded-Proto https; #enable ssl
        # proxy_pass http://webapp;
        client_max_body_size 50m;
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always; # 2 years
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Frame-Options SAMEORIGIN;

        # Enable when required
        # CSP allowing popular third party integrations
        add_header Content-Security-Policy "default-src 'self' ; script-src 'self' 'unsafe-inline' 'unsafe-eval' adservice.google.com adservice.google.com.np pagead2.googlesyndication.com d31qbv1cthcecs.cloudfront.net www.google-analytics.com cdn.ravenjs.com connect.facebook.net platform.twitter.com apis.google.com www.google.com www.gstatic.com maps.googleapis.com; connect-src 'self' googleads.g.doubleclick.net fonts.gstatic.com wss: securepubads.g.doubleclick.net d5nxst8fruw4z.cloudfront.net sentry.io maps.gstatic.com www.google-analytics.com certify.alexametrics.com; img-src 'self' data: certify.alexametrics.com maps.gstatic.com maps.googleapis.com d5nxst8fruw4z.cloudfront.net www.google-analytics.com stats.g.doubleclick.net ssl.gstatic.com csi.gstatic.com www.facebook.com syndication.twitter.com www.gravatar.com pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' data: cdn.vijaypathak.com.np fonts.gstatic.com; frame-src googleads.g.doubleclick.net www.youtube.com accounts.google.com content.googleapis.com www.facebook.com staticxx.facebook.com platform.twitter.com; manifest-src 'self'; worker-src 'self' fonts.gstatic.com";
    }

    # Deny all hidden files and directory being served
    # Append in bottom
    location ~ /\. { 
      access_log off; 
      log_not_found off; 
      deny all; 
      }
}

```

Read more on Nginx configs [here](https://uwsgi-docs.readthedocs.io/en/latest/tutorials/Django_and_nginx.html#configure-nginx-for-your-site).

### Add nginx config to /etc/nginx/nginx.conf

 - ```sudo nano /etc/nginx/nginx.conf```

Include Nginx config inside http;
```
include /home/ubuntu/backend/conf/nginx.conf;
```

- ```sudo nginx -t && sudo systemctl restart nginx```

### Migrations
Run migration to generate table and relations in the database

- ```python manage.py makemigrations && python manage.py migrate```

<i class="far fa-sticky-note"></i> **Note:** We are using Chaussette for serving our Application hence running the server manually like in local dev environment is not required.
  {: .notice--info}
  {: .text-justify}

### SSL certificate with Certbot

Install Let's Encrypt SSL (auto-renew/valid for 90days)


- ```sudo apt install software-properties-common && sudo add-apt-repository ppa:certbot/certbot && sudo apt-get update && sudo apt-get install python3-certbot-nginx```
- ```sudo certbot --nginx``` # run cerbot to get SSL for domain

Finally test auto-renewal of SSL;
- ```sudo certbot renew --dry-run```

## Include this in Django Settings for better Security
### Use HTTPS (SSL)
```
- SESSION_COOKIE_SECURE = True
- SECURE_HSTS_SECONDS = 63072000  # 2 years
- SECURE_HSTS_INCLUDE_SUBDOMAINS = True
- SECURE_HSTS_PRELOAD = True
- SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
- SECURE_BROWSER_XSS_FILTER = True
- SECURE_CONTENT_TYPE_NOSNIFF = True # Prevents Cross-Site scripts
- SECURE_SSL_REDIRECT = True # Include 'django.middleware.security.- SecurityMiddleware' at top in Middleware
- SECURE_REFERRER_POLICY = 'same-origin'
- CSRF_COOKIE_SECURE = True
```

### Other headers

```
- USE_X_FORWARDED_HOST = True
- X_FRAME_OPTIONS = 'DENY' # Include 'django.middleware.clickjacking.XFrameOptionsMiddleware' in Middleware to Prevent Clickjacking 
```

# Local Git setup
Let's pull a Django application from remote Github to local first using;

```
git clone https://github.com/hbvj99/forum.git
```

Make sure that you have separate .env file and add your new secret key, database, SMTP or other credentials here. 

Great, next we set up the remote server in local - [more info](https://git-scm.com/book/en/v2/Git-on-the-Server-Setting-Up-the-Server).

- ```git remote add APP_NAME forum@:/home/ubuntu/backend/server.git/```
- Check if you successfully set up the remote URL with ```git remote -v```

- ```git push APP_NAME --all``` local branches will be pushed on server, doesn't require remote as upstream branch

<i class="fa fa-info-circle"></i> **Info:** ```APP_NAME``` can be any name you prefer. ```forum``` is our ssh name that we set [earlier](#setup-ssh-on-local).
  {: .notice--info}
  {: .text-justify}

# Final things to consider

Finally, we check if our application ready is ready for production - it shouldn't detect any issues when running;
- ```python manage.py check --deploy```

Also, don't forget to check official deploy [check list](https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/).

If you made to here; our site is Live now with a custom domain, SSL, SMTP and following decent security measure.

At last, get security analysis of your website on [Mozilla Observatoty](https://observatory.mozilla.org/).

## Commands
After you push the latest changes to the server, you need to run
- ```circusctl reload``` 

<i class="far fa-sticky-note"></i> **Tips:** You can add above command in git hooks ```post-receive``` to auto run when changes is detected.
  {: .notice--info}
  {: .text-justify}

### Folder Structure

Here's the Final folder/file structure if you quickly want to check;
```python
.
├── backend
    └── server.git # repo name
      ── HEAD
      └── braches
      ─── config
      └── description
      └── hooks
      ─── index
      └── info
      └── logs
      └── objects
      └── refs
        └── heads
        └── tags    
    └── app
      └── YOUR_FILES_HERE
    └── conf
      ─── circus.ini
      ─── nginx.conf    
    └── logs
      ─── app.log
      ─── app_err.log
    └── media
    └── static
    └── venv   
```

If you have any confusions or better approach that helps on improving the guide please comment down below.