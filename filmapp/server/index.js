import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {searchHandler} from "./search.js";

dotenv.config();
const port = 3001;
const apiKey = process.env.TMDB_API_KEY;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/search', searchHandler(apiKey));


app.listen(port);

