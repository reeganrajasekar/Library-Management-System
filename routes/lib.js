const express = require('express');
const router = express.Router();
const Lib = require("../models/Lib");
const Book = require("../models/Book");

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
   res.redirect("/lib")
})



module.exports = router;