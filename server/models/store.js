const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
    size: Number,
  },
});

module.exports = mongoose.model('Store', storeSchema);
