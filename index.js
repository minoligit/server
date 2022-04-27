const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./routes/handler.js');
const emailHandler = require('./routes/email.js');
// const eventsHandler = require('./routes/events.js');
const mysql = require('mysql');
const cors = require('cors');
const fileupload = require("express-fileupload");
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/',routesHandler);
app.use('/',emailHandler);
// app.use('/',eventsHandler);
app.use(fileupload());
app.use(express.static("files"));
app.use(cors());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "my_app"
});

function isNumeric(num){
    return !isNaN(num)
}
function setValue(qry){
    db.query(qry, (error, result) => {
        // console.log(result[0].Count);
        return (result);
    }); 
}

//Settings Operations
app.post('/verifyLogin',(req,res) => {
    const userName = req.body.userName;
    const password = req.body.password;

    const sqlVerifyLogin ="SELECT user_id,username FROM users WHERE username = '"+userName+"' && password = '"+
        password+"' LIMIT 1";;
    db.query(sqlVerifyLogin, (error, result) => {
        res.send(result);
    });
});
app.post('/updateAppearance',(req,res) => {
    const userId = req.body.userId;
    const mode = req.body.mode;
    const navBarLocation = req.body.navBarLocation;
    const fontSize = req.body.fontSize;
    var qryStr = "UPDATE userpreferences SET ";

    if(mode!=null&&mode!='undefined'){
        qryStr += ("mode='"+mode+"' ");
    }
    if(navBarLocation!=null&&navBarLocation!='undefined'){
        qryStr += ("navBarLocation='"+navBarLocation+"' ");
    }
    if(fontSize!=null&&fontSize!='undefined'){
        qryStr += ("fontSize='"+fontSize+"'");
    }

    qryStr += (" WHERE userId="+userId);
    db.query(qryStr, (error, result) => {
        console.log(error);
    });
});
app.post('/getTheme',(req,res) => {
    const userId = req.body.userId;

    const sqlGetMode = "SELECT mode from userpreferences WHERE userId="+userId+"";
    db.query(sqlGetMode, (error, result) => {
        res.send(result);
    });
});
app.post('/getAppearance',(req,res) => {
    const userId = req.body.userId;

    const sqlGetAppearance = "SELECT navBarLocation,fontSize from userpreferences WHERE userId="+userId+"";
    db.query(sqlGetAppearance, (error, result) => {
        res.send(result);
    });
});

//Employee Operations
app.post('/selectAllEmployees',(req,res) => {
    const sqlSelectAll = "SELECT * FROM employees";
    db.query(sqlSelectAll, (error, result) => {
        res.send(result);
    }); 
});
app.post('/getSuggestions',(req,res) => {
    const header = req.body.header;
    const operation = req.body.operation;
    const input = req.body.input;

    var sqlGetSuggestions = "SELECT DISTINCT "+header+" AS header FROM employees WHERE "+header+" LIKE ";

    if(operation=="Start with"){
        sqlGetSuggestions += ("'"+input+"%'");
    }
    else if(operation=="End with"){
        sqlGetSuggestions += ("'%"+input+"'");
    }
    else{
        sqlGetSuggestions += ("'%"+input+"%'");
    }
    sqlGetSuggestions += (" LIMIT 10");

    db.query(sqlGetSuggestions, (error, result) => {
        res.send(result);
    });
});
app.post('/getMinMax',(req,res) => {
    const header = req.body.header;

    const sqlGetMinMax = "SELECT MIN("+header+"), MAX("+header+") FROM employees";
    db.query(sqlGetMinMax, (error, result) => {
        res.send(result);
    });
});
app.post('/searchEmployees',(req,res) => {
    
    var headers = [];
    var operations = [];
    var inputs = [];
    var selectors = [];
    for(var i=0;i<req.body.header.length;i++){
        headers.push(req.body.header[i]);
        operations.push(req.body.operator[i]);
        inputs.push(req.body.value[i]);
        selectors.push(req.body.selector[i]);
    };
    
    var qryStr = "1";
    for (let i=0; i<headers.length; i++){
        if( headers[i]!='undefined'&&headers[i]!= null&&
            operations[i]!='undefined'&&operations[i]!= null&&
            inputs[i]!='undefined'&&inputs[i]!= null){
                if(isNumeric(inputs[i])){
                    qryStr += (" "+selectors[i]+" "+headers[i]+operations[i]+inputs[i]);
                }
                else{
                    if(operations[i]=="Start with"){
                        qryStr += (" "+selectors[i]+" "+headers[i]+" LIKE '"+inputs[i]+"%'");
                    }
                    else if(operations[i]=="End with"){
                        qryStr += (" "+selectors[i]+" "+headers[i]+" LIKE '%"+inputs[i]+"'");
                    }
                    else{
                        qryStr += (" "+selectors[i]+" "+headers[i]+" LIKE '%"+inputs[i]+"%'");
                    }
                }
        }
    };     
    const sqlSearchEmployees =  "CALL searchEmployee(\""+qryStr+"\");";
    db.query(sqlSearchEmployees, (error, result) => {
        res.send(result);
    });
});
app.get('/sendEmpDescription',(req,res) => {

    const sqlSendEmpDescription = "CALL sendEmpDescription();";
    db.query(sqlSendEmpDescription, (error, result) => {
        res.send(result);
    });
});


