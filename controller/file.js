const mongoose = require("mongoose");
require("dotenv").config();
const Grid = require("gridfs-stream");

const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
// Init gfs
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

module.exports = {
  uploadFile: (req, res) => {
    res.json({ file: req.file });
  },
  getAllFiles: (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist",
        });
      }

      // Files exist
      return res.json(files);
    });
  },

  getIndividualFile: (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists",
        });
      }
      res.set({
        "Content-Type": file.contentType,
        "Content-Disposition": "attachment; filename=" + file.aliases,
      });
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    });
  },
};
