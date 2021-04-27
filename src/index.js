const express = require("express");
const path = require("path");
const fs = require("fs");
const shell = require("shelljs");
const archiver = require("archiver");

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;

const filepath = path.join(__dirname, "public/documents");

function convertToSlug(Text) {
  return Text.replace(/ /g, "-").replace(/[^\w-]+/g, "");
}

function archiveExtInDirToZip(dir, zipPath, extensions) {
  let output = fs.createWriteStream(zipPath);
  let archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);
  extensions.forEach((ext) => {
    archive.glob(`*${ext}`, { cwd: dir });
  });
  archive.glob("*.pdf", { cwd: dir });
  archive.glob("*.tex", { cwd: dir });
  archive.finalize();
}

app.use("/", express.static(path.join(__dirname, "public")));

app.post("/api/tex-to-pdf", (req, res) => {
  const {
    coreConcept,
    authorName,
    affiliation,
    texCode: { base64 },
  } = req.body;

  let filename;

  if (!coreConcept) filename = "/test";
  else
    filename = `/${convertToSlug(coreConcept)}-by-${convertToSlug(
      authorName
    )}-from-${convertToSlug(affiliation)}`;

  console.log(filepath, filename);

  fs.writeFile(filepath + filename + ".tex", base64, "base64", (e) => {
    shell.exec(
      `pdflatex -output-format=pdf -halt-on-error -output-directory=${filepath} ${
        filepath + filename + ".tex"
      } `,
      (code, output) => {
        // if pdflatex failed
        if (code != 0) {
          res
            .status(500)
            .send({ pdfurl: "/documents/" + filename + ".log", failed: true });

          // clean up temporary files but keep the log
          [".tex", ".pdf", ".aux", ".out"].forEach((extension) => {
            console.log(filepath + filename + extension);
            let removedFilename = filepath + filename + extension;
            try {
              fs.unlinkSync(removedFilename);
            } catch (err) {
              console.log(err);
            }
          });
        }

        // if pdflatex succeeded
        else {
          res.status(200).send({
            pdfurl: "/documents/" + filename + ".pdf",
          });

          // clean up temporary files
          [".log", ".aux", ".out"].forEach((extension) => {
            console.log(filepath + filename + extension);
            let removedFilename = filepath + filename + extension;
            try {
              fs.unlinkSync(removedFilename);
            } catch (err) {
              console.log(err);
            }
          });
        }

        archiveExtInDirToZip(filepath, filepath + "/iaaa-archive.zip", [
          ".tex",
          ".pdf",
        ]);
      }
    );
  });
});

app.get("/api/all-files", (req, res) => {
  let fileList = {};
  fs.readdir(filepath, (err, files) => {
    files.forEach((file) => {
      const { ext, name } = path.parse(file);
      if (ext === ".pdf" || ext === ".tex" || ext === ".zip") {
        if (!fileList[name]) fileList[name] = {};
        fileList[name][ext.slice(1)] = `${"/documents/" + file}`;
      }
    });

    res.status(200).send(fileList);
  });
});

app.listen(port, () => {
  console.log(`example app listening at http://localhost:${port}`);
});
