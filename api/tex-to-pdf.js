import Status from "http-status-codes";
import CloudConvert from "cloudconvert";

const CLOUDCOVERT_API = process.env.CLOUDCOVERT_API;
console.log(CLOUDCOVERT_API);
const cloudConvert = new CloudConvert(CLOUDCOVERT_API);

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      let job;
      console.log(req.body);
      return;
      job = await cloudConvert.jobs
        .create({
          tasks: {
            "import-tex": {
              operation: "import/base64",
              file: req.body.texCode.base64,
              filename: "tex-test.tex",
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
          console.log(thisRes);
          job = await cloudConvert.jobs.wait(thisRes.tasks[0].job_id);

          const exportTask = job.tasks.filter(
            (task) =>
              task.operation === "export/url" && task.status === "finished"
          )[0];
          const file = exportTask.result.files[0];
          res.status(Status.OK).send(file.url);
        });
      break;

    case "GET":
      res.send("WELCOME");
      break;
    default:
      res.status(Status.METHOD_NOT_ALLOWED).send();
      break;
  }
};
