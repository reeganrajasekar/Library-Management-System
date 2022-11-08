const express = require('express');
const router = express.Router();
const Lib = require("../models/Lib");
const Book = require("../models/Book");
var nodemailer = require('nodemailer');
var transporter= nodemailer.createTransport({
   host: 'in-v3.mailjet.com',
   port: 587,
   auth: {
       user: 'd778da8cbf1df17b06e7155795152a69',
       pass: '1c01f8ea7ec1de80b6f33185148269b2'
   }
})
router.use((req, res, next) => {
   if(req.cookies['auth']=='true'){
      next()
   }else{
      res.redirect("/")
   }
})

router.get('/', async (req, res)=>{
   var libs = await Lib.find({permit:false}).sort({"timestamp":-1}).limit(20);
   var libsLists = await Lib.find({permit:true}).sort({"timestamp":-1});
   var total = await Lib.count({permit:true});
   res.render("lib/index.ejs" , {libs:libs , libsLists:libsLists , total:total} )
});

router.post("/delete", async (req,res)=>{
   var libs = await Lib.findByIdAndRemove(req.body.id)
   res.redirect("/lib")
   var book = await Book.findById(req.body.book_id)
   var upbook = await Book.findByIdAndUpdate(req.body.book_id , {
      stock:book.stock+1
  })
})

router.post("/view", async (req,res)=>{
   var lib = await Lib.findById(req.body.id)
   res.render("lib/view.ejs" , {lib:lib})
})

router.post("/update", async (req,res)=>{
   var lib = await Lib.findByIdAndUpdate(req.body.id ,{
      gettime:req.body.gettime,
      data:req.body.data,
      permit:true,
   })

   var mailOptions = {
      from: 'pmubookstore@gmail.com',
      to: student[0].student_email,
      subject:"Check Your Request Status",
      html: "<h1 style='text-align:center'>PMU BookStore</h1><p style='text-align:center'>You can check your request status by login PMU Bookstore app</p>"
  };
  
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error)
          res.redirect("/lib")
      } else {
          res.redirect("/lib")
      }
  });


})



module.exports = router;