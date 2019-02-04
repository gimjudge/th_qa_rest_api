'use strict';

const express = require("express");
const router = express.Router();
const Question = require("./models").Question

router.param("qID", function(req, res, next, id){
    Question.findById(req.params.qID, function(err, doc){
        if(err) return next(err);
        if(!doc) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        } 
        req.question = doc;
        next();
    });
});
router.param("aID", function(req, res, next, id){
    req.answer = req.question.answers.id(id);
    if(!req.answer) {
        err = new Error("Not Found");
        err.status = 404;
        return next(err);
    } 
    next();
});

// GET /questions
// Return all the questions
router.get("/", (req, res, next) => {
    /*Question.find({}, null, {sort: {createdAt: -1}}, function(err, questions) {
        if (err) return next(err);
        res.json(questions);
    });*/
    Question.find({})
        .sort({createdAt: -1})
        .exec(function(err, questions) {
            if (err) return next(err);
            res.json(questions);
        });
    //res.json({response: "You sent me a GET request?"});
});

// POST /questions
// Return all the questions
router.post("/", (req, res, next) => {
    var question = new Question(req.body);
    question.save(function(err, question){
        if(err) return next(err);
        res.status(201);
        res.json(question);
    });
    /*
    res.json({
        response: "You sent me a POST request?",
        body: req.body
    });
    */
}); 

// GET /questions
// Route for specific questions
router.get("/:qID", (req, res, next) => {
    res.json(req.question);
    /*
    res.json({
        response: `You sent me a GET request for ID ${req.params.qID}?`
    });
    */
}); 

// POST /questions/:qID/answers
// Route for creating an answer
router.post("/:qID/answers", function (req, res, next) {
    req.question.answers.push(req.body);
    req.question.save(function(err, question){
        if(err) return next(err);
        res.status(201);
        res.json(question);
    });
    
    /*
    res.json({
        response: "You sent me a POST request to /answers",
        questionId: req.params.qID,
        body: req.body
    });
    */
}); 

// PUT /questions/:qID/answers/:aID
// Edit a specific answer
router.put("/:qID/answers/:aID", (req, res) => {
    req.answer.update(req.body, function(err, result){
        if(err) return next(err);
        res.json(result);
    });
    /*
    res.json({
        response: "You sent me a PUT request to /answers",
        questionId: req.params.qID,
        answerId: req.params.aID,
        body: req.body
    });
    */
});

// DELETE /questions/:qID/answers/:aID
// Delete a specific answer
router.delete("/:qID/answers/:aID", (req, res, next) => {
    req.answer.remove(function(err) {
        req.question.save(function(err, question){
            if(err) return next(err);
            res.json(question);
        });
    });
    /*
    res.json({
        response: "You sent me a DELETE request to /answers",
        questionId: req.params.qID,
        answerId: req.params.aID
    });
    */
}); 

// POST /questions/:qID/answers/:aID/vote-up
// POST /questions/:qID/answers/:aID/vote-down
// Post a specific answer
router.post("/:qID/answers/:aID/vote-:dir", (req, res, next) => {
    if (req.params.dir.search(/^(up|down)$/) === -1) {
        var err = new Error ("Not Found");
        err.status = 404;
        next(err);
    } else {
        req.vote = req.params.dir
        next();
    }
}, (req, res, next) => {
    req.answer.vote(req.vote, function(err, question){
        if(err) return next(err);
        res.json(question);
    });
    /*
    res.json({
        response: `You sent me a POST request to /vote-${req.params.dir}`,
        questionId: req.params.qID,
        answerId: req.params.aID,
        vote: req.vote
    });
    */
}); 

module.exports = router;