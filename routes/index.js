const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const fileController = require("./../controller/file");
const userController = require("./../controller/user");
const uploader = require("../middleware/multer");
const file = require("./../controller/file");

//userRoutes
router.post("/user/register", userController.registerUser);
router.post("/user/login", userController.loginuser);
router.get("/user", auth, userController.getUser);
router.post("/user/tokenIsValid", userController.tokenValid);

//fileRoutes
router.post(
  "/upload",
  auth,
  uploader.single("myfile"),
  fileController.uploadFile
);
router.get("/files", auth, fileController.getAllFiles);
router.get("/file/:filename", fileController.getIndividualFile);
module.exports = router;
