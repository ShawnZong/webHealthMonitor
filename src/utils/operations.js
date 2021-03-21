// HTTP client
const axios = require('axios');
const url = require('url');

// string2DOM
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const { performance } = require('perf_hooks');

// axios config timing request
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

/**
 * check whether the website returns expected status code
 * @author Junsheng Tan
 * @param  {Object} link url and requirements that needs to be tested
 * @return {{Object, Object}} a log object and a result object returned from axios
 */
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
          if (!link.body) {
            error = true;
            break;
          }
          result = await axios.put(link.url, link.body);
        } catch (e) {
          error = e;
          break;
        }
        break;
      case 'POST':
        try {
          if (!link.body) {
            error = true;
            break;
          }
          result = await axios.post(link.url, link.body);
        } catch (e) {
          error = e;

          break;
        }
        break;
      case 'DELETE':
        try {
          result = await axios.delete(link.url);
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

  // connection level problems
  if (error) {
    log = {
      success: false,
      error: 'Unable to access the website',
      op: link.op,
      date: new Date().toUTCString(),
      method: link.method,
      expectedStatusCode: link.statusCode,
      reqUrl: link.url,
    };
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
            expectedStatusCode: link.statusCode,
            resStatusCode: result.status,
            responseTime: result.duration.toFixed(2),
          }
        : {
            // content problems
            success: false,
            op: link.op,
            error: 'requirement unfulfilled',
            date: new Date().toUTCString(),
            method: link.method,
            reqUrl: link.url,
            resUrl: result.request.res.responseUrl,
            expectedStatusCode: link.statusCode,
            resStatusCode: result.status,
          };
  }

  return { log, result };
};

/**
 * check whether the url of website contains expected path
 * @author Junsheng Tan
 * @param  {Object} link url and requirements that needs to be tested
 * @return {{Object, Object}} a log object and a result object returned from axios
 */
const CheckPath = async (link) => {
  // eslint-disable-next-line prefer-const
  let { log, result } = await CheckStatusCode({ ...link, statusCode: 200 });
  const resUrl = url.parse(result.request.res.responseUrl);

  log.op = link.op;
  log.expectedPath = link.path;

  if (log.success) {
    if (link.path !== resUrl.path) {
      log.success = false;
      log.error = 'requirement unfulfilled';
    }
  }
  return { log, result };
};

/**
 * check response body after requesting an url
 * @author Junsheng Tan
 * @param  {Object} link url and requirements that needs to be tested
 * @return {{Object, Object}} a log object and a result object returned from axios
 */
const CheckResBody = async (link) => {
  // eslint-disable-next-line prefer-const
  let { log, result } = await CheckStatusCode({ ...link, statusCode: 200 });

  log.op = link.op;

  if (log.success) {
    if (link.body !== result.data) {
      log.success = false;
      log.error = 'requirement unfulfilled';
    }
  }
  return { log, result };
};

/**
 * check whether current DOM contains specific element
 * @author Junsheng Tan
 * @param  {Object} link url and requirements that needs to be tested
 * @return {{Object, Object}} a log object and a result object returned from axios
 */
const CheckEle = async (link) => {
  // eslint-disable-next-line prefer-const
  let { log, result } = await CheckStatusCode({ ...link, statusCode: 200 });

  log.op = link.op;
  log.expectedInnerHTML = link.innerHTML;
  if (log.success) {
    // convert String to DOM
    const dom = new JSDOM(result.data);
    const doc = dom.window.document;
    const ele = doc.querySelector(link.selector).innerHTML;
    log.resInnerHTML = ele;
    if (link.innerHTML !== ele) {
      log.success = false;
      log.error = 'requirement unfulfilled';
    }
  }
  return { log, result };
};

module.exports.CheckStatusCode = CheckStatusCode;
module.exports.CheckPath = CheckPath;
module.exports.CheckResBody = CheckResBody;
module.exports.CheckEle = CheckEle;