//Event operations
app.post('/addEvent',(req,res) => {

    const title = req.body.title;
    const content = req.body.content;
    const eventOn = req.body.eventOn;
    const published = req.body.published;

    const sqlInsertUser = "INSERT INTO eventdata (title,content,eventOn,published) VALUES (?,?,?,?)";
    db.query(sqlInsertUser, [title,content,eventOn,published], (error, result) => {
        console.log(error);
    });
});
app.post('/selectAllEvents',(req,res) => {
    const sqlSelectAll = "SELECT * FROM eventdata ORDER BY eventOn DESC";
    db.query(sqlSelectAll, (error, result) => {
        res.send(result);
    });
});
app.post('/searchEvent',(req,res) => {
    const title = req.body.title;
    const eventOn = req.body.eventOn;
    const sqlSearchEvent = "SELECT * FROM eventdata WHERE title LIKE '%"+title+"%' OR eventOn ='"+eventOn+"'";
    db.query(sqlSearchEvent,(error, result) => {
        res.send(result);
    });
});

//User operations
app.get('/selectAll',(req,res) => {
    const sqlSelectAll = "SELECT * FROM users";
    db.query(sqlSelectAll, (error, result) => {
        res.send(result);
    });
});
app.post('/insertUser',(req,res) => {

    const user_name = req.body.user_name;
    const address = req.body.address;
    const occupation = req.body.occupation;
    const school = req.body.school;
    const higherEdu = req.body.higherEdu;
    const workPlace = req.body.workPlace;
    const image = (__dirname+'\\images\\users\\'+user_name+'.jpg');

    const sqlInsertUser = "INSERT INTO users (user_name,address,occupation,school,higherEdu,workPlace,image) VALUES (?,?,?,?,?,?,?)";
    db.query(sqlInsertUser, [user_name,address,occupation,school,higherEdu,workPlace,image], (error, result) => {
        console.log(error);
    });
});
app.post('/addPhoto',(req,res) => {
    const file = req.files.image;
    const filename = req.body.imageName;
    const newpath = ('images\\users\\'+filename+'.jpg');

    file.mv(newpath, (err) => {
        if (err) {
            console.log(err);
        }
        else{ 
            console.log("Successfully uploaded");
        }
    });
})
app.post('/searchUser',(req,res) => {

    const user_name = req.body.userName;
    const sqlSearchUser = "CALL searchUser('"+user_name+"');";
    db.query(sqlSearchUser, (error, result) => {
        res.send(result);
    });
});
app.delete('/deleteUser',(req,res) => {
    
    const user_id = req.body.userId;
    const sqlDeleteUser = "DELETE FROM users WHERE user_id=? ";
    db.query(sqlDeleteUser, user_id,(error, result) => {
        console.log(error);
    });
});
app.post('/getLoggedUser',(req,res) => {

    const userId = req.body.userId;
    const sqlLoggedUser = "SELECT * FROM users WHERE user_id ="+userId;
    db.query(sqlLoggedUser, (error, result) => {
        res.send(result);
    });
});

