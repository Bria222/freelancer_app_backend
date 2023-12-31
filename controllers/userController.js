const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const multer = require('multer')
// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const destination = 'uploads/'
    cb(null, destination)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage: storage })

// @desc    Register new user

const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, phone, email, password, role } = req.body

  if (!role || !firstname || !lastname || !phone || !email || !password) {
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
    role,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
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
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user

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

const getAllData = asyncHandler(async (req, res) => {
  const user = req.user

  if (user && user.role === 'admin') {
    try {
      const usersWithGoals = await User.find().populate({
        path: 'orders',
        model: 'Order',
      })
      res.status(200).json(usersWithGoals)
    } catch (err) {
      console.error('Error fetching users with goals:', err)
      res.status(500).json({ message: 'Error fetching users with orders' })
    }
  } else {
    // User is not an admin; deny access
    res.status(403).json({ message: 'Access denied' })
  }
})

// dete user

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params

  try {
    // Check if the user making the request matches the user's _id in the token
    if (req.user && req.user._id.toString() === id) {
      // User is attempting to delete their own account
      const deletedUser = await User.findByIdAndDelete(id)
      if (deletedUser) {
        res.status(200).json({ message: 'User deleted successfully' })
      } else {
        res.status(404).json({ message: 'User not found' })
      }
    } else {
      // Access denied for other users
      res.status(403).json({ message: 'Access denied' })
    }
  } catch (err) {
    // Handle any errors that occur during the deletion process
    console.error('Error deleting user:', err)
    res.status(500).json({ message: 'Error deleting user' })
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
  deleteUser,
}
