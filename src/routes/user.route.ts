import express from 'express';
import userController from '../controllers/user.controller';

const routers =  express.Router();

routers.post('/createUser', userController.createUser);
routers.put('/updateUser:userId', userController.updateUser)

// Export the rtouter
export default routers;