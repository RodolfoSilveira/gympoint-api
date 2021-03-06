import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';

const routes = new Router();

routes.post('/session', SessionController.store);
routes.use(authMiddleware);
routes.post('/student', StudentController.store);
routes.put('/student/:id', StudentController.update);
routes.get('/plan', PlanController.index);
routes.post('/plan', PlanController.store);
routes.put('/plan/:id', PlanController.update);
routes.delete('/plan/:id', PlanController.delete);
routes.get('/registration', RegistrationController.index);
routes.post('/registration', RegistrationController.store);
routes.put('/registration/:id', RegistrationController.update);
routes.delete('/registration/:id', RegistrationController.delete);
routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.show);
routes.get('/students/help-orders', HelpOrderController.index);
routes.post('/students/:id/help-orders', HelpOrderController.store);
routes.get('/students/:id/help-orders', HelpOrderController.show);
routes.put('/help-orders/:id/answer', HelpOrderController.update);

export default routes;
