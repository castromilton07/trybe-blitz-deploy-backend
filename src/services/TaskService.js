const { ObjectId } = require('mongodb');
const Task = require('../models/Task');
const errors = require('../util/errors');
const validate = require('../util/validations');

const getAll = async () => {
  const tasks = await Task.getAll();
  return tasks;
};

const create = async ({ title, status }) => {
  const taskError = await validate.requiredTaskData(title, status);
  if (taskError) return errors.invalidEntries;
  const createdAt = new Date();
  const { insertedId: _id } = await Task.create({ title, status, createdAt });
  return { _id, title, status, createdAt };
};

const getById = async (id) => {
  if (!ObjectId.isValid(id)) return errors.taskNotFound;
  const task = await Task.getById(id);
  if (!task) return errors.taskNotFound;
  return task;
};

const update = async ({ id, title, status }) => {
  if (!ObjectId.isValid(id)) return errors.taskNotFound;
  const task = await Task.getById(id);
  if (!task) return errors.taskNotFound;
  const { createdAt } = task;
  await Task.update({ _id: id, title, status, createdAt });
  return { _id: id, title, status, createdAt };
};

const remove = async (id) => {
  if (!ObjectId.isValid(id)) return errors.taskNotFound;
  const task = await Task.getById(id);
  if (!task) return errors.taskNotFound;
  await Task.remove(id);
  return task;
};

const removeAll = async () => {
  const tasks = await Task.removeAll();
  return tasks;
};

module.exports = { getAll, create, getById, update, remove, removeAll };
