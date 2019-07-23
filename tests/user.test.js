const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('should signup a new user', async () => {
	const response = await request(app)
		.post('/users')
		.send({
			name: 'boby',
			email: 'boby@justtest.nom',
			password: 'hihello1'
		})
		.expect(201);

	// database was changed correctly
	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	// assertions about the response
	expect(response.body).toMatchObject({
		user: {
			name: 'boby',
			email: 'boby@justtest.nom'
		},
		token: user.tokens[0].token
	});
});

test('should login existing user', async () => {
	const response = await request(app)
		.post('/users/login')
		.send({
			email: userOne.email,
			password: userOne.password
		})
		.expect(200);

	const user = await User.findById(userOneId);
	expect(response.body.token).toBe(user.tokens[0].token);
});

test('should not login nonexisting user', async () => {
	await request(app)
		.post('/users/login')
		.send({
			email: userOne.email,
			password: 'wrongpass'
		})
		.expect(400);
});

test('should get profile for user', async () => {
	await request(app).get('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200);
});

test('should not get profile for unauthenticated user', async () => {
	await request(app).get('/users/me').send().expect(401);
});

test('should delete account', async () => {
	await request(app).delete('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send();

	const user = await User.findById(userOneId);
	expect(user).toBeNull();
});

test('should not delete account for unauthenticated user', async () => {
	await request(app).delete('/users/me').send().expect(401);
});

test('should upload avatar image', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.attach('avatar', 'tests/fixtures/Timon.png')
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test('should update valid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({ name: 'Robert' })
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.name).toBe('Robert');
});

test('should  not update invalid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({ location: 'Berlin' })
		.expect(400);
});
