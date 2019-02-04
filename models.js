'use strict';

var mongoose =  require("mongoose");

var sortAnswers = function(a, b) {
    if (a.votes === b.votes) {
        return b.updateAt - a.updatedAt;
    }
    return b.votes - a.votes;
};

var Schema =  mongoose.Schema;

let AnswerSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    votes: {type: Number, default:0}
});

AnswerSchema.method("update", function(updates, callback) {
    Object.assign(this, updates, {updateAt: new Date()});
    this.parent().save(callback);
});

AnswerSchema.method("vote", function(vote, callback) {
    if (vote === "up") {
        this.votes += 1;
    } else if (vote === "down") {
        this.votes -= 1;
    }
    this.parent().save(callback);
});

let QuestionSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    answers: [AnswerSchema]
});

QuestionSchema.pre("Save", function(next) {
    this.answers.sort(sortAnswers);
    next();
});

var Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;