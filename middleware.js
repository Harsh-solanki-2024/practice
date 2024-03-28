const jwt = require('jsonwebtoken');

const verify = (req,res,next) => {
    console.log(req.cookies)
    var token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=> {
        if (err) {
          res.status(403).send({ success: false, message: "Failed to authenticate user." })
        } else {
          req.decoded = decoded
          console.log(decoded);
          next();
        }
      })
    } else {
      res.status(403).send({ success: false, message: "No Token Provided." })
    }
//   jwt.verify(req.cookie.token, process.env.SECRETKEY)
}

module.exports = verify;