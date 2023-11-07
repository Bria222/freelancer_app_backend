const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, phone, email, password } = req.body

  if (!firstname || !lastname || !phone || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    firstname,
    lastname,
    phone,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// @desc update user
// @route /api/users/update

const updateUser = async (req, res) => {
  const { id } = req.params

  // Check if the user making the request matches the user's _id in the token
  if (req.user && req.user._id.toString() === id) {
    // Update the user's data
    if (req.body.password) {
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
      req.body.password = hashedPassword
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      })

      res.status(200).json(updatedUser)
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    res.status(403).json({ message: 'Access denied' })
  }
}

// @desc    Get all user data if am an admin
// @route   GET /api/users/me
// @access  Private
const getAllData = asyncHandler(async (req, res) => {
  const user = req.user

  if (user && user.role === 'admin') {
    try {
      const usersWithGoals = await User.find().populate({
        path: 'goals',
        model: 'Goal',
      })
      res.status(200).json(usersWithGoals)
    } catch (err) {
      console.error('Error fetching users with goals:', err)
      res.status(500).json({ message: 'Error fetching users with goals' })
    }
  } else {
    // User is not an admin; deny access
    res.status(403).json({ message: 'Access denied' })
  }
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getAllData,
  getMe,
  updateUser,
}
