const router = require("express").Router();
const path = require("path");
const { s3Upload } = require("../controller/s3Controller");
const uuid = require("uuid").v4;

const upload = require('multer')({});

router.post("/:foldername", upload.any(), async (req, res) => {
    const foldername = req.params.foldername;
    console.log(foldername,"FOLDER");
    
    try {
  
      if (!req.files) {
        return res
        .status(400)
        .send({ message:"File is required", data: {}, statue: false });
      }
  
      let fileNameExist = req.body || {};
  
      const fileDetails = await Promise.all(
        req.files.map(async (item) => await s3Upload(foldername, `${fileNameExist[item.fieldname] || uuid()}${path.extname(item.originalname)}`, item.buffer, item.mimetype))
      );
  
      if (fileDetails) {
        let fileSave = {};
        if (req.files.length < 2) {
          req.files.forEach((element, index) => {
            fileSave[element.fieldname] = fileDetails[index];
          });
        } else {
          req.files.forEach((element) => {
            fileSave[element.fieldname] = [];
          });
  
          req.files.forEach((element, index) => {
            fileSave[element.fieldname].push({ [element.originalname.replace(/ /g, '_')]: fileDetails[index] });
          });
        }
  
  
        return res.status(200).send({
          message: "Successfully Upload",
          data: fileSave,
          statue: true,
        });
  
      } else {
  
        return res.status(404).send({
          message: "unable to  Upload",
          data: null,
          statue: true,
        });
  
      }
  
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send({ message: error.message, data: {}, statue: false });
    }
});

module.exports = router;
