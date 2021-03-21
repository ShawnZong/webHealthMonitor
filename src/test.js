// environment variables
require('dotenv').config();

// // HTTP client
// const axios = require('axios');

// string2DOM
const jsdom = require('jsdom');

// import links
const { links } = require('./utils/links');

const {
  CheckStatusCode,
  CheckPath,
  CheckResBody,
  CheckEle,
} = require('./utils/operations');

// eslint-disable-next-line func-names
(async function () {
  let response;
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

  // let result;
  // try {
  //   result = await axios.get('https://www.f-secure.com');
  // } catch (e) {
  //   if (!e.response) {
  //     console.log('url is wrong');
  //     return;
  //   }
  //   console.log('404');
  //   console.log(result.response.status);
  // }
  // console.log(links);
  //   const result = await axios.get('https://www.f-secure.cosssm/en');
  //   if(result.status)
  //   console.log(result.status);
  //   const dom = new JSDOM(result.data);
  //   const doc = dom.window.document;
  //   //   const doc = parser.parseFromString(result.data, 'text/html');
  //   //   console.log(result.status);
  //   const ele = doc.querySelector('.cmp-navigation__item-link').textContent;
  //   console.log(ele);
})();

// axios.get('https://google.com/').then(function (response) {
//   // handle success
//   //   console.log(response);
// });
