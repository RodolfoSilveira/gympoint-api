import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import Youch from 'youch';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();
    this.middleware();
    this.routes();
    this.exceptionHandler();
  }

  middleware() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toHTML();

        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
