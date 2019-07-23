const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneId,
	name: 'Mike',
	email: 'mike@mi.ke',
	password: 'pass111Word',
	tokens: [
		{
			token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
		}
	]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
	_id: userTwoId,
	name: 'Jack',
	email: 'jack@mi.ke',
	password: 'pass111Word',
	tokens: [
		{
			token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
		}
	]
};

const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	description: 'dream about better world',
	completed: false,
	owner: userOneId
};

const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	description: 'make cookie',
	completed: true,
	owner: userOneId
};

const taskThree = {
	_id: new mongoose.Types.ObjectId(),
	description: 'read book',
	completed: false,
	owner: userTwoId
};

const setupDatabase = async () => {
	await User.deleteMany();
	await Task.deleteMany();
	await new User(userOne).save();
	await new User(userTwo).save();
	await new Task(taskOne).save();
	await new Task(taskTwo).save();
	await new Task(taskThree).save();
};

module.exports = {
	userOneId,
	userOne,
	userTwoId,
	userTwo,
	setupDatabase,
	taskOne
};
