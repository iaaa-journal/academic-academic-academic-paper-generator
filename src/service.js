const path = require("path");
const fs = require("fs");
const shell = require("shelljs");
const archiver = require("archiver");
const paperBucket = require("./cloudStorage");

const documentPath = path.join(__dirname, "public", "documents");
const relativeDocumentPath = path.join("/documents");
const saveTexFromBase64 = (base64Data, baseFileName) => {
  let texFilePath = path.join(documentPath, baseFileName + ".tex");
  fs.writeFileSync(texFilePath, base64Data, "base64");
  return texFilePath;
};

const convertTexToPDF = (baseFileName, callback) => {
  let texFilePath = path.join(documentPath, baseFileName + ".tex");
  let pdfFilePath = path.join(documentPath, baseFileName + ".pdf");

  shell.exec(
    `pdflatex -output-format=pdf -halt-on-error -output-directory=${documentPath} ${texFilePath} `,
    (code, output) => {
      let relativeOutputFilePath = path.join(
        relativeDocumentPath,
        baseFileName
      );
      switch (code) {
        // conversion success
        case 0:
          relativeOutputFilePath += ".pdf";
          cleanFilesWithExtenstions(baseFileName, [".log", ".aux", ".out"]);
          callback(relativeOutputFilePath);
          uploadFileToBucket(texFilePath);
          uploadFileToBucket(pdfFilePath);
          break;

        // or failed
        default:
          relativeOutputFilePath += ".log";
          cleanFilesWithExtenstions(baseFileName, [".tex", ".aux", ".out"]);
          callback(relativeOutputFilePath);
          break;
      }
    }
  );
};

const cleanFilesWithExtenstions = (baseFileName, extensions) => {
  extensions.forEach((extension) => {
    let removedFileName = path.join(documentPath, baseFileName + extension);
    fs.unlink(removedFileName, (err) => {
      if (err) console.error(err);
      else console.log("removed", removedFileName);
    });
  });
};

const uploadFileToBucket = (fullFilePath) => {
  let readFileStream = fs.createReadStream(fullFilePath);
  let baseFileName = path.basename(fullFilePath);

  readFileStream.on("open", () => {
    readFileStream.pipe(
      paperBucket.file(baseFileName).createWriteStream({
        resumable: false,
        gzip: true,
      })
    );
  });
};

const getFileUrlListFromBucket = (callback) => {
  let fileUrlList = {};
  paperBucket.getFiles((err, files) => {
    files.forEach((file) => {
      const { ext, name } = path.parse(file.name);
      if (ext === ".pdf" || ext === ".tex") {
        if (!fileUrlList[name]) fileUrlList[name] = {};
        fileUrlList[name][ext.slice(1)] = file.publicUrl();
      }
    });
    callback(fileUrlList);
  });
};

const downloadAllFilesToLocalFolder = (callback) => {
  paperBucket.getFiles((err, files) => {
    let arr = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          file
            .download({
              destination: path.join(documentPath, file.name),
            })
            .then(() => {
              console.log(file.name, "downloaded");
              resolve(file.name);
            });
        })
    );

    Promise.all(arr).then(() => {
      console.log("all downloaded");
      callback();
    });
  });
};

const archiveFilesWithExtensionsToZip = (archiveName, extensions, callback) => {
  downloadAllFilesToLocalFolder(() => {
    let zipPath = path.join(documentPath, archiveName + ".zip");
    let stream = fs.createWriteStream(zipPath);

    let archive = archiver("zip", { zlib: { level: 9 } });
    extensions.forEach((ext) => {
      archive.glob(`*${ext}`, { cwd: documentPath });
    });
    archive.pipe(stream);
    archive.finalize();
    stream.on("close", () => {
      let relativeOutputFilePath = path.join(
        relativeDocumentPath,
        archiveName + ".zip"
      );
      console.log("Zip file created", zipPath);
      callback(relativeOutputFilePath);
    });
  });
};

module.exports = {
  saveTexFromBase64: saveTexFromBase64,
  convertTexToPDF: convertTexToPDF,
  archiveFilesWithExtensionsToZip: archiveFilesWithExtensionsToZip,
  getFileUrlListFromBucket: getFileUrlListFromBucket,
};
