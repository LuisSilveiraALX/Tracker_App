const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config({path:'./config.env'});
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());

// mongodb
const con = require('./db/conection.js');

// uso de routes
app.use(require('./routes/route'));

con.then(db => {
    if (!db) return process.exit(1);

    // conecta http server
    app.listen(port,() => {
        console.log(`el servidor esta corriendo en el puerto: http://localhost:${port}`)
    })
    app.on('error', err => console.log(`failed to connect with htpp server: ${err}`))
    // error al conectar a mongodb
}).catch(error => {
    console.log(`Conection failed..! ${error}`)
})



