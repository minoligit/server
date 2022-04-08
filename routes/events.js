const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const cors = require('cors');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "my_app"
});

//Event operations
router.post('/addEvent',(req,res) => {

    const title = req.body.title;
    const content = req.body.content;
    const eventOn = req.body.eventOn;
    const published = req.body.published;

    const sqlInsertUser = "INSERT INTO eventdata (title,content,eventOn,published) VALUES (?,?,?,?)";
    db.query(sqlInsertUser, [title,content,eventOn,published], (error, result) => {
        console.log(error);
    });
});
router.post('/selectAllEvents',(req,res) => {
    const sqlSelectAll = "SELECT * FROM eventdata ORDER BY eventOn DESC";
    db.query(sqlSelectAll, (error, result) => {
        res.send(result);
    });
});
router.post('/searchEvent',(req,res) => {
    const title = req.body.title;
    const eventOn = req.body.eventOn;
    const sqlSearchEvent = "SELECT * FROM eventdata WHERE title LIKE '%"+title+"%' OR eventOn ='"+eventOn+"'";
    db.query(sqlSearchEvent,(error, result) => {
        res.send(result);
    });
})

module.exports = router;
