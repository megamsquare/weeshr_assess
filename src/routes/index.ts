import express from 'express';
import user_route from './user.route';
import auth_route from './auth.route';

const routers = express.Router();

// Mount the individual routes here
routers.use('/v1/user', user_route);
routers.use('/v1/auth', auth_route);

// Export the routes
export default routers;