const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTask = {
  body: Joi.object().keys({
    title: Joi.string().required().trim().max(200),
    description: Joi.string().allow('').trim().max(2000),
    status: Joi.string().valid('pending', 'in-progress', 'completed'),
    isCompleted: Joi.boolean(),
    priority: Joi.string().valid('low', 'medium', 'high'),
    dueDate: Joi.date().iso().allow(null, ''),
  }),
};

const getTasks = {
  query: Joi.object().keys({
    search: Joi.string().allow(''),
    status: Joi.string().valid('pending', 'in-progress', 'completed', 'all'),
    isCompleted: Joi.boolean(),
    priority: Joi.string().valid('low', 'medium', 'high', 'all'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};

const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().trim().max(200),
      description: Joi.string().allow('').trim().max(2000),
      status: Joi.string().valid('pending', 'in-progress', 'completed'),
      isCompleted: Joi.boolean(),
      priority: Joi.string().valid('low', 'medium', 'high'),
      dueDate: Joi.date().iso().allow(null, ''),
    })
    .min(1),
};

const deleteTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};

const toggleTaskComplete = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
};
