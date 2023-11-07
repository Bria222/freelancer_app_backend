const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  getAllData,
  updateUser,
  deleteUser,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.patch('/update/:id', protect, updateUser)
router.delete('/:id', protect, deleteUser)
router.get('/me', protect, getMe)
router.get('/', protect, getAllData)

module.exports = router
