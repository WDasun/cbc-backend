import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRoute.js';
import jwt from "jsonwebtoken";

const app = express();

app.use(bodyParser.json());

app.use(
    (req, res, next) => {
        const tokenString = req.header("Authorization")
        if (tokenString != null) {
            // Replace with the space
            const token = tokenString.replace("Bearer ", "")

            jwt.verify(token, "cbc-batch-five@2025",
                (err, decoded) => {
                    if (decoded != null) {
                        req.user = decoded
                        next()
                    } else {
                        console.log("Invalid token")
                        res.status(403).json({
                            message: "Invalid token"
                        })
                    }
                }
            )
        } else {
            next()
        }
    }
)

mongoose.connect("mongodb+srv://admin:admin123@cluster0.tlo4enw.mongodb.net/?appName=Cluster0").then(() => {
    console.log("Connected to the database")
}).catch(() => {
    console.log("Database connection failed")
});

app.use("/products", productRouter);
app.use("/users", userRouter);


app.listen(5000, (req, res) => {
    console.log('Server running Port 5000');
});