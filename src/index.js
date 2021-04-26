const express = require("express");
const path = require("path");
const fs = require("fs");
var shell = require("shelljs");

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;

const filepath = path.join(__dirname, "public/documents");

function convertToSlug(Text) {
  return Text.replace(/ /g, "-").replace(/[^\w-]+/g, "");
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
        if (code != 0) {
          res
            .status(500)
            .send({ pdfurl: "/documents/" + filename + ".log", failed: true });

          console.log(output);
          // clean up temporary files
          [".tex", ".pdf", ".aux", ".out"].forEach((extension) => {
            console.log(filepath + filename + extension);
            let removedFilename = filepath + filename + extension;
            try {
              fs.unlinkSync(removedFilename);
            } catch (err) {
              console.log(err);
            }
          });
        } else {
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
      }
    );
  });
});

app.get("/api/all-files", (req, res) => {
  let fileList = {};
  fs.readdir(filepath, (err, files) => {
    files.forEach((file) => {
      const { ext, name } = path.parse(file);
      if (ext === ".pdf" || ext === ".tex") {
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
