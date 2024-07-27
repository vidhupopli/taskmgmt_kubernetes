//////////////////////////////////////////////
// Purpose of this service is to sign up and sign in user
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

const authServiceURI = process.env.AUTH_URI;
// const authServiceURI = process.env.SERV_AUTH_SERVICE_HOST;
console.log('authServiceURI is -->', authServiceURI);

app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
  // It's just a dummy service - we don't really care for the email
  const email = req.body.email;
  const password = req.body.password;

  if (
    !password ||
    password.trim().length === 0 ||
    !email ||
    email.trim().length === 0
  ) {
    return res
      .status(422)
      .json({ message: 'An email and password needs to be specified!' });
  }

  try {
    console.log('request came in at /signup');
    const endpoint = `http://${authServiceURI}/hashed-password/` + password;
    console.log('making request at -->', endpoint);
    const response = await axios.get(endpoint);
    // since it's a dummy service, we don't really care for the hashed-pw either
    console.log(response.data, email);
    res.status(201).json({ message: 'User created!' });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: 'Creating the user failed - please try again later.' });
  }
});

app.post('/login', async (req, res) => {
  // It's just a dummy service - we don't really care for the email
  const email = req.body.email;
  const password = req.body.password;

  if (
    !password ||
    password.trim().length === 0 ||
    !email ||
    email.trim().length === 0
  ) {
    return res
      .status(422)
      .json({ message: 'An email and password needs to be specified!' });
  }

  // normally, we'd find a user by email and grab his/ her ID and hashed password
  const hashedPassword = password + '_hash';
  const response = await axios.get(
    `http://${authServiceURI}/token/` + hashedPassword + '/' + password
  );
  // const response = { status: 200, data: { token: 'abc' } };

  if (response.status === 200) {
    return res.status(200).json({ token: response.data.token });
  }

  return res.status(response.status).json({ message: 'Logging in failed!' });
});

app.listen(8080, () => {
  console.log('users service started @ 8080');
});
