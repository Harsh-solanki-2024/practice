const jwt = require('jsonwebtoken');

const verify = (req,res,next) => {
    console.log(req.cookies)
    var token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err)=> {
        if (err) {
          res.status(403).send({ success: false, message: "Failed to authenticate user." })
        } else {
          next();
        }
      })
    } else {
      res.status(403).send({ success: false, message: "No Token Provided." })
    }
//   jwt.verify(req.cookie.token, process.env.SECRETKEY)
}

module.exports = verify;