import express, { Request, Response } from 'express';

import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import routers from './src/routes';

import Middleware from './src/middleware';
import { options } from './swaggerOptions';

const swaggerSpec = swaggerJSDoc(options);

const app = express();

app.use(express.json());

// app.use(express.urlencoded({ extended: true}));

app.use(helmet());

// Routers
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('api-docs', (req: Request, res: Response) => {
    res.redirect('/api-docs/index.html');
})
app.use('/api', routers);

// Page Not Found
app.use(Middleware.NotFoundMiddleware);

// Export the app as the default export
export default app;