const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'monika.filipkowska@setapp.pl',
		subject: 'Say hello to task app!',
		text: `Welcome to the app, ${name}`
	});
};

const sendFarewellEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'monika.filipkowska@setapp.pl',
		subject: "It's very sad message",
		text: `we were pleased to welcome you, ${name}`
	});
};

module.exports = {
	sendWelcomeEmail,
	sendFarewellEmail
};
