const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    { type: String}
  ]
})

schema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('Book', schema)