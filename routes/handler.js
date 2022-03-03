const express = require('express');
const router = express.Router();

const placesdata = require('../data/placesdata.json');

router.get('/selectAllPlaces',(req,res) =>{
    res.end(JSON.stringify(placesdata));
});

function sortByProperty(prop){  
    return function(a,b){  
       if(a[prop] > b[prop])  
          return 1;  
       else if(a[prop] < b[prop])  
          return -1;  
   
       return 0;  
    }  
 }

const lessViewed = placesdata.sort(sortByProperty("views"));
const mostViewed = lessViewed.reverse()
router.get('/mostViewed',(req,res) =>{
    res.end(JSON.stringify(mostViewed));
});
const lessReacted = placesdata.sort(sortByProperty("reactions"));
const mostReacted = lessReacted.reverse()
router.get('/mostReacted',(req,res) =>{
    res.end(JSON.stringify(mostReacted));
});


module.exports = router;
