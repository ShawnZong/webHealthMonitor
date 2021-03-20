// const request = require('supertest')('https://www.f-secure.com/en');
const supertest = require('supertest');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
// const parser = new DOMParser();

(async function () {
  const result = await axios.get('https://www.f-secure.com/en');
  const dom = new JSDOM(result.data);
  const doc = dom.window.document;
  //   const doc = parser.parseFromString(result.data, 'text/html');
  //   console.log(result.status);
  const ele = doc.querySelector('.cmp-navigation__item-link').textContent;
  console.log(ele);
})();

axios.get('https://google.com/').then(function (response) {
  // handle success
  //   console.log(response);
});
