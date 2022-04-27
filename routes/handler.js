const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const router = express.Router();
const placesdata = require(__dirname+'/../data/placesdata.json');
const modesdata = require(__dirname+'/../data/modesdata.json');
const navbarlocdata = require(__dirname+'/../data/navbarlocdata.json');
const fontsizesdata = require(__dirname+'/../data/fontsizesdata.json');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Sort json dataset
function sortByProperty(prop){  
    return function(a,b){  
       if(a[prop] > b[prop])  
          return 1;  
       else if(a[prop] < b[prop])  
          return -1;  
   
       return 0;  
    }  
 }
 
//Places data operations
router.get('/selectAllPlaces',(req,res) =>{
    res.end(JSON.stringify(placesdata));
});
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

const lastId = placesdata.length;
const nextId = lastId+1;

router.post('/addPlace',(req,res) =>{
   const id = nextId;
   const place = req.body.place;
   const address = req.body.address;

   let placeData = {"id":id,"place":place,"address":address,"views":0,"reactions":0,"comments":0};
   placesdata.push(placeData);
   const sortedPlaces = placesdata.sort(sortByProperty("id"));

   fs.writeFileSync(__dirname+'/../data/placesdata.json',JSON.stringify(sortedPlaces,null,4),function(err){
      if(err){
         console.log(err);
      }
      else{
         console.log("successfully added");
      }
   })
});

//Appearance data operations
router.get('/selectAllModes',(req,res) =>{
   res.end(JSON.stringify(modesdata));
});
router.get('/selectAllNavBarLoc',(req,res) =>{
   res.end(JSON.stringify(navbarlocdata));
});
router.get('/selectAllFontSizes',(req,res) =>{
   res.end(JSON.stringify(fontsizesdata));
});


module.exports = router;
