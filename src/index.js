const express = require('express');
require('./db/mongoose.js');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
// 	if (req.method === 'GET') {
// 		res.send('GET requests are disabled');
// 	} else {
// 		next();
// 	}
// });

// app.use((req, res, next) => {
// 	res.status(503).send('503: Website is temporarily unavailable');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log('Hello! Your app is up on port ' + port);
});
