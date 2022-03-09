const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./routes/handler.js');
const mysql = require('mysql');
const cors = require('cors');
const req = require('express/lib/request');
// const { json } = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/',routesHandler);
app.use(cors());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "my_app"
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

    const sqlInsertUser = "INSERT INTO users (user_name,address,occupation,school,higherEdu,workPlace) VALUES (?,?,?,?,?,?)";
    db.query(sqlInsertUser, [user_name,address,occupation,school,higherEdu,workPlace], (error, result) => {
        console.log(error);
    });
});
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

//Music data operations
app.get('/selectAllMusic',(req,res) => {
    const sqlSelectAllMusic1 = "SELECT * FROM musicdata limit 100";
    db.query(sqlSelectAllMusic1, (error, result) => {
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
app.get('/popularSongs',(req,res) => {

    const sqlPopularSongs = "SELECT COUNT(SongId) as count FROM musicdata GROUP BY popularity ORDER BY popularity";
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