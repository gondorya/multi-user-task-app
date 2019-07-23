const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
	console.log('Hello! Your app is up on port ' + port);
});
