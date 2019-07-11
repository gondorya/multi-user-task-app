const express = require('express');
const Task = require('../models/task');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
	const task = new Task({
		...req.body,
		owner: req.user._id
	});

	try {
		await task.save();
		res.status(200).send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get('/tasks', auth, async (req, res) => {
	try {
		await req.user.populate('tasks').execPopulate();
		res.send(req.user.tasks);
	} catch (error) {
		res.status(500).send();
	}
});

router.get('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id;

	try {
		const task = await Task.findOne({ _id, owner: req.user._id });

		if (!task) {
			return res.status(404).send();
		}
		res.send(task);
	} catch (error) {
		res.status(500).send();
	}
});

router.patch('/tasks/:id', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const data = [ 'description', 'completed' ];
	const isValid = updates.every((update) => {
		return data.includes(update);
	});

	if (!isValid) {
		res.status(400).send('error: Invalid updates!');
	}

	try {
		const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

		if (!task) {
			return res.status(404).send();
		}

		updates.forEach((update) => {
			task[update] = req.body[update];
		});

		await task.save();
		res.send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.delete('/tasks/:id', auth, async (req, res) => {
	try {
		const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

		if (!task) {
			return res.status(404).send();
		}

		res.send(task);
	} catch (error) {
		res.status(500).send();
	}
});

module.exports = router;
