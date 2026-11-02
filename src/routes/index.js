const express = require('express');
const taskRoute = require('./task.route');

const router = express.Router();

router.get('/health', (req, res) => {
  res.send({ status: 'OK', message: 'Tasks API is running smoothly' });
});

router.use('/tasks', taskRoute);

module.exports = router;
