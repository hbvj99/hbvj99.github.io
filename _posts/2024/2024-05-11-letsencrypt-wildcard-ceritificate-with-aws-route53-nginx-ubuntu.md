---
title: "Let's Encrypt wildcard certificates with AWS Route53, Nginx and Ubuntu"
excerpt: "A guide on automatic renewal of lets encrypt wildcard certificates using AWS Route53, Nginx and Ubuntu."
header:
  overlay_image: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?q=50&w=720&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  overlay_filter: 0.7
  caption: "Image: [Franck](https://unsplash.com/photos/black-iphone-5-on-yellow-textile-DoWZMPZ-M9s)"
tags:
  - Let's Encrypt
  - Ubuntu
  - Nginx
  - Certificate
categories:
    - Guides
---
Any website requires automated wildcard certificate renewal to provide uninterrupted secure connectivity without human intervention or downtime.

I'm sure most of you are familiar with Let’s Encrypt certificates, when you have multiple domains like `somedomain.com`, `two.somedomain.com`, we usually create certificates for each. For multiple sub-domains, wildcard certificates offer greater flexibility by automatically securing any new subdomains created under the main domain without needing additional certificates or configuration changes. It supports infinite sub-domains like `*.somedomain.com`.

## Issue

In Let's Encrypt, a wildcard certificate is supported but can be created using manual command using ACMEv2 certbot [DNS-01 challenge](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge), it will ask to post some random record in your DNS, in wildcard certificates real-time generation process you have to add the TXT record to verify ownership. The major cons of using this method is it doesn't support automated certificate renewal by default - when it expires in 90 days you have to generate a new certificate by using the same command and add a new record again. The manual command to get a wildcard certificate using Nginx is;
- `sudo certbot certonly --manual --preferred-challenges=dns --server https://acme-v02.api.letsencrypt.org/directory -d somedomain.com -d *.somedomain.com`.

## Solution

Fortunately, major domain providers have plugins that can offer an automated way to verify ownership using [DNS plugins](https://eff-certbot.readthedocs.io/en/latest/using.html#dns-plugins) and [dns-01](https://datatracker.ietf.org/doc/html/rfc8555#section-8.4). We'll be using `certbot-dns-route53` package to renew SSL in AWS automatically.

Let's learn the process of configuring and installing certbot.

## Configuration

### Ububtu Server
[Certbot EEF](https://certbot.eff.org/) website has a guide to installing cerbot on different operating systems, we'll consider [Ubuntu](https://ubuntu.com/download/server), [Nginx](https://www.nginx.com/) on the guide.

1. Install the classic certbot package with `sudo snap install --classic certbot`.
2. Make certbot command executable using `sudo ln -s /snap/bin/certbot /usr/bin/certbot`.
3. Confirm containment level using `sudo snap set certbot trust-plugin-with-root=ok`, it is required for wildcard domains.
4. Install the AWS Route53 plugin using `sudo snap install certbot-dns-route53`.

### AWS Account

Make sure you have a domain in AWS hosted zone. We will configure plugins to access the domain records and change them dynamically.

1. Get the Domain-hosted zone ID.
2. Create this policy inside `IAM` and replace `YOUR_HOSTED_ZONE_ID` with your ID.

### Policy 1

```json
{
    "Version": "2012-10-17",
    "Id": "certbot-dns-route53 sample policy",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "route53:ListHostedZones",
                "route53:GetChange"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect" : "Allow",
            "Action" : [
                "route53:ChangeResourceRecordSets"
            ],
            "Resource" : [
                "arn:aws:route53:::hostedzone/YOUR_HOSTED_ZONE_ID"
            ]
        }
    ]
}
```

### Policy 2

Alternatively, you can use this for granting access to all of your hosted zone domains. The above [Policy 1](#policy-1) is preferred.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "route53:ListHostedZones",
                "route53:GetChange",
                "route53:ChangeResourceRecordSets"
            ],
            "Resource": "*"
        }
    ]
}
```

3. Next, Create a new User in `IAM` and attach the newly created AWS Policy to this user.
4. Finally create an access key for the user - choose CLI as the use case and note `Access Key`, `Secret Access Key`.
5. In the Ubuntu server root directory, create directory `.aws` and `config` files.
6. Paste the AWS secrets in the file `~/.aws/config` as;

```bash
[default]
aws_access_key_id=YOUR_ACCESS_KEY
aws_secret_access_key=YOUR_SECRET_ACCESS_KEY
```



## Generate Certificate
1. Run the command to get a wildcard certificate using `sudo certbot certonly --dns-route53 -d somedomain.com -d *.somedomain.com`.
2. Command to renew certificate is `sudo certbot renew --dns-route53`.

## Auto-renew certificates
The next step is to make sure it renews automatically. We will create a cron jon to check and renew the certificate when required. A custom crontab is essential as the default certbot `sudo certbot renew` will not work with custom plugins.

Open Linux crontab using;
- `crontab -e` and paste the code at the last line.
- `0 23 * * * sudo certbot renew --dns-route53 >> /home/ubuntu/logs/cron_job.log 2>&1`.
- Above cron will run every day at 23:00 and log the output to the `/home/ubuntu/logs/cron_job.log` directory. Make sure the file exists in the directory.

## Final thoughts
This article guides you to automate the let's encrypt wildcard certificate renewal process to provide uninterrupted secure connectivity. If you have any questions, please drop them in comments.