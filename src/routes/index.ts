import express from 'express';
import user_route from './user.route';

const routers = express.Router();

// Mount the individual routes here
routers.use('/user', user_route);

// Export the routes
export default routers;