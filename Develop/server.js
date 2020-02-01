const express = require("express");
const path = require("path");
let db = require("./db/db.json");
const fs = require("fs");
const util = require("util");

let app = express();

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
})

app.get("/api/notes", function (req, res) {
    readFileAsync("./db/db.json", "utf8").then(function (data) {
        data = JSON.parse(data)
        //console.log(data)
        return res.json(data);
    })
});

app.post("/api/notes", function (req, res) {
    var newNotes = req.body;

    //console.log(newNotes)

    readFileAsync("./db/db.json", "utf8").then(function (data) {
        data = JSON.parse(data)
        //console.log(data);
        data.push(newNotes);

        data[data.length - 1].id=data.length-1;

        writeFileAsync("./db/db.json", JSON.stringify(data));
    })
    res.send("created notes!")
})

app.delete("/api/notes/:id", function (req, res) {
    var idReceived = req.params.id
    console.log(idReceived)

    readFileAsync("/db/db.json", "utf8").then(function (data) {
        data = JSON.parse(data)

        data.splice(idReceived,1);

        for (let i = 0; i < data.length; i++) {
            data[i].id=i;
        };

        writeFileAsync("./db/db.json", JSON.stringify(data));
    })
    res.send("cleared!")
});

app.listen(PORT, function () {
    console.log("APP listening on PORT" + PORT);
})