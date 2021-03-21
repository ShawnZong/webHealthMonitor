// environment variables
require('dotenv').config();

// cronb
const cron = require('node-cron');

// import links
const { links } = require('./utils/links');

// op utils
const {
  CheckStatusCode,
  CheckPath,
  CheckResBody,
  CheckEle,
} = require('./utils/operations');

let response;

cron.schedule(process.env.CRON_SYNTAX, async () => {
  links.map(async (link) => {
    switch (link.op) {
      case 'checkStatusCode':
        response = await CheckStatusCode(link);
        console.log(response.log);
        break;
      case 'checkPath':
        response = await CheckPath(link);
        console.log(response.log);
        break;
      case 'checkResBody':
        response = await CheckResBody(link);
        console.log(response.log);
        break;
      case 'checkEle':
        response = await CheckEle(link);
        console.log(response.log);
        break;
      default:
        console.log('invalid op');
    }
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
