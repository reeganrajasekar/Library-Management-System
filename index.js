const express = require("express")
const app = express();
app.use(express.static('public'))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

const lib = require("./routes/lib")
app.use('/lib', lib);

const book = require("./routes/book")
app.use('/book', book);

const student = require("./routes/student")
app.use('/student', student);

const staff = require("./routes/staff")
app.use('/staff', staff);

app.get("/",(req,res)=>{
    res.render("login.ejs",{query : ""})
})

app.post("/",(req,res)=>{
    if(req.body.email=="try@gmail.com" && req.body.password=="try"){
        res.render("index.ejs");
    }else{
        res.render("login.ejs",{query : "Username or Password is wrong"})
    }
})

app.listen(3000,(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Server Started http://localhost:3000");
    }
})