const express = require('express');
const router = express.Router();
const Staff = require("../models/Staff")


router.use((req, res, next) => {
   if(req.cookies['auth']=='true'){
      next()
   }else{
      res.redirect("/")
   }
})

router.get('/', async (req, res)=>{
   var staffs = await Staff.find({access:false})

   if(req.query.staff_id){
      var staffsList = await Staff.find({access:true,staff_id:req.query.staff_id}).sort({"timestamp":-1});
   }else if(req.query.staff_name){
      var staffsList = await Staff.find({access:true,staff_name:{ "$regex": req.query.staff_name , "$options": "i" }}).sort({"timestamp":-1});
   }else{
      var staffsList = await Staff.find({access:true}).sort({"timestamp":-1});
   }
   var total = await Staff.find({access:true}).count();
   res.render("staff/index" , {staffs:staffs , staffsList:staffsList ,total:total})
});

router.post('/access',async (req,res)=>{
   var staff = await Staff.findByIdAndUpdate(req.body.id , {access:true })
   res.redirect("/staff")
})

router.post('/delete',async (req,res)=>{
   var staff = await Staff.findByIdAndRemove(req.body.id)
   res.redirect("/staff")
})

module.exports = router;