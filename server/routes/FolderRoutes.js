const auth = require("../middlewares/auth")
const express = require("express");
const router = express.Router();

const {getFolder,getFolderById, deleteFolder, updateFolder, createFolder} = require("../controllers/FolderControllers")

router.get("/", auth, getFolder);
router.get("/:id", auth, getFolderById);
router.post("/", auth, createFolder);
router.delete("/:id", auth, deleteFolder);
router.put("/:id", auth, updateFolder);

module.exports = router;