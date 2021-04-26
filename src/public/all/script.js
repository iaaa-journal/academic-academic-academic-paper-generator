const getFiles = async () => {
  const url = "/api/all-files";

  // Default options are marked with *
  const response = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
};

getFiles().then((data) => {
  console.log(data);
  const contentTable = document.querySelector("#content-table");
  Object.keys(data).forEach((filename) => {
    const { pdf, tex, zip } = data[filename];
    if (pdf) {
      let newRecord = document.createElement("tr");

      newRecord.innerHTML = `
      <td>${filename}</td>
      <td><a href="${pdf}" target="_blank">Download</a></td>
      <td><a href="${tex}" target="_blank">Download</a></td>
    `;
      contentTable.appendChild(newRecord);
    }
  });

  const contentContainer = document.querySelector("#container");

  if ("iaaa-archive" in data) {
    const { zip } = data["iaaa-archive"];

    let newRecord = document.createElement("div");
    newRecord.style = `
      margin-top:10px;
      padding-top:10px;
      position: absolute;
      bottom: -2em;
      border-top: 1px solid black;
      width:100%;
    `;
    newRecord.innerHTML = `
    <a href="${zip}" target="_blank">Download All Files</a>
  `;
    contentContainer.appendChild(newRecord);
  }
});
