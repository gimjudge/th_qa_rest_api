'use strict';

const express = require("express");
const app =  express();
const routes =  require('./routes');

const jsonParser = require("body-parser").json;
const logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

var mongoose =  require("mongoose");

mongoose.connect ("mongodb://localhost:27017/qa", { useNewUrlParser: true });

var db = mongoose.connection;

db.on("error", (err) => {
    console.error("connection error:", err);
});

db.once("open", () => {
    console.log("connection successful");
});

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if(req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
    }
    next();
});

app.use("/questions", routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Express server is listening on port", port);
});