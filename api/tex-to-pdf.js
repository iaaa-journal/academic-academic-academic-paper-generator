import Status from "http-status-codes";
import CloudConvert from "cloudconvert";

const CLOUDCOVERT_API = process.env.CLOUDCOVERT_API;
const cloudConvert = new CloudConvert(CLOUDCOVERT_API);

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      let job;
      const { coreConcept, authorName, affiliation, texCode } = req.body;
      job = await cloudConvert.jobs
        .create({
          tasks: {
            "import-tex": {
              operation: "import/base64",
              file: texCode.base64,
              filename: `${coreConcept}-by-${authorName}-from-${affiliation}.tex`,
            },
            "convert-tex-to-pdf": {
              operation: "convert",
              input_format: "tex",
              output_format: "pdf",
              engine: "texlive",
              input: ["import-tex"],
            },
            "export-pdf": {
              operation: "export/url",
              input: ["convert-tex-to-pdf"],
              inline: false,
              archive_multiple_files: false,
            },
          },
        })
        .then(async (thisRes) => {
          // console.log(thisRes);
          job = await cloudConvert.jobs.wait(thisRes.tasks[0].job_id);
          console.log("waiting");
          const exportTask = job.tasks.filter(
            (task) =>
              task.operation === "export/url" && task.status === "finished"
          )[0];
          const file = exportTask.result.files[0];
          res.status(Status.OK).send({ pdfurl: file.url });
        });
      break;

    default:
      res.status(Status.METHOD_NOT_ALLOWED).send();
      break;
  }
};
