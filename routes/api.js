const express = require('express');   
const router = express.Router();
const Student = require("../models/Student");
const Lib = require("../models/Lib")
const Book = require("../models/Book")
const Staff = require("../models/Staff");
var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'charley.legros@ethereal.email',
        pass: 'R3nPgDAkPWnADKdgG6'
    }
});

const api_staff = require("./api_staff")
router.use('/staff', api_staff);

router.post('/forgot', async (req, res)=>{
    var student = await Student.find({student_email:req.body.email});
    var staff = await Staff.find({staff_email:req.body.email});

    if (student[0]) {
        var mailOptions = {
            from: 'ganree2002@gmail.com',
            to: student[0].email,
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.json(error);
            } else {
                res.json('Email sent: ' + info.response);
            }
        });
        
    } else if (staff[0]) {
        var mailOptions = {
            from: 'ganree2002@gmail.com',
            to: staff[0].email,
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.json(error);
            } else {
                res.json('Email sent: ' + info.response);
            }
        });
        
    }else{
        res.json({
            code:"Wrong Email"
        })
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
            code:"Wrong Username or Password"
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