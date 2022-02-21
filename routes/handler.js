const express = require('express');
const router = express.Router();

router.get('/places',(req,res) =>{
    const str = [{
        "id": 1,
        "place": "place1",
        "address": "address1"
    }];
    res.end(JSON.stringify(str));
});

router.post('/addElement',(req,res) => {
    res.end('NA');
});

module.exports = router;
