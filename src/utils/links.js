exports.links = [
  {
    op: 'checkStatusCode',
    method: 'GET',
    url: 'https://www.f-secure.com',
    statusCode: 200,
  },
  {
    op: 'checkPath',
    method: 'GET',
    url: 'https://www.f-secure.com',
    path: '/fi',
  },
  {
    op: 'checkEle',
    method: 'GET',
    url: 'https://www.f-secure.com/en',
    selector: '.cmp-navigation__item-link',
    innerHTML: 'For home',
  },
];

// exports.links = [
//   {
//     op: 'checkStatusCode',
//     method: 'GET',
//     url: 'https://www.f-secure.com',
//     statusCode: 200,
//   },
//   {
//     op: 'checkEle',
//     method: 'GET',
//     url: 'https://www.f-secure.com',
//     selector: '.cmp-navigation__item-link',
//     innerHTML: 'For home',
//   },
//   {
//     op: 'checkPath',
//     method: 'GET',
//     url: 'https://www.f-secure.com',
//     path: '/fi',
//   },
// {
//   op: 'checkResBody',
//   method: 'GET',
//   url: 'https://www.f-secure.com',
//   path: '/fi',
//   body:"<h>test</h>"
// },
// ];
