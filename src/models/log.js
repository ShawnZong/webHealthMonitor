/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const logSchema = new mongoose.Schema({
  success: {
    type: Boolean,
    required: true,
  },
  op: { type: String, required: true },
  date: {
    type: Date,
    required: true,
  },
  reqUrl: { type: String, required: true },
  log: { type: String, required: true },
  error: { type: String },
});

// userSchema.plugin(uniqueValidator);
// userSchema.set('toJSON', {
//   transform: (document, returnedObj) => {
//     returnedObj.id = returnedObj._id.toString();
//     delete returnedObj._id;
//     delete returnedObj.__v;
//     delete returnedObj.password;
//   },
// });

module.exports = mongoose.model('Log', logSchema);
