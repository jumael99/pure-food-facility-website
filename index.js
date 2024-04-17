require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require('body-parser');
const orderSchema = require('./models/order');

const mongoDBUri =
    "mongodb+srv://ehtesamul99:55555@cluster0.uftmrbv.mongodb.net/pureFoodDB?retryWrites=true&w=majority&appName=Cluster0";

// Parse incoming request bodies in URL-encoded format
app.use(bodyParser.urlencoded({ extended: true }));

// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));

/*Render the order page*/
app.get("/", (req, res) => {
    res.render("order");
});

/*Post method to submit the form*/
app.post('/order', async (req, res) => {
    try {
        const { name, mobile, address, quantity } = req.body;
        const order = new orderSchema({ name, mobile, address, quantity });
        await order.save();
        res.render('success', { message: 'Order placed successfully!' });
    } catch (err) {
        console.error(err);
        res.render('error', { message: 'Error placing order.' });
    }
});

mongoose
    .connect(mongoDBUri)
    .then(() => {
        console.log("MongoDB connection successful");

        // Start the server after a successful database connection
        app.listen(3000, () => {
            console.log(`Server running on port ${3000}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });