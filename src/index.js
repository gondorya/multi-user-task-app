const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./db/mongoose.js');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const router = new express.Router();

const app = express();
const port = process.env.PORT || 3000;

const publicDirectory = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialsPath);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicDirectory));

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get('', (req, res) => {
	res.render('index');
});

app.listen(port, () => {
	console.log('Hello! Your app is up on port ' + port);
});
