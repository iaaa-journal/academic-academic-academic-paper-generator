const express = require("express");
const path = require("path");
const fs = require("fs");
var shell = require("shelljs");

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;

const filepath = path.join(__dirname, "public/documents");

app.use("/", express.static(path.join(__dirname, "public")));

app.post("/api/tex-to-pdf", (req, res) => {
  const {
    coreConcept,
    authorName,
    affiliation,
    texCode: { base64 },
  } = req.body;

  // let buff = Buffer.from(base64, "base64");
  // let plaintext = buff.toString("ascii");
  // console.log(plaintext);

  const filename = `/${coreConcept}-by-${authorName}-from-${affiliation}`;
  console.log(filepath, filename);

  fs.writeFile(filepath + filename + ".tex", base64, "base64", (e) => {
    shell.exec(
      `pdflatex -output-format=pdf -output-directory=${filepath} ${
        filepath + filename + ".tex"
      } `,
      () => {
        res.status(200).send({
          pdfurl: "documents/" + filename + ".pdf",
        });

        // clean up temporary files
        [".log", ".aux", ".out"].forEach((extension) => {
          console.log(filepath + filename + extension);
          let removedFilename = filepath + filename + extension;
          fs.unlinkSync(removedFilename);
        });
      }
    );
  });
});

app.get("/api/all-pdfs", (req, res) => {
  let fileList = [];
  fs.readdir(filepath, (err, files) => {
    files.forEach((file) => {
      fileList.push(file);
    });
    res.status(200).send({ files: fileList });
  });
});

app.listen(port, () => {
  console.log(`example app listening at http://localhost:${port}`);
});
