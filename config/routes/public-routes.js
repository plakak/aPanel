var express = require('express');

var router = express.Router();


router.get('/getData/:type/:id?/', (req, res) => {
    res.end(req.path);
});

exports.router = router;
