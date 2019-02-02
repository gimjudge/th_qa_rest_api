'use strict';

const express = require("express");
const app =  express();


app.use('/:noun',(req, res, next) => {
    req.noun = req.params.noun;
    next();
});
app.use((req, res, next) => {
    req.myMessage = `The ${req.noun} is ${req.query.color}`;
    console.log (req.myMessage);
    next();
});

app.use('/', (req, res, next) => {
    console.log ('Root Route');
    res.send(req.myMessage);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Express server is listening on port", port);
});