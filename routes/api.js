const express = require('express');   
const router = express.Router();
const Student = require("../models/Student");
const Lib = require("../models/Lib")
const Book = require("../models/Book")
const Staff = require("../models/Staff");
var nodemailer = require('nodemailer');

var reset_list = {'8219191': 'student'}

var transporter= nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
        user: 'pmubookstore@gmail.com',
        pass: '6MUjBhxHVI324fza'
    }
})

const api_staff = require("./api_staff");
const { findOneAndUpdate } = require('../models/Student');
router.use('/staff', api_staff);

router.get('/forgot', async (req, res)=>{
    res.send(
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                html{
                    height:95vh
                }
            </style>
        </head>
        <body style="height:90%">
            <div style="height:100%;background-color:#F5DBCC;padding:40px;display:flex;justify-content:center;flex-direction: column;">
                <h1 style="text-align:center">PMU Bookstore - Password Reset</h1>
                <center>
        
                    <form action="forgot" method="post">
                        <input type="email" placeholder="Email" name="email" required style="font-size:26px;width:100%;height:50px" id=""><br><br>
                        <button style="width:100%;height:50px;background-color: #F67327;color:white;border:none;font-size: 26px;">Reset</button>
                    </form>
                </center>
            </div>
        </body>
        
        </html>
        `
    )
});

router.post('/forgot', async (req, res)=>{
    var student = await Student.find({student_email:req.body.email});
    var staff = await Staff.find({staff_email:req.body.email});

    if (student[0]) {
        reset_list[student[0].student_id] = "student"
        var mailOptions = {
            from: 'pmubookstore@gmail.com',
            to: student[0].student_email,
            subject:"Password Reset",
            text: "<h1 style='text-align:center'>PMU BookStore</h1><a href='http://ec2-65-2-181-127.ap-south-1.compute.amazonaws.com/api/reset?id="+student[0].student_id+"'>reset password</a>"
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error)
                res.send("<h1 style='padding:40px;text-align:center;color:#F67327'>Server Busy Try Again</h1>")
            } else {
                res.send("<h1 style='padding:40px;text-align:center;color:#F67327'>Check your mail</h1>")
            }
        });
         
    } else if (staff[0]) {
        reset_list.staff[0].staff_id = "staff"
        var mailOptions = {
            from: 'pmubookstore@gmail.com',
            to: staff[0].staff_email,
            subject: staff[0].staff_email+" Password",
            text: "<h1 style='text-align:center'>PMU BookStore</h1><a href='http://ec2-65-2-181-127.ap-south-1.compute.amazonaws.com/api/reset?id="+staff[0].staff_id+"'>reset password</a>"
        };
        
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send("<h1 style='padding:40px;text-align:center;color:#F67327'>Server Busy Try Again</h1>")
        } else {
            res.send("<h1 style='padding:40px;text-align:center;color:#F67327'>Check your mail</h1>")
        }
        });
        
    }else{
        res.send("<h1 style='padding:40px;text-align:center;color:#F67327'>Wrong Email</h1>")
    }
});

router.get('/reset',(req,res)=>{
    if(reset_list[req.query.id]){
        res.send(
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset</title>
                <style>
                    html{
                        height:95vh
                    }
                </style>
            </head>
            <body style="height:90%">
                <div style="height:100%;background-color:#F5DBCC;padding:40px;display:flex;justify-content:center;flex-direction: column;">
                    <h1 style="text-align:center">PMU Bookstore - Password Reset</h1>
                    <center>
            
                        <form action="reset" method="post">
                            <input type="password" placeholder="New Password" name="password" required style="font-size:26px;width:100%;height:50px" id=""><br><br>
                            <input type="hidden" value='`+req.query.id+`' name="id" >
                            <button style="width:100%;height:50px;background-color: #F67327;color:white;border:none;font-size: 26px;">Reset</button>
                        </form>
                    </center>
                </div>
            </body>
            
            </html>
            `
        )
    }else{
        res.sendStatus(404)
    }
})

router.post('/reset', async (req, res)=>{
    var student = await Student.find({student_id:req.body.id});
    var staff = await Staff.find({staff_id:req.body.id});

    if (student[0]) {
        var student_up = Student.findOneAndUpdate({student_id:req.body.id},{student_password:req.body.password},null,(err)=>{if(err){console.log(err);}})
        var student = await Student.find({student_id:req.body.id});

        var mailOptions = {
            from: 'pmubookstore@gmail.com',
            to: student[0].student_email,
            subject: "PMU BookStore",
            text: "Password reset Successfully"
        };
        
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send("<h1 style='padding:40px;text-align:center;color:#F67327'>Server Busy Try Again</h1>")
        } else {
            res.send("<h1 style='padding:40px;text-align:center;color:#F67327'>Password reset Successfully</h1>")
        }
        });
        reset_list[student[0].student_id]
         
    } else if (staff[0]) {
        var staff_up = Staff.findOneAndUpdate({staff_id:req.body.id},{staff_password:req.body.password},null,(err)=>{if(err){console.log(err);}})
        var staff = await Staff.find({staff_id:req.body.id});

        var mailOptions = {
            from: 'pmubookstore@gmail.com',
            to: staff[0].staff_email,
            subject: "PMU BookStore",
            text: "Password reset Successfully"
        };
        
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send("<h1 style='padding:40px;text-align:center;color:#F67327'>Server Busy Try Again</h1>")
        } else {
            res.send("<h1 style='padding:40px;text-align:center;color:#F67327'>Password reset Successfully</h1>")
        }
        });

        reset_list[staff[0].staff_id]
        
    }else{
        res.sendStatus(404)
    }
});

router.post('/', async (req, res)=>{
    var student = await Student.find({student_email:req.body.student_email , student_password:req.body.student_password});
    if (student.length == 1) {
        if (student[0].access) {
            res.json({
                code:"Ok",
                student:student
            })
        } else {
            res.json({
                code:"you are in Waiting List"
            })
        }
        
    } else{
        res.json({
            code:"Incorrect Username or Password! Please recheck & Tryagain"
        })
    }
});

router.post('/register', async (req, res)=>{
    var student = await Student({
       student_name : req.body.student_name,
       student_id : req.body.student_id ,
       student_email :req.body.student_email ,
       student_password : req.body.student_password,
       dept : req.body.dept,
       access : false,
    })
    student.save((err,result)=>{
        if(err){
            res.json({
                code:"Student details already exists try login"
            })
        }else{
            res.json({code:"registered"})
        }
    });
 });

router.get("/books" , async (req, res)=>{
    if (req.query.book_name) {
        var book = await Book.find({book_name:{ "$regex": req.query.book_name , "$options": "i" } , dept:req.query.dept , stock:{"$ne":0}});
    } else {
        var book = await Book.find({dept:req.query.dept, stock:{"$ne":0}}).sort({"timestamp":-1}).limit(50);
    }
    res.json(book)
});


router.get("/lib" , async (req, res)=>{
    var lib = await Lib.find({student_id:req.query.student_id});
    res.json(lib)
});

router.post("/request" , async (req, res)=>{
    var book = await Book.findById(req.body.book_id)
    if(book.stock>0){
        var libs = await Lib({
            student_id : req.body.student_id,
            person_name:req.body.student_name,
            book_id: req.body.book_id,
            book_name:req.body.book_name,
            permit:false,
            data:"Waiting List"
        })
        libs.save()
        var upbook = await Book.findByIdAndUpdate(req.body.book_id , {
            stock:book.stock-1
        })
        res.json({
            code:"Requested"
        })
    }else{
        res.json({
            code:"Out of Stock"
        })
    }
});

module.exports = router;