import fetch from 'node-fetch';
import express from 'express';
import mongoose from 'mongoose';
import Post from './model/seedSchema.js';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://Darshna:399ixQwgeVLUAr95@darshna-cluster-1.0qbhmgk.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connected to Database"))
    .then(() => {
        app.listen(5000);
    }).catch((err) => console.log(err));

//fetch data from given api and stroing in database
async function getData() {
    const mypost = await fetch("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
    const response = await mypost.json();
    //console.log(response); 
    if (!response) {
        for (let i = 0; i < response.length; i++) {
            const date = response[i]["dateOfSale"];
            var parts = date.split("-"); //to extract month from date
            const month = parts[1];
            const post = new Post({
                id: response[i]["id"],
                title: response[i]["title"],
                price: response[i]["price"],
                description: response[i]["description"],
                category: response[i]["category"],
                image: response[i]["image"],
                sold: response[i]["sold"],
                dateOfSale: response[i]["dateOfSale"],
                monthOfSale: month
            });
            post.save();
        }
    }
}
getData();

//for getting whole data
router.get("/api/data", async (req, res) => {
    let data = await Post.find();
    if (!data) {
        return res.status(404).json({ message: "no data found" })
    }
    return res.status(200).json({ data });
}
    // res.send("welcome to page Darshna");
    // res.end();
);

//for monthly statistics

router.get("/datastats/:monthOfSale", async (req, res) => {
    let data;
    let cnt;
    let total = 0;
    let totItemsold = 0;
    let totItemNotsold = 0;
    const monthOfSale = req.params.monthOfSale;
    console.log(monthOfSale);
    data = await Post.find({ monthOfSale });
    cnt = await Post.count(monthOfSale);
    let i = 0;
    for (i in data) {
        const sold = data[i]["sold"];
        const price = data[i]["price"];
        if (sold) {
            total = total + price;
            totItemsold = totItemsold + 1;
        }
        if (!sold) {
            totItemNotsold = totItemNotsold + 1;
        }
    }
    if (!data) {
        return res.status(404).json({ message: "no data found" })
    }
    return res.status(200).json({ message: " Statistics for month", data, monthOfSale, total, totItemsold, totItemNotsold });
}
);

//for bar chart
app.get("/databar/:monthOfSale/:pricerange", async (req, res) => {
    const pricerange = req.params.pricerange;
    console.log(pricerange);
    const a = pricerange.split('-');
    let min = a[0];
    let max = a[1];
    console.log(min, max);
    const monthOfSale = req.params.monthOfSale;
    console.log(monthOfSale);
    let data = await Post.find({ monthOfSale });
    let i = 0;
    let count = 0;
    for (i in data) {
        let price = data[i]["price"];
        if (price > min && price < max) {
            count = count + 1;
        }
    }
    if (!data) {
        return res.status(404).json({ message: "No data found" });
    }
    return res.status(202).json({ monthOfSale, pricerange, count });
});

// for pie-chart

app.get("/datapie/:monthOfSale/:category", async (req, res, next) => {
    let data;
    let totalItemInCategoryJewel = 0;
    let totalItemInCategoryMens = 0;
    let totalItemInCategoryWomens = 0;
    let totalItemInCategoryElec = 0;
    const monthOfSale = req.params.monthOfSale;
    console.log(monthOfSale);
    const category = req.params.category;
    console.log(category);
    data = await Post.find({ monthOfSale: monthOfSale });
    console.log(data);
    let i = 0;
    let count = 0;
    for (i in data) {
        if (category === category) {
            count = count + 1;
        }
    }
    if (!data) {
        return res.status(404).json({ message: "No data found" });
    }
    return res.status(202).json({ monthOfSale, category, count });
});

app.listen(3010, () => {
    console.log("listening on port 3010");
});