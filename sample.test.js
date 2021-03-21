// const request = require('supertest')('https://www.f-secure.com/en');
const supertest = require('supertest');
const axios = require('axios');

const api = supertest('https://google.com/');

test('notes are returned as json', async () => {
  axios.get('https://googldfsdfe.com/').then(function (response) {
    // handle success
    console.log(response);
  });
  await api.get('').expect(200);
  // .expect('Content-Type', /application\/json/);
});
