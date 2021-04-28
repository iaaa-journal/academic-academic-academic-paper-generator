const { Router } = require("express");
const path = require("path");
const {
  saveTexFromBase64,
  convertTexToPDF,
  archiveFilesWithExtensionsToZip,
  getFileUrlListFromBucket,
} = require("./service");

const apiRouter = Router();

const convertToSlug = (str) => str.replace(/ /g, "-").replace(/[^\w-]+/g, "");

apiRouter.post("/tex-to-pdf", (req, res) => {
  const {
    coreConcept,
    authorName,
    affiliation,
    texCode: { base64 },
  } = req.body;

  let baseFileName;

  if (!coreConcept) baseFileName = "/test";
  else
    baseFileName = convertToSlug(
      `${coreConcept}-by-${authorName}-from-${affiliation}`
    );

  console.log("Base file name", baseFileName);

  saveTexFromBase64(base64, baseFileName);
  convertTexToPDF(baseFileName, (relativeOutputFilePath) => {
    // if pdf conversion succeeded
    if (relativeOutputFilePath)
      res.status(200).json({ outputUrl: relativeOutputFilePath });
    // if pdf conversion failed
    else
      res.status(500).json({ outputUrl: relativeOutputFilePath, failed: true });
  });
});

apiRouter.get("/all-files", (req, res) => {
  getFileUrlListFromBucket((fileUrlList) => {
    res.status(200).send(fileUrlList);
  });
});

apiRouter.get("/archive", (req, res) => {
  archiveFilesWithExtensionsToZip(
    "iaaa-archive",
    [".pdf", ".tex"],
    (zipPath) => {
      console.log(zipPath);
      res.status(200).send({ zipUrl: zipPath });
    }
  );
});

module.exports = apiRouter;
