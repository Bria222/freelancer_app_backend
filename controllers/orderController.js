const asyncHandler = require('express-async-handler')

const Order = require('../models/orderModel')
const User = require('../models/userModel')

// @desc    Get Orders
// @route   GET /api/Orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })

  res.status(200).json(orders)
})

// @desc    Set Order
// @route   POST /api/Orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }

  const Order = await Order.create({
    text: req.body.text,
    user: req.user.id,
  })

  res.status(200).json(Order)
})

// @desc    Update Order
// @route   PUT /api/Orders/:id
// @access  Private
const updateOrder = asyncHandler(async (req, res) => {
  const Order = await Order.findById(req.params.id)

  if (!Order) {
    res.status(400)
    throw new Error('Order not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the Order user
  if (Order.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedOrder)
})

// @desc    Delete Order
// @route   DELETE /api/Orders/:id
// @access  Private
const deleteOrder = asyncHandler(async (req, res) => {
  const Order = await Order.findById(req.params.id)

  if (!Order) {
    res.status(400)
    throw new Error('Order not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the Order user
  if (Order.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await Order.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
}
