import express from "express";
import FileUpload from "express-fileupload";
import cors from "cors";
import router from "./routes/ProductRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(FileUpload());
// membuat folder public menjadi static
app.use(express.static("public"));
app.use(router);

app.listen(5000, () => console.log("Server Up and Running..."));
