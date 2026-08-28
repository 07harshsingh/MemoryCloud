const express = require("express");
const auth = require("../middlewares/auth");

const router = express.Router();

const {uploadFile, getFiles, deleteFile} = require("../controllers/FileController");
const upload = require("../middlewares/upload")

router.post("/upload/:folderId", auth, upload.array("images", 10), uploadFile);
router.get("/folder/:folderId", auth, getFiles);
router.delete("/:id", auth, deleteFile);

module.exports = router;