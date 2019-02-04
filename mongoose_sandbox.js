'use strict';

var mongoose =  require("mongoose");

mongoose.connect ("mongodb://localhost:27017/sandbox", { useNewUrlParser: true });

var db = mongoose.connection;

db.on("error", (err) => {
    console.error("connection error:", err);
});

db.once("open", () => {
    console.log("connection successful");
    // All DB communication goes here

    var Schema =  mongoose.Schema;
    let AnimalSchema = new Schema({
        type: {type: String, default: "goldfish" },
        size: String,
        color: {type: String, default: "golden" },
        mass: {type: Number, default: "0.007" },
        name: {type: String, default: "Angela" },
    });

    AnimalSchema.pre("save", function (next) {
        if( this.mass >= 100 ) {
            this.size = "big";
        } else if( this.mass >= 5 && this.mass < 100 ) {
            this.size = "medium";
        } else {
            this.size = "small";
        }
        next();
    });

    AnimalSchema.statics.findSize = function(size, callback) {
        //this == animal
        return this.find({size: size}, callback);
    }

    AnimalSchema.methods.findSameColor = function (callback) {
        //this == document
        return this.model("Animal").find({color: this.color}, callback);
    }

    var Animal = mongoose.model("Animal", AnimalSchema);

    var elephant = new Animal ({
        type: "elephant",
        color: "grey",
        mass: 6000,
        name: "Law"
    });

    var animal = new Animal({});

    var whale = new Animal ({
        type: "whale",
        mass: 200000,
        name: "Fart"
    });

    var animalData = [
        {
            type: "mouse",
            color: "small",
            mass: 0.035,
            name: "Moon"
        },
        {
            type: "nutria",
            color: "brown",
            mass: 6.35,
            name: "Gretchen"
        },
        {
            type: "wold",
            color: "grey",
            mass: 45,
            name: "Iris"
        },
        whale,
        animal,
        elephant
    ];

    Animal.deleteMany({}, (err) => {
        if (err) console.error(err);
        Animal.create(animalData, (err, animals) => {
            if (err) console.error(err);
            /*
            Animal.findSize('medium', (err, animals) => {
                animals.forEach((animal) => {
                    console.log(animal.name + " the " + animal.color + " " + animal.type + " is a " + animal.size + "-sized animal.");
                });
                db.close( () => {
                    console.log("db connection closed.");
                });
            });
            */
            Animal.findOne({type: 'elephant'}, (err, elephant) => {
                elephant.findSameColor(function(err, animals) {
                    if (err) console.error(err);
                    animals.forEach(function(animal) {
                        console.log(animal.name + " the " + animal.color + " " + animal.type + " is a " + animal.size + "-sized animal.");
                    });
                    db.close( () => {
                        console.log("db connection closed.");
                    });
                });
            });
        });
    });

});