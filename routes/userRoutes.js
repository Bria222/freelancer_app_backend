const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  getAllData,
  updateUser,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.patch('/update/:id', protect, updateUser)
router.get('/me', protect, getMe)
router.get('/', protect, getAllData)

module.exports = router
