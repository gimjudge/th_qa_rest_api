'use strict';

const express = require("express");
const app =  express();
const jsonParser = require("body-parser").json;

const jsonCheck = (req, res, next) => {
    if ( req.body ) {
        console.log("The sky is", req.body.color);
    } else {
        console.log("There is no body property on the request");
    }
    next();
}

app.use(jsonCheck);
app.use(jsonParser());
app.use(jsonCheck);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Express server is listening on port", port);
});