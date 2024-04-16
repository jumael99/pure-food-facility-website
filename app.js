require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const mongoDBUri =
    "mongodb+srv://ehtesamul99:55555@cluster0.ogknxls.mongodb.net/xy?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("login");
});

mongoose
    .connect(mongoDBUri)
    .then(() => {
        console.log("MongoDB connection successful");

        // Start the server after a successful database connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });