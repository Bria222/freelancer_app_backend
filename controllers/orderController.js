const asyncHandler = require('express-async-handler')

const Order = require('../models/orderModel')
const User = require('../models/userModel')

// @desc    Get Orders

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
  res.status(200).json(orders)
})

// @desc    create Order

const createOrder = asyncHandler(async (req, res) => {
  if (
    !req.body.subject ||
    !req.body.topic ||
    !req.body.description ||
    !req.body.account_name ||
    !req.body.account_order_number ||
    !req.body.paper_type ||
    !req.body.paper_level ||
    !req.body.format ||
    !req.body.language ||
    !req.body.slides_count ||
    !req.body.number_of_sources ||
    !req.body.spacing ||
    !req.body.number_of_pages ||
    !req.body.cost_per_page ||
    !req.body.nature ||
    !req.body.amount ||
    !req.body.actual_deadline ||
    !req.body.writer_deadline ||
    !req.body.writer ||
    !req.body.request_mode
  ) {
    res.status(400)
    throw new Error('All input fields are mandatory')
  }

  const newOrder = await Order.create({
    user: req.user.id,
    subject: req.body.subject,
    topic: req.body.topic,
    description: req.body.description,
    account_name: req.body.account_name,
    account_order_number: req.body.account_order_number,
    paper_type: req.body.paper_type,
    paper_level: req.body.paper_level,
    format: req.body.format,
    language: req.body.language,
    slides_count: req.body.slides_count,
    number_of_sources: req.body.number_of_sources,
    spacing: req.body.spacing,
    number_of_pages: req.body.number_of_pages,
    cost_per_page: req.body.cost_per_page,
    nature: req.body.nature,
    amount: req.body.amount,
    actual_deadline: req.body.actual_deadline,
    writer_deadline: req.body.writer_deadline,
    writer: req.body.writer,
    request_mode: req.body.request_mode,
  })

  res.status(200).json(newOrder)
})

// @desc Update Order
const updateOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id

  const existingOrder = await Order.findById(orderId)

  if (!existingOrder) {
    res.status(404)
    throw new Error('Order not found')
  }

  if (existingOrder.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, {
    new: true,
  })

  res.status(200).json(updatedOrder)
})

// @desc    Delete Order
const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id

  const existingOrder = await Order.findById(orderId)

  if (!existingOrder) {
    res.status(404)
    throw new Error('Order not found')
  }

  if (existingOrder.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await existingOrder.remove()

  res.status(200).json({ id: orderId })
})

module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
}
