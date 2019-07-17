const express = require('express');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = new express.Router();

router.post('/users', async (req, res) => {
	const user = new User(req.body);
	try {
		const token = await user.generateAuthToken();
		await user.save();
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});

		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];

		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send;
	}
});

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = [ 'name', 'email', 'password', 'age' ];
	const isValid = updates.every((update) => {
		return allowedUpdates.includes(update);
	});

	if (!isValid) {
		return res.status(400).send({ error: 'Invalid updates' });
	}

	try {
		updates.forEach((update) => {
			req.user[update] = req.body[update];
		});

		await req.user.save();
		res.send(req.user);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.delete('/users/me', auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send(reg.user);
	} catch (error) {
		res.status(500).send();
	}
});

//Avatar

router.post(
	'/users/me/avatar',
	auth,
	upload('avatar', 6000000, 'jpg|jpeg|JPG|JPEG'),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) {
			throw new Error();
		}

		res.set('Content-Type', 'image/jpg');
		res.send(user.avatar);
	} catch (error) {
		res.status(400).send();
	}
});

module.exports = router;
