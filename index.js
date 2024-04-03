const express = require('express');
const app = express()
const port = 3050;
const routers = require('./routers/route');

app.use(routers);
app.set('view engine', 'ejs')

app.all('*',(req,res)=>{
  res.send("Error 404 page not found");
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


