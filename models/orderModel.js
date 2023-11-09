const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    subject: {
      type: Array,
      required: [true, 'Please select your subject'],
      default: ['Default Subject'],
    },
    topic: {
      type: Array,
      required: [true, 'Please select your subject'],
      default: ['Default topic'],
    },
    description: {
      type: String,
      required: [true, 'Please type your order description'],
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    account_name: {
      type: String,
      required: [true, 'Please select your acoount'],
      default: ['Hub'],
    },
    account_order_number: {
      type: String,
      required: [true, 'Please add your order number'],
    },
    paper_type: {
      type: Array,
      required: [true, 'Please select your paper type'],
      default: ['Assay'],
    },
    paper_level: {
      type: String,
      enum: ['high school', 'undergraduate', 'masters', 'phd'],
      default: 'ndergraduate',
    },
    format: {
      type: Array,
      required: [true, 'Please select your format'],
      default: ['APA'],
    },
    language: {
      type: String,
      enum: ['UK', 'AU', 'USA', 'OTHER'],
      default: 'USA',
    },
    slides_count: {
      type: Number,
      required: [true, 'Please add number of slides'],
      default: [1],
    },
    number_of_sources: {
      type: Number,
      required: [true, 'Please add number of sources'],
      default: [1],
    },
    spacing: {
      type: String,
      enum: ['single', 'double', 'multiple', 'OTHER'],
      default: 'double',
    },
    number_of_pages: {
      type: Number,
      required: [true, 'Please add number of pages'],
      default: [1],
    },
    cost_per_page: {
      type: Number,
      required: [true, 'Please add cost per page'],
      default: [300],
    },
    nature: {
      type: String,
      enum: ['Academic', 'Article'],
      default: 'Academic',
    },
    amount: {
      type: Number,
      required: [true, 'Please add cost per page'],
      default: [0],
    },
    actual_deadline: {
      type: Date,
      default: Date.now,
      required: [true, 'Please add actual date'],
    },
    writer_deadline: {
      type: Date,
      default: Date.now,
      required: [true, 'Please add actual date'],
    },
    payment_date: {
      type: Date,
      default: Date.now,
    },
    writer: {
      type: String,
      required: [true, 'Please select your writer'],
    },
    request_mode: {
      type: String,
      enum: ['draft', 'private', 'public'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Order', orderSchema)
