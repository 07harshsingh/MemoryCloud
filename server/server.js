require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db")
const errorHandler = require("./middlewares/errorHandler")
const authRouter = require("./routes/AuthRoutes")
const folderRouter = require("./routes/FolderRoutes")
const fileRouter = require("./routes/FileRoutes")

const app = express();
app.use(cors());

app.use(express.json());
connectDb();

app.use("/auth", authRouter);
app.use("/folder", folderRouter);
app.use("/file", fileRouter)

app.use("/", (req, res) => {
    res.send("MemoryCloud is running");
})

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is live at ${PORT}`);
})