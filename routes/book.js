var express = require('express');
var router = express.Router();

router.use((req, res, next) => {
   console.log('Time:', Date.now())
   next()
})

router.get('/', function(req, res){
   res.send('GET route on book.');
});
router.post('/', function(req, res){
   res.send('POST route on book.');
});

module.exports = router;