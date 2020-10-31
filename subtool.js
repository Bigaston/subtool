const express = require('express')
const path = require("path");

const PORT = 3698

var app = express()

app.use("/public", express.static('./web/public'));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "./web/index.html"));
})

app.listen(PORT, () => console.log(`Serveur lancé sur ${PORT}`))