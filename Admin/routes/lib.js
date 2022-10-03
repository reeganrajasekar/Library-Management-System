var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
   res.send('GET route on lib.');
});
router.post('/', function(req, res){
   res.send('POST route on lib.');
});

module.exports = router;