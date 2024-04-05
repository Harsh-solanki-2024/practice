const jwt = require('jsonwebtoken');

const verify = (req,res,next) => {
    console.log(req.cookies)
    var token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err)=> {
        if (err) {
           res.redirect("/");
        } else {
          next();
        }
      })
    } else {
      res.redirect("/");
    }
}

module.exports = verify;