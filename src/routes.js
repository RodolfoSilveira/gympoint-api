import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

const routes = new Router();

routes.post('/session', SessionController.store);
routes.use(authMiddleware);
routes.post('/student', StudentController.store);
routes.put('/student/:id', StudentController.update);
routes.get('/plan', PlanController.index);
routes.post('/plan', PlanController.store);
routes.put('/plan/:id', PlanController.update);
routes.delete('/plan/:id', PlanController.delete);

export default routes;
