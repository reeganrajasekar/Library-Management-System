const express = require('express');   
const router = express.Router();
const Book = require("../models/Book")


router.use((req, res, next) => {
   if(req.cookies['auth']=='true'){
      next()
   }else{
      res.redirect("/")
   }
})

router.get('/', async (req, res)=>{
   if(req.query.ISBN){
      var books = await Book.find({ISBN:req.query.ISBN}).sort({"timestamp":-1});
   }else if(req.query.book_name){
      var books = await Book.find({book_name:{ "$regex": req.query.book_name , "$options": "i" }}).sort({"timestamp":-1});
   }else if(req.query.dept){
      var books = await Book.find({dept:req.query.dept.toUpperCase()}).sort({"timestamp":-1});
   }else{
      var books = await Book.find().sort({"timestamp":-1}).limit(50);
   }
   var total = await Book.count();
   res.render("book/index" , {books:books, total:total})
});

router.post('/new', async (req, res)=>{
   var books = await Book({
      book_name:req.body.book_name,
      author_name:req.body.author_name,
      year:req.body.year,
      dept:req.body.dept,
      ISBN:req.body.ISBN,
      version:req.body.version,
      stock : req.body.stock,
   });
   books.save((err)=>{
      if(err){
         res.redirect("/book?err=ISBN Already Exist")
      }else{
         res.redirect("/book")
      }
   });
});

router.post('/edit', async (req, res)=>{
   var books = await Book.findById(req.body.id);
   res.render("book/update" , {books:books})
});

router.post('/update', async (req, res)=>{
   var books = await Book.findByIdAndUpdate(req.body.id , {
      book_name : req.body.book_name,
      author_name : req.body.author_name,
      year : req.body.year,
      ISBN : req.body.ISBN,
      version : req.body.version,
      dept : req.body.dept,
      stock : req.body.stock,
   })
   res.redirect("/book")
});

router.post('/delete', async (req, res)=>{
   var books = await Book.findByIdAndRemove(req.body.id);
   res.redirect("/book")
});

module.exports = router;