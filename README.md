# Multi User Task App

Node.js app with Express.js, MongoDB and Mongoose

```
npm install
```

Create account on https://sendgrid.com/. Generate your API KEY

Create config folder with dev.env file. Add to this file:

```
PORT=3000
SENDGRID_API_KEY='{your_sendgrid_api_key}'
MONGODB_URL='mongodb://127.0.0.1:27017/{project_name}'
JWT_SECRET='{your_jwt_secret}'
```

