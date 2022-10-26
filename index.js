const express = require("express")
const app = express();
app.use(express.static('public'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/LMS', { useNewUrlParser: true });

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use(bodyParser.json())

const api = require("./routes/api")
app.use('/api', api);

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

app.get("/logout" , (req,res)=>{
    res.cookie('auth','')
    res.redirect("/")
})
app.post("/",(req,res)=>{
    if(req.body.email=="201700865@gmail.com" && req.body.password=="Zainab"){
        res.cookie('auth',true)
        res.redirect("/lib")
    }else{
        res.render("login.ejs",{query : "Username or Password is wrong"})
    }
})

app.listen(80,'0.0.0.0',(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Server Started");
    }
})
