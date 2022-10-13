const express = require('express');   
const router = express.Router();
const Staff = require("../models/Staff");
const Lib = require("../models/Lib")
const Book = require("../models/Book")

router.post('/', async (req, res)=>{
    var staff = await Staff.find({staff_email:req.body.staff_email , staff_password:req.body.staff_password});
    if (staff.length == 1) {
        if (staff[0].access) {
            res.json({
                code:"Ok",
                staff:staff
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
    var staff = await Staff({
       staff_name : req.body.staff_name,
       staff_id : req.body.staff_id ,
       staff_email :req.body.staff_email ,
       staff_password : req.body.staff_password,
       dept : req.body.dept,
       access : false,
    })
    stass.save((err,result)=>{
        if(err){
            res.json({
                code:"Staff details already exists try login"
            })
        }else{
            res.json({code:"registered"})
        }
    });
 });

router.get("/books" , async (req, res)=>{
    if (req.query.book_name) {
        var book = await Book.find({book_name:{ "$regex": req.query.book_name , "$options": "i" }});
    } else {
        var book = await Book.find().sort({"timestamp":-1}).limit(50);
    }
    res.json(book)
});

router.post("/request" , async (req, res)=>{
    var libs = await Lib({
        staff_id : req.body.staff_id,
        person_name:req.body.staff_name,
        book_id: req.body.book_id,
        book_name:req.body.book_name,
        permit:false,
    })
    libs.save()
    var book = await Book.findById(req.body.book_id)
    var upbook = await Book.findByIdAndUpdate(req.body.book_id , {
        stock:book.stock-1
    })
    res.json({
        code:"Requested"
    })
});

module.exports = router;