//Music data operations
app.post('/selectAllMusic',(req,res) => {
    const sqlSelectAllMusic1 = "SELECT * FROM musicdata LIMIT 50";
    db.query(sqlSelectAllMusic1, (error, result) => {
        res.send(result);
    });
});
app.post('/selectedMusic',(req,res) => {
    const year = req.body.year;
    const sqlSelectedMusic = "SELECT * FROM musicdata WHERE year=? ";
    db.query(sqlSelectedMusic, year, (error, result) => {
        res.send(result);
    });
});
app.post('/recordsCount',(req,res) => {

    const sqlRecordsCount = "CALL recordsCount";
    db.query(sqlRecordsCount, (error, result) => {
        res.send(result);  
    });   
});
app.post('/viewMusic',(req,res) => {
    const songId = req.body.songid;
    const sqlViewMusic = "SELECT * FROM musicdata WHERE songId=? ";
    db.query(sqlViewMusic, songId, (error, result) => {
        res.send(result);
    });
});
app.post('/popularSongs',(req,res) => {

    const sqlPopularSongs = "SELECT COUNT(SongId) as count,popularity FROM musicdata GROUP BY popularity ORDER BY popularity";
    db.query(sqlPopularSongs, (error, result) => {
        res.send(result);  
    });   
});
app.get('/mode',(req,res) => {

    const sqlMode = "SELECT COUNT(SongId) as count FROM musicdata GROUP BY mode ORDER BY mode";
    db.query(sqlMode, (error, result) => {
        res.send(result);  
    });   
});

//People data operations
app.get('/richPeople',(req,res) => {
    const sqlRichPeople = "CALL richPeople();";
    db.query(sqlRichPeople, (error, result) => {
        res.send(result); 
    });   
});
app.get('/selectAllPeople',(req,res) => {
    const sqlSelectAllMusic1 = "SELECT * FROM peopledata";
    db.query(sqlSelectAllMusic1, (error, result) => {
        res.send(result);
    });
});
app.post('/searchCategory',(req,res) => {

    const category = req.body.ctg;
    const sqlPeopleCategory = "CALL peopleCategory('"+category+"');";
    db.query(sqlPeopleCategory, (error, result) => {
        res.send(result);
    });
});
app.post('/searchName',(req,res) => {

    const name = req.body.name;
    const sqlPeopleName = "CALL peopleName('"+name+"');";
    db.query(sqlPeopleName, (error, result) => {
        res.send(result);
    });
});
app.post('/addPeople',(req,res) => {
    const name = req.body.name;
    const worth = req.body.worth;
    const bYear = req.body.bYear;
    const category = req.body.category;

    const sqlInsertUser = "INSERT INTO peopledata (Name,BYear,Worth_USD,Category) VALUES (?,?,?,?)";
    db.query(sqlInsertUser, [name,bYear,worth,category], (error, result) => {
        console.log(error);
    });
})


// app.get('/popularSongs',(req,res) => {
    
//     const sqlPopularSongs = "SELECT * from musicdata limit "+req.query.limit+";";
//     console.log(sqlPopularSongs);
//     db.query(sqlPopularSongs, (error, result) => {
//         console.log(result);
        
//         res.send(result);
//     });

//     // const x = {sd:"dadsd",
//     //             dd:"sahan"
//     //             };
//     // const y = JSON.stringify(x);
//     // res.send(y);
//     // console.log(x.dd);
//     // res.send(JSON.parse(y));
// });


const PORT = 8080;
app.listen(PORT, () => {
    console.log("Server is running");
});