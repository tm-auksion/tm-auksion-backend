const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("TM Auksion Backend işläp dur!");
});

app.listen(3000, () => {
    console.log("Server 3000 portda işläp başlady");
});
