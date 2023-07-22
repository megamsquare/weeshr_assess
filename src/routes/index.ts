import express from 'express';
import authRoute from './auth.router';
import blogRoute from './blog.router'
import Middleware from '../middleware';

const routers = express.Router();

// Mount the individual routes here
routers.use('/v1/blog', blogRoute);
routers.use('/v1/auth', authRoute);

// Export the routes
export default routers;