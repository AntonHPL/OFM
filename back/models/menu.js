const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  title: {
    gb: {
      type: String,
      required: true,
    },
    ru: {
      type: String,
      required: true,
    }
  },
  contents: {
    gb: {
      type: Array,
      required: true,
    },
    ru: {
      type: Array,
      required: true,
    }
  }
});

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
