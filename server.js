const express = require('express');
const path = require('path');
const pg = require('pg');
const uuid = require('uuid');
const db = require('./db');

// const ourDb = db(path.join(__dirname, './db.js'))

const PORT = 3000;


const app = express();

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, './index.html'))
})

app.get('/api/departments', (req, res, next) => {
    db.findAllDepartments()
    .then(departments => {
        res.send(departments.rows);
    })
    .catch(next);
})

app.get('/api/users', (req, res, next) => {
    db.findAllUsers()
    .then(users => {
        res.send(users.rows);
    })
    .catch(next);
});


// app.get('/api/offices', (req, res, next) => {
//     db(path.join(__dirname, './db.js')).findAllDepartments()
//     .then(departments => {
//         res.send(departments);
//     })
//     .catch(next);
// })

app.listen(PORT, () => {
    console.log(`Application started on port ${PORT}`)
})