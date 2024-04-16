require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const mongoDBUri =
    "mongodb+srv://ehtesamul99:55555@cluster0.ogknxls.mongodb.net/xy?retryWrites=true&w=majority&appName=Cluster0";

const index = express();
const PORT = process.env.PORT || 5000;

index.set('view engine', 'ejs');

index.get("/", (req, res) => {
    res.render("login");
});

mongoose
    .connect(mongoDBUri)
    .then(() => {
        console.log("MongoDB connection successful");

        // Start the server after a successful database connection
        index.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });