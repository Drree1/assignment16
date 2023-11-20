const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let team = [{
        _id: 1,
        name: "New England Patriots",
        owner: "Robert Kraft",
        appearances: "11 Super Bowl appearances",
        wins: "6 Super Bowl wins",
        founded: "The year 1959",
        legends: [
            "Tom Brady",
            "Bill Bellicheck",
            "Rob Gronkowski",
            "Julian Edelman",
            "Randy Moss"
        ],
    },
    {
        _id: 2,
        name: "Green Bay Packers",
        owner: "Mark Murphy",
        appearances: "5 Super Bowl appearances",
        wins: "4 Super Bowl wins",
        founded: "The year 1919",
        legends: [
            "Jordy Nelson",
            "Tim Harris",
            "Greg Jennings",
            "Charles Woodson",
            "Aaron Rodgers"
        ],
    },
    {
        _id: 3,
        name: "Pittsburgh Steelers",
        owner: "Dan Rooney",
        appearances: "8 Super Bowl appearances",
        wins: "6 Super Bowl Wins",
        founded: "The year 1933",
        legends: [
            "Will Allen",
            "Troy Polamalu",
            "Antonio Brown",
            "Ryan Shazier",
            "Joe Greene"
        ],
    },
    {
        _id: 4,
        name: "Baltimore Ravens",
        owner: "Steve Bisciotti",
        appearances: "2 Super Bowl appearances",
        wins: "2 Super Bowl wins",
        founded: "1996",
        legends: [
            "Johnathan Ogden",
            "Lamar Jackson",
            "Ed Reed",
            "Ray Lewis",
            "Joe Flacco"
        ],
    },
    {
        _id: 5,
        name: "Dallas Cowboys",
        owner: "Jerry Jones",
        appearances: "8 Super Bowl appearances",
        wins: "5 Super Bowl wins",
        founded: "1960",
        legends: [
            "Toney Dorsett",
            "Deion Sanders",
            "Terell Owens",
            "Larry Allen",
            "Troy Aikman"
        ],
    },
    {
        _id: 6,
        name: "New York Giants",
        owner: "John Mara",
        appearances: "5 Super Bowl appearances",
        wins: "4 Super Bowl wins",
        founded: "1925",
        legends: [
            "Harry Carson",
            "Lawrence Taylor",
            "Odell Beckham",
            "Victor Cruz",
            "Eli Manning"
        ],
    },
    
];

app.get("/api/teams", (req, res) => {
    res.send(team);
});

app.post("/api/teams", upload.single("img"), (req, res) => {
    const result = validateTeam(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const team = {
        _id: team.length + 1,
        name: req.body.name,
        owner: req.body.owner,
        player: req.body.players.split(",")
    }

    team.push(team);
    res.send(team);
});

app.put("/api/teams/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const team = team.find((r) => r._id === id);;

    const result = validateTeam(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    team.name = req.body.name;
    team.description = req.body.description;
    team.legends = req.body.legends.split(",");

    if (req.file) {
        team.img = "images/" + req.file.filename;
    }

    res.send(recipe);
});

app.delete("/api/teams/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const team = team.find((r) => r._id === id);

    if (!team) {
        res.status(404).send("The team was not found");
        return;
    }

    const index = team.indexOf(team);
    team.splice(index, 1);
    res.send(team);

});

const validateTeam = (team) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        ingredients: Joi.allow(""),
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required()
    });

    return schema.validate(team);
};

app.listen(3000, () => {
    console.log("I'm listening");
});