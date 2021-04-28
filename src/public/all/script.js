const getDataFromApiUrl = async (apiUrl) => {
  const url = "/api" + apiUrl;
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    referrerPolicy: "no-referrer",
  });
  return response.json(); // parses JSON response into native JavaScript objects
};

// getting file list
getDataFromApiUrl("/all-files").then((data) => {
  console.log("/all-files", data);
  const contentTable = document.querySelector("#content-table");
  Object.keys(data).forEach((filename) => {
    const { pdf, tex } = data[filename];
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
});

// getting archive zip file
getDataFromApiUrl("/archive").then((data) => {
  console.log("/archive", data);

  const contentContainer = document.querySelector("#container");

  const { zipUrl } = data;

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
    <a href="${zipUrl}" target="_blank">Download All Files</a>
  `;
  contentContainer.appendChild(newRecord);
});
