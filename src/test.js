// environment variables
require('dotenv').config();

// cronb
const cron = require('node-cron');

// db
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

// import links
const { links } = require('./utils/links');

// global variables
let response;
let resLog;

cron.schedule(process.env.CRON_SYNTAX, async () => {
  links.map(async (link) => {
    switch (link.op) {
      case 'checkStatusCode':
        response = await CheckStatusCode(link);
        resLog = response.log;
        // console.log(resLog);
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
        console.log('invalid op');
    }

    const logTmp = {
      success: resLog.success,
      op: resLog.op,
      date: resLog.date,
      reqUrl: resLog.reqUrl,
      log: JSON.stringify(resLog),
      error: resLog.error ? resLog.error : null,
    };
    // console.log(blogTmp);
    const log = new Log(logTmp);
    const savedLog = await log.save();

    console.log(`\n saved logs in db:\n ${savedLog}`);
  });
});

// eslint-disable-next-line func-names
// (async function () {
//   let response;
//   links.map(async (link) => {
//     switch (link.op) {
//       case 'checkStatusCode':
//         response = await CheckStatusCode(link);
//         console.log(response.log);
//         break;
//       case 'checkPath':
//         response = await CheckPath(link);
//         console.log(response.log);
//         break;
//       case 'checkResBody':
//         response = await CheckResBody(link);
//         console.log(response.log);
//         break;
//       case 'checkEle':
//         response = await CheckEle(link);
//         console.log(response.log);
//         break;
//       default:
//         console.log('invalid op');
//     }
//   });
// })();
