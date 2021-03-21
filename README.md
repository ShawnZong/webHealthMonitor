# Website Health Monitor

## Overview

A tool for monitoring website health. 

Users can specify a list of URLs and test rules in /src/utils/links.js. The tool will automatically execute monitor tasks, generate logs and store in MongoDB.

## Solution

I chose **JavaScript** to develop this tool. Because JavaScript is easy to use for software related to web. For example, I can select the DOM element conveniently when testing whether webpate has a text or not. Also **npm** is convenient for package management. Moreover, the JS community has many useful libraries, including **Axios**, a promise based HTTP client.

URLs and checking list are specified in **./src/utils/links.js**. The tool reads in each task and execute them periodically.

When developing, I configured **Eslint** and **Prettier** for mataining code quality. **Git** for version control.

For security concerns, I moved all sensive information to external configuration files, which are read in as environment variables.

I used MongoDB for storing logs.  enabled connection pool, because the tool frequently writes to db, connection pool can reuse database connections.

## Technologies

* JavaScript + Node.js + Axios + Npm
* MongoDB
* Docker Compose
* Eslint

## Features

* User can specify a list of URLs and test rules.
* User can configure custom interval for periodically executing tasks.
* A Log contains request info, webite availability and whether it fullfills the rules.
* Logs are stored in MongoDB. User can either use the local docker-compose.yml to create local MongoDB, or specify the URI of Atlas MongoDB in configuration file.
* Eslint to ensure coding style

## Usage

1. The logs are stored in MongoDB. If users have cloud db service, just specify the URI in database.env, otherwise follow the instructions below to create local MongoDB.

``` bash
# enter project root directory
# create MongoDB container. A volume is used for persistent storage
docker-compose up -d

# check container status
docker ps
```

2. For security concerns, users need to specify configuration in external files. Two configuration files need to be created first.

The configuration will be read in by **dotenv** and **docker-compose.yml**.

* **./src/.env**:

``` bash
# checking period, crontab syntax format
CRON_SYNTAX = "* * * * * *"

# MongoDB connection pool size
DB_POOL_SIZE = 5

# MongoDB URI
MONGODB_URL = "mongodb://<hostname>:<port>/<databaseName>"

# database username
DB_USER = "user"

# database password
DB_PWD = "passowrd"

# user role
DB_AUTHSOURCE = "admin"
```

* **./database.env**:

this file is used for creating local MongoDB

``` bash
# database name
MONGO_INITDB_DATABASE = databaseName

# databse username
MONGO_INITDB_ROOT_USERNAME = user

# database password
MONGO_INITDB_ROOT_PASSWORD = password
```

3. Specify URLs and checking rules in **./src/utils/links.js**. Four patterns are supported.

* **checkStatusCode**: user can access an URL and check whether the status code is expected.

``` javascript
// example
{
    op: 'checkStatusCode',
    method: 'GET',
    url: 'https://www.f-secasdasure.com',
    statusCode: 200,
}
```

* **checkPath**: check whether the redirected path in URL is expected.

``` javascript
// example
{
    op: 'checkPath',
    method: 'GET',
    url: 'https://www.f-secure.com',
    path: '/fi',
}
```

* **checkResBody**: check whether the response data is expected

``` javascript
// example
{
    op: 'checkResBody',
    method: 'GET',
    url: 'https://www.f-secure.com',
    path: '/fi',
    body: "<h>test</h>"
},
```

* **checkEle**: check whether the returned HTML contains specific element.

``` javascript
// example
{
    op: 'checkEle',
    method: 'GET',
    url: 'https://www.f-secure.com/en',
    selector: '.cmp-navigation__item-link',
    innerHTML: 'For home',
}
```

4. Start the tool.

``` bash
cd ./src && node test.js
```

5. Users can see logs output in console as well as in database.
