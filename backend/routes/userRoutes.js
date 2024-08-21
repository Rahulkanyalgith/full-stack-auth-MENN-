import express from 'express'
const router = express.Router()

import UserController from '../controllers/userController.js'

router.post('/register' , UserController.userRegistration)
router.post('/verifyemail' , UserController.verifyEmail)
router.post('/login' , UserController.userLogin)


export default router