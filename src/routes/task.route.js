const express = require('express');
const validate = require('../middlewares/validate');
const { taskValidation } = require('../validations');
const { taskController } = require('../controllers');

const router = express.Router();

router
  .route('/')
  .post(validate(taskValidation.createTask), taskController.createTask)
  .get(validate(taskValidation.getTasks), taskController.getTasks);

router.route('/stats').get(taskController.getTaskStats);

router
  .route('/:taskId')
  .get(validate(taskValidation.getTask), taskController.getTask)
  .patch(validate(taskValidation.updateTask), taskController.updateTask)
  .delete(validate(taskValidation.deleteTask), taskController.deleteTask);

router
  .route('/:taskId/toggle-complete')
  .patch(validate(taskValidation.toggleTaskComplete), taskController.toggleTaskComplete);

module.exports = router;
