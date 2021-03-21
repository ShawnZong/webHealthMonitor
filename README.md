# Website Health Monitor

## Overview

A tool for monitoring website health. 

Users can specify a list of URLs and test rules in /src/utils/links.js. The tool will automatically execute monitor tasks, generate logs, and store them in MongoDB. The logs contain task overview, checked URLs, their status, response time, an error message (if exists).

## Solution

I chose **JavaScript** to develop this tool. Because JavaScript is easy to use for software related to web. For example, I can select the DOM element conveniently when testing whether the website has specific text or not. Also **npm** is convenient for package management. Moreover, the JS community has many useful libraries, including **Axios**, a promise-based HTTP client.

URLs and checking list are specified in **./src/utils/links.js**. The tool reads in each task and executes them periodically.

When developing, I configured **Eslint** and **Prettier** for maintaining code quality. **Git** for version control.

For security concerns, I moved all sensitive information to external configuration files, which are read in as environment variables.

I used MongoDB for storing logs. enabled connection pool, because the tool frequently writes to DB, connection pool can reuse database connections.

## Technologies

* JavaScript + Node.js + Axios + Npm
* MongoDB
* Docker Compose
* Eslint

## Features

* User can specify a list of URLs and test rules.
* User can configure the custom interval for periodically executing tasks.
* A Log contains request info, website availability, and whether it fulfills the rules. The log time is UTC time, so no need to worry about timezones. Response time is calculated by **performance.now()** which provides millisecond precision.
* Logs are stored in MongoDB. Users can either use the local docker-compose.yml to create local MongoDB or specify the URI of Atlas MongoDB in the configuration file.
* Eslint to ensure coding style

## Usage

1. Install required packages

``` bash
# install packages specified in package.json
npm install
```

2. For security concerns, users need to specify the configuration in external files. Two configuration files need to be created first.

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

   

3. The logs are stored in MongoDB. If users have cloud DB service, just specify the URI in database.env, otherwise, follow the instructions below to create local MongoDB.

``` bash
# enter project root directory
# create MongoDB container. A volume is used for persistent storage
docker-compose up -d

# check container status
docker ps
```

4. Specify URLs and checking rules in **./src/utils/links.js**. Four patterns are supported.

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

5. Users can see logs output in the console as well as in the database.

## Design question

Assuming we wanted to simultaneously monitor the connectivity (and latencies) from multiple geographically distributed locations and collect all the data to a single report that always reflects the current status across all locations. Describe how the design would be different. How would you transfer the data? Security considerations?

We can use a proxy to simulate requests from different locations. Because I used database to store logs. One central database might not be sufficient and safe. A distributed database like TiKV can be considered. Also, cloud services like AWS, GCP, Azure are good, because they manage the data for you and can easily be scaled. 

Regarding security concerns in data transfer. We can establish IPsec tunnels by StrongSwan so that the communication is encrypted.

## Future work

* Upload Docker image.
* Patterns to check header parameters.
* Some websites require login, which needs user cookie. Provide authentication patterns that log in first and then attach cookie each time sending a request.
* Patterns to download files from websites.
