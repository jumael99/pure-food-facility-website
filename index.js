require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require('body-parser');
const orderSchema = require('./models/order');
const session = require('express-session');

const mongoDBUri =
    "mongodb+srv://ehtesamul99:55555@cluster0.uftmrbv.mongodb.net/pureFoodDB?retryWrites=true&w=majority&appName=Cluster0";

// Parse incoming request bodies in URL-encoded format
app.use(bodyParser.urlencoded({ extended: true }));

// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));

/*Render the order page*/
app.get("/", (req, res) => {
    res.render("order");
});

app.get('/admin-login', (req, res) => {
    res.render('adminlogin');
});


app.use(
    session({
        secret: 'my-secret-key', // Replace with a strong secret key
        resave: false,
        saveUninitialized: true,
    })
);

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


app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded admin credentials
    const adminUsername = 'admin';
    const adminPassword = 'admin';

    if (username === adminUsername && password === adminPassword) {
        // Set the isLoggedIn session variable to true
        req.session.isLoggedIn = true;
        // Redirect to the /show-database route if the credentials are valid
        res.redirect('/show-database');
    } else {
        // Render the adminlogin page with an error message
        res.render('adminlogin', { error: 'Invalid username or password' });
    }
});

app.get('/show-database', async (req, res) => {
    if (req.session.isLoggedIn) {
        try {
            const orders = await orderSchema.find(); // Fetch all orders from the database
            res.render('showdatabase', { orders }); // Pass the orders to the EJS template
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        // Redirect to the /admin-login route if the user is not logged in
        res.redirect('/admin-login');
    }
});

app.get('/delete/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        await orderSchema.findByIdAndDelete(orderId);
        res.redirect('/show-database');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/logout', (req, res) => {
    // Destroy the session and redirect to the /admin-login route
    req.session.destroy();
    res.redirect('/admin-login');
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