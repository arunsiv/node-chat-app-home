const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.port || 3000;

var app = express();

//Static Middleware
app.use(express.static(publicPath));


//Server
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});