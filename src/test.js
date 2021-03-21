// environment variables
require('dotenv').config();

// cronb
const cron = require('node-cron');

// db configuration
const mongoose = require('mongoose');
const Log = require('./models/log');

mongoose.connect(process.env.MONGODB_URL, {
  poolSize: process.env.DB_POOL_SIZE,
  authSource: process.env.DB_AUTHSOURCE,
  user: process.env.DB_USER,
  pass: process.env.DB_PWD,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// op utils
const {
  CheckStatusCode,
  CheckPath,
  CheckResBody,
  CheckEle,
} = require('./utils/operations');

// urls and requirements
const { links } = require('./utils/links');

// global variables
let response;
let resLog;

/**
 * create a cron schedule
 * @author Junsheng Tan
 */
cron.schedule(process.env.CRON_SYNTAX, async () => {
  links.map(async (link) => {
    switch (link.op) {
      case 'checkStatusCode':
        response = await CheckStatusCode(link);
        resLog = response.log;
        break;
      case 'checkPath':
        response = await CheckPath(link);
        resLog = response.log;
        // console.log(resLog);
        break;
      case 'checkResBody':
        response = await CheckResBody(link);
        resLog = response.log;
        // console.log(resLog);
        break;
      case 'checkEle':
        response = await CheckEle(link);
        resLog = response.log;
        // console.log(resLog);
        break;
      default:
        response = await CheckStatusCode(link);
        resLog = response.log;
    }

    const logTmp = {
      success: resLog.success,
      op: resLog.op,
      date: resLog.date,
      reqUrl: resLog.reqUrl,
      log: JSON.stringify(resLog),
      error: resLog.error ? resLog.error : null,
    };

    const log = new Log(logTmp);
    const savedLog = await log.save();

    console.log(`\n saved logs in db:\n ${savedLog}`);
  });
});
