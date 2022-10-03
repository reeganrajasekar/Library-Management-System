var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
   res.send('GET route on student.');
});
router.post('/', function(req, res){
   res.send('POST route on student.');
});

module.exports = router;