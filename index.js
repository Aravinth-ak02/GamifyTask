import http from "http";
import express from "express";
import mongoose from "mongoose";
let app = express();
import { fileURLToPath } from 'url';
import { admin } from "./routes/admin.js";
import { user } from "./routes/user.js";
import { CONFIG } from "./config.js";
import path from "path"
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const __dirname = path.dirname(fileURLToPath(
    import.meta.url));
mongoose.connect(CONFIG.MONGO_URL).then(() => {
    console.log("mongo connected successfully");
});

app.use((req, res, next) => {
    // console.log(req.originalUrl)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next()
});

app.use('/v1/admin', admin);
app.use('/v1/user', user);
app.use('/admin',express.static(path.join(__dirname,"dist/admin")));
app.get("/admin/*",(req,res)=>{
    return res.sendFile(path.join(__dirname,"dist/admin","index.html"));
});
app.use('/',express.static("dist/user"));
app.get("/*",(req,res)=>{
    return res.sendFile(path.join(__dirname,"dist/user","index.html"))
});
app.listen(CONFIG.PORT, () => {
    console.log("Server run over 8000");
})