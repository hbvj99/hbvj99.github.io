---
title: "Load, performance analysis of APIs with Locust and load balancing."
excerpt: "A guide on testing API load time, view performance report using Locust/Python, handling HTTP load balancing with Nginx."
header:
  overlay_image: "https://images.unsplash.com/photo-1445109673451-c511bb51bd17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=980&q=50"
  overlay_filter: 0.6
  caption: "Image: [Wil](https://unsplash.com/photos/tB4-ftQ4zyI)"
tags:
  - RestFul Web APIs
  - APIs
  - Locust
  - Load testing
  - Nginx
categories:
  - Guides
---

I have always wondered how the system performs especially when thousand or even millions of users starts using it. I have now realized it's necessary to have a fair idea of how many users your app or APIs endpoint can handle that is freshly built and how to scale over time.

It is also important to understand what types of request are successful and which are failing. To understand this we will be using a lite framework called [Locust](https://locust.io/), even users who are not much familiar with programming will be able to learn and use it.

# What is Locust?
Locust is simply a testing framework that uses python Scripts that is scalable and widely used as a performance testing/analysis tool. It is powerful and simple to use - you define what type of users, how many and when to swarm your system.


## What we plan on learning?
One of the great features of [Locust](https://locust.io/) is that you write all your code in Python. We'll be writing simple test cases to understand REST API that uses JSON Web Token. We will be simulating users in a different time interval and find some interesting results and find a way to tackle the issue. 

Let's fork one of my project [Market API](https://github.com/hbvj99/market-api) for testing.

# Setting it up
 Let's create a virtual environment first so that we isolate the dependencies;

```
- mkdir locust
- cd locust && pip install virtualenv
- virtualenv venv -p python3.8 && source venv/bin/activate
- pip install locust
```
 
 <i class="far fa-sticky-note"></i> **More info:** Locust uses Flask, a light-weight Python framework to run the testing in the browser where you can view the real-time analysis visualization and even export the result after test completion.
  {: .notice--info}
  {: .text-justify}

# Writing basic tests

## 1. Authenticaitons
  
Let's create ```locustfile.py``` and write tests for different endpoints.

- touch locustfile.py credentails.py


Add the login credentails in ```credentails.py``` file.

```python
email = 'YOUR_EMAIL_ADDRESS'
password = 'YOUR_SECRET_PASSWORD'
```

Next, we write some real tests inside ```locustfile.py``` file. Lets test autentications.

```python
import time

from locust import HttpUser, task, between

from credentails import email, password


class MarketAPI(HttpUser):
    wait_time = between(0, 1.9)
    base_api_version = 'api/v1'

    def on_start(self):
        self.login()

    @task(1)
    def login(self):
        response = self.client.post(f"{self.base_api_version}/auth/token/", json={"email": email, "password": password})
        if response.json().get('errors'):
            print(response.text)
        self.access_token = response.json()['access']
        self.refresh_token = response.json()['refresh']
```

In the above code, we write the user login test case for token-based authentication by providing email and password. We need to include the ```login``` function inside the ```on_start``` function so that this executed first every time. As described in the official [doc](https://docs.locust.io/en/stable/quickstart.html), When a test starts, ```HttpUser``` class will create an instance of this class for every user that it simulates, and each of these users will create a micro-thread that will call those methods.

The ```@task``` is a decorator that will wait for users between the time defined in ```wait_time``` attribute for each task - we defined to wait between 0.8 and 1.9 seconds. The task decorator is defined and run in ascending order.

Likewise, ```self.client``` makes HTTP calls to the various APIs endopint, you can use HTTP methods like ```GET``` or ```POST```.


## 2. List, retrive and Post

### **List**

Add ```@task(2)``` to list data.

```python
@task(2)
def list_items(self):
  self.client.get(f"{self.base_api_version}/products/", headers={'Authorization': f'Bearer {self.access_token}'})
  self.client.get(f"{self.base_api_version}/products/comments/", headers={'Authorization': f'Bearer {self.access_token}'})
```

### **Retrive**

Likewise, we iterate and retrieve data in one endpoint point using for loops. Similarly, we can also import Python's time ```time.sleep()``` to stop for each retrieval process. To retrieve each product, we write ```@task(3)```.

```python
@task(3)
def view_products(self):
    for product in range(1, 50):
        self.client.get(f"{self.base_api_version}/products/{product}/",
                            headers={'Authorization': f'Bearer {self.access_token}'})
        time.sleep(0.3)
```

### **POST**

We refresh old token and generate new one.

```python
@task(4)
def refresh_token(self):
    new_refresh_token = self.client.post(f"{self.base_api_version}/auth/token/refresh/",
                      json={"refresh": self.refresh_token},
                      headers={'Authorization': f'Bearer {self.access_token}'})
    print(new_refresh_token.text)
```

## 3. Result Analysis

<img src="{{ site.url }}{{ site.baseurl }}/assets/image/2020/locust-dashboard.png" alt="Locust Dashbaord" class="full">

After running the test, the results are viewable in different visual means. In dashboard home, it includes the statistics like the number of requests made, failure rate, the average time taken for various endpoints.

The visualizations include;

<img src="{{ site.url }}{{ site.baseurl }}/assets/image/2020/number_of_users.png" alt="Locust number of users" class="full">

The numbers of users simulated in a different time interval and their bounce rate.

<img src="{{ site.url }}{{ site.baseurl }}/assets/image/2020/response_times.png" alt="Locust response time" class="full">

The response time in (ms) in real-time or after test completion, includes the comparison of percentage and the median time taken.

<img src="{{ site.url }}{{ site.baseurl }}/assets/image/2020/total_requests_per_second.png" alt="Locust Dashbaord" class="full">

Finally, the most important - failure rate can be viewed alongside RPS (Current requests per second).

 <i class="far fa-sticky-note"></i> **Hint:** All the raw data can be also exported in a CSV file. It is very helpful when you want to keep records of performance over time.
  {: .notice--info}
  {: .text-justify}


Around 100-150 users were simulated in total to tests various endpoints in the above examples. The actual users that could use the system could easily crash a single server.

### **Swarming the system** 

<img src="{{ site.url }}{{ site.baseurl }}/assets/image/2020/locust-overload.png" alt="Locust Dashbaord" class="full">

<img src="{{ site.url }}{{ site.baseurl }}/assets/image/2020/locust-cpu-usages.png" alt="Locust Dashbaord" class="full">

Next, we simulated around 5k-7k users to use the API in total. This results - API cannot handle the majority of requests and start throttling. Moreover, even when code is optimized - CPU power will give up eventually. And we will get a warning like CPU usages is high or API cannot process too many requests.

# How to fix API not able to process requests?
## Load balancing with Nginx

One of the ways we can resolve the APIs slow down or frequent requests failure is to implement HTTP load balancing - we will use [Nginx](https://www.nginx.com/). This technique allows to optimize and maximizing the resource utilization while reducing latency and ensuring fault-tolerant configurations by running multiple instances of the same application as highlighted in the official [documentation](http://nginx.org/en/docs/http/load_balancing.html#nginx_load_balancing_configuration).

## What is load balancing?

<img src="{{ site.url }}{{ site.baseurl }}/assets/image/2020/load-balancing.jpg" alt="Load balancing with Nginx" class="full">

Load balancing is the process of distributing incoming traffic across a group of servers. The load balancer sits in front of servers and routs client requests across all servers which are capable of fulfilling those requests efficiently.

## Writing configs

```bash
http {
    upstream test_api {
        # replace localhost with instance internal IP
        server host2.localhost.com;
        server host3.localhost.com;
        server host4.localhost.com;
        server host5.localhost.com;
    }

    server {
        listen 80;

        # enable for HTTPS i.e. letsencrypt
        # listen 443 ssl; 
        # ssl_certificate /etc/letsencrypt/live/DOMAIN_NAME/fullchain.pem;
        # ssl_certificate_key /etc/letsencrypt/live/DOMAIN_NAME/privkey.pem;
        # include /etc/letsencrypt/options-ssl-nginx.conf;
        # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        server_name localhost.com;

        location / {
            proxy_pass http://test_api;
        }
    }
}
```

In the above example, we see many instances of the same application allocated with the same upstream name. Reverse proxy work in both HTTP and HTTPS  alongside other protocols like Memcache.

<i class="far fa-sticky-note"></i> **Note:** The upstream name and proxy_pass name ```(test_api)``` must be same. It is best to use the internal IP for best security and performances in the ```server```.
{: .notice--info}
{: .text-justify}

The Nginx uses ```round-robin``` mechanism by default which balances the request made in each server. 

```bash
 upstream myapp1 {
        least_conn; # load balancing mechanism type
        server localhost:3000;
        server localhost:5000;
        server localhost:6000;
    }
```

For example, the ```least_conn``` load balancing type will not try not to overload a busy application server instead distributes it to a less busy server.

```bash
 upstream myapp1 {
        server localhost:3000 max_conns=200;
        server localhost:5000 max_conns=900;
        server localhost:6000;
        queue 160 timeout=80;
    }
```

If one of your instances is not powerful compare to another, you can also assign max connection to that particular server using ```max_conns```. When the max connections are reached it is placed in a queue for further processing.

Likewise, there are different supported algorithms like IP hash, Least time, Session persistence, Weighted load, Health checks that are designed to specific use cases - read more in official [doc](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/#choosing-a-load-balancing-method).

# Final thoughts

In this guide, we learned how to load test APIs, analyse endpoints that are taking more time to load when a high volume of requests are generated. We learned serving the application using load balancing will help on solving the load time/frequent APIs crashes issues. 

If you have any questions or maybe alternative ways to tackle the issue, please let me know.