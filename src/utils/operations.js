// HTTP client
const axios = require('axios');
const url = require('url');

const { performance } = require('perf_hooks');

// timing request
axios.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: performance.now() };
    return config;
  },
  (error) => Promise.reject(error),
);
axios.interceptors.response.use((response) => {
  response.config.metadata.endTime = performance.now();
  response.duration =
    response.config.metadata.endTime - response.config.metadata.startTime;
  return response;
});

const CheckStatusCode = async (link) => {
  let log;
  let result;
  let error = null;

  try {
    // RESTful API
    switch (link.method) {
      case 'GET':
        try {
          result = await axios.get(link.url);
        } catch (e) {
          error = e;
          break;
        }
        break;
      case 'PUT':
        try {
          result = await axios.get(link.url);
        } catch (e) {
          error = e;
          break;
        }
        break;
      case 'POST':
        try {
          result = await axios.get(link.url);
        } catch (e) {
          error = e;

          break;
        }
        break;
      case 'DELETE':
        try {
          result = await axios.get(link.url);
        } catch (e) {
          error = e;

          break;
        }
        break;
      default:
        error = true;
    }
  } catch (e) {
    error = true;
  }

  if (error) {
    log = {
      success: false,
      op: link.op,
      date: new Date().toUTCString(),
      method: link.method,
      reqUrl: link.url,
      // log: `${new Date().toUTCString()}, fail ${link.method} ${link.url}`,
    };
    // log = `fail: ${new Date().toUTCString()}, fail ${link.method} ${link.url}`;
  } else {
    log =
      result.status === link.statusCode
        ? {
            success: true,
            op: link.op,
            date: new Date().toUTCString(),
            method: link.method,
            reqUrl: link.url,
            resUrl: result.request.res.responseUrl,
            statusCode: result.status,
            responseTime: result.duration.toFixed(2),
            // log: `${new Date().toUTCString()}, ${link.method} ${
            //   link.url
            // }, statusCode: ${
            //   result.status
            // }, responseTime: ${result.duration.toFixed(2)}ms`,
          }
        : {
            success: false,
            op: link.op,
            date: new Date().toUTCString(),
            method: link.method,
            reqUrl: link.url,
            resUrl: result.request.res.responseUrl,
            statusCode: result.status,
            // log: `${new Date().toUTCString()}, ${link.method} ${
            //   link.url
            // }, statusCode: ${result.status}`,
          };
  }

  return { log, result };
};

const CheckPath = async (link) => {
  // eslint-disable-next-line prefer-const
  let { log, result } = await CheckStatusCode({ ...link, statusCode: 200 });
  const resUrl = url.parse(result.request.res.responseUrl);

  log.op = link.op;
  log.expectedPath = link.path;

  if (log.success) {
    if (link.path !== resUrl.path) {
      log.success = false;
    }
  }
  return { log, result };
};

module.exports.CheckStatusCode = CheckStatusCode;
module.exports.CheckPath = CheckPath;
