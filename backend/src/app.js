const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware');
const { corsOrigin } = require('./config/env');

const app = express();

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ success: true, message: 'OK' }));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
