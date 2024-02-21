const fs = require("fs");

const fileDelete = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
    console.log("unlink!");
  });
};

module.exports = fileDelete;
