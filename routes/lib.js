var express = require('express');
var router = express.Router();

router.use((req, res, next) => {
   if(req.cookies['auth']=='true'){
      next()
   }else{
      res.redirect("/")
   }
})

router.get('/', function(req, res){
   res.render("lib/index.ejs")
});
router.post('/', function(req, res){
   res.send('POST route on lib.');
});

module.exports = router;