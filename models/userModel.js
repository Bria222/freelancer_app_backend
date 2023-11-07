const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order',
      },
    ],
    firstname: {
      type: String,
      required: [true, 'Please add a firstname'],
    },
    lastname: {
      type: String,
      required: [true, 'Please add a lastname'],
    },
    phone: {
      type: Number,
      required: [true, 'Please add your phone number'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'writer', 'employer'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
