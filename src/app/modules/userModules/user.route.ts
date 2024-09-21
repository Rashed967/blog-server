import express from 'express'
import { userController } from './user.controller'
import verifyUser from '../../middlewares/verify.user'
import checkRole from '../../middlewares/checkRole'

const routes = express.Router()


// users auth routes
// create user route
routes.post('/register', userController.createUser)
// login user reoute
routes.post('/login', userController.loginUser)


// users specific functional routes
// get all users route (only for admin)
routes.get("/users", verifyUser, checkRole(['admin']),  userController.getAllUser)
// get a user route by his/her id (all logged in user)
routes.get('/:id', verifyUser, userController.getUserProfileById)
// update user profile by his/her id all logged in user)
routes.put('/users/:id/', verifyUser, userController.updateProfileById)


export const userRoutes = routes