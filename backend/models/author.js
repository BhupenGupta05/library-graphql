const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number,
  },
})

schema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('Author', schema)