const httpStatus = require('http-status');
const { Task } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a task
 * @param {Object} taskBody
 * @returns {Promise<Task>}
 */
const createTask = async (taskBody) => {
  if (taskBody.status === 'completed' || taskBody.isCompleted === true) {
    taskBody.status = 'completed';
    taskBody.isCompleted = true;
  }
  return Task.create(taskBody);
};

/**
 * Query for tasks with filters, search, and pagination
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryTasks = async (filter, options) => {
  const mongoFilter = {};

  if (filter.status && filter.status !== 'all') {
    mongoFilter.status = filter.status;
  }

  if (typeof filter.isCompleted === 'boolean') {
    mongoFilter.isCompleted = filter.isCompleted;
  }

  if (filter.priority && filter.priority !== 'all') {
    mongoFilter.priority = filter.priority;
  }

  if (filter.search && filter.search.trim()) {
    const searchRegex = new RegExp(filter.search.trim(), 'i');
    mongoFilter.$or = [{ title: searchRegex }, { description: searchRegex }];
  }

  const tasks = await Task.paginate(mongoFilter, options);
  return tasks;
};

/**
 * Get task by id
 * @param {ObjectId} id
 * @returns {Promise<Task>}
 */
const getTaskById = async (id) => {
  return Task.findById(id);
};

/**
 * Update task by id
 * @param {ObjectId} taskId
 * @param {Object} updateBody
 * @returns {Promise<Task>}
 */
const updateTaskById = async (taskId, updateBody) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  if (updateBody.status) {
    updateBody.isCompleted = updateBody.status === 'completed';
  } else if (typeof updateBody.isCompleted === 'boolean') {
    updateBody.status = updateBody.isCompleted ? 'completed' : 'pending';
  }

  Object.assign(task, updateBody);
  await task.save();
  return task;
};

/**
 * Toggle task complete status
 * @param {ObjectId} taskId
 * @returns {Promise<Task>}
 */
const toggleTaskComplete = async (taskId) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const willBeCompleted = !task.isCompleted;
  task.isCompleted = willBeCompleted;
  task.status = willBeCompleted ? 'completed' : 'pending';

  await task.save();
  return task;
};

/**
 * Delete task by id
 * @param {ObjectId} taskId
 * @returns {Promise<Task>}
 */
const deleteTaskById = async (taskId) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  if (typeof task.deleteOne === 'function') {
    await task.deleteOne();
  } else {
    await task.remove();
  }
  return task;
};

/**
 * Get overall task statistics
 * @returns {Promise<Object>}
 */
const getTaskStats = async () => {
  const [total, completed, pending, inProgress] = await Promise.all([
    Task.countDocuments(),
    Task.countDocuments({ status: 'completed' }),
    Task.countDocuments({ status: 'pending' }),
    Task.countDocuments({ status: 'in-progress' }),
  ]);

  return {
    total,
    completed,
    pending,
    inProgress,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
};

module.exports = {
  createTask,
  queryTasks,
  getTaskById,
  updateTaskById,
  toggleTaskComplete,
  deleteTaskById,
  getTaskStats,
};
