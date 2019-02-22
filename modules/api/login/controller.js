import firebase, { firestore, app } from 'firebase-admin';
var jwt = require('jsonwebtoken');

export const register = async (req, res) => {
  console.log(req.body);
  let user = req.body;
  try {

    var usersRef = {
      email: user.email,
      passowrd: user.password
    }
    await firebase.auth().createUser(usersRef).then(response => {
      console.log(response);
      let token = createToken();
      return res.status(200).json({ error: false, message: "Se registró con exito", token: token });
    }).catch(err => {
      console.log(err.errorInfo.message);
      return res.status(400).json({ error: true, message: err.errorInfo.message });
    })

  } catch (error) {
    return res.status(400).json({ error: true, message: error });
  }

}

export const log_in = async (req, res) => {
  let user = req.body;
  try {

    await firebase.auth().getUserByEmail(user.email).then(response => {
      console.log("login");
      console.log(response);
      let token = createToken();
      return res.status(200).json({ error: false, message: "Login successfull", token: token });

    }).catch(error => {
      return res.status(400).json({ error: true, message: error });
    })

  } catch (error) {
    return res.status(500).json({ error: true, message: error });
  }
}

const createToken = async () => {
  const payload = {
    check: true
  };
  var token = await jwt.sign(payload, process.env.SECRET_PASSWORD, {
    expiresIn: 20 // expires in 24 hours
  });
  return token
}
