var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
   res.send('GET route on staff.');
});
router.post('/', function(req, res){
   res.send('POST route on staff.');
});

module.exports = router;