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

app.get('/searchUser',(req,res) => {
    const sqlSearchUser = "SELECT * FROM users WHERE user_id='1' ";
    db.query(sqlSearchUser, (error, result) => {
        res.send(result);
    });
});

app.get('/deleteUser/$user_id',(req,res) => {
    const user_id = req.params.user_id;

    const sqlDeleteUser = "DELETE FROM users WHERE user_id=? ";
    db.query(sqlDeleteUser, user_id,(error, result) => {
        console.log(error);
    });
});

app.get('/selectAllMusic',(req,res) => {
    const sqlSelectAllMusic1 = "SELECT * FROM musicdata";
    db.query(sqlSelectAllMusic1, (error, result) => {
        res.send(result);
    });
});

app.get('/popularSongs1',(req,res) => {

    const sqlPopularSongs1 = "SELECT COUNT(songId) AS Count1 FROM musicdata WHERE popularity=1 ";
    db.query(sqlPopularSongs1, (error, result) => {
        res.send(result);  
    });   
});
app.get('/popularSongs2',(req,res) => {
    const sqlPopularSongs2 = "SELECT COUNT(songId) AS Count2 FROM musicdata WHERE popularity=2 ";
    db.query(sqlPopularSongs2, (error, result) => {
        res.send(result);
    });
});
app.get('/popularSongs3',(req,res) => {
    const sqlPopularSongs3 = "SELECT COUNT(songId) AS Count3 FROM musicdata WHERE popularity=3 ";
    db.query(sqlPopularSongs3, (error, result) => {
        res.send(result);
    });
});
app.get('/mode0',(req,res) => {
    const sqlMode0 = "SELECT COUNT(songId) AS Mode0 FROM musicdata WHERE mode=0 ";
    db.query(sqlMode0, (error, result) => {
        res.send(result);
    });
});
app.get('/mode1',(req,res) => {
    const sqlMode1 = "SELECT COUNT(songId) AS Mode1 FROM musicdata WHERE mode=1 ";
    db.query(sqlMode1, (error, result) => {
        res.send(result);
    });
});

app.get('/richPeople',(req,res) => {

    const sqlRichPeople = "SELECT * FROM peopledata ORDER BY Worth_USD DESC LIMIT 3";
    db.query(sqlRichPeople, (error, result) => {
        res.send(result); 
    });   
});


// app.get('/popularSongs1',(req,res) => {
    
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
//     // console.log(x.dd);
//     // res.send(JSON.parse(y));
// });


const PORT = 8080;
app.listen(PORT, () => {
    console.log("Server is running");
});