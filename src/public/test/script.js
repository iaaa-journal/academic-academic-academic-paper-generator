let pdfurl = "";

const changeVisibility = (selector, isVisible) => {
  document.querySelector(selector).style.display = isVisible ? "block" : "none";
};

const postTex = async (data) => {
  const url = "/api/tex-to-pdf";

  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
};

document.querySelector("#compile").addEventListener("click", (event) => {
  event.preventDefault();
  let inputTexCode = document.querySelector("#inputTexCode").value;

  if (!inputTexCode) {
  } else {
    changeVisibility("#loading-indicator", true);
    changeVisibility("#log-output", false);
    changeVisibility("#pdf-output", false);

    const generatedLatex_base64 = btoa(
      unescape(encodeURIComponent(inputTexCode))
    );

    let data = {
      coreConcept: null,
      authorName: null,
      affiliation: null,
      texCode: {
        base64: generatedLatex_base64,
      },
    };

    postTex(data).then((data) => {
      pdfurl = data.pdfurl;
      changeVisibility("#loading-indicator", false);

      if (!data.failed) {
        changeVisibility("#pdf-output", true);
        changeVisibility("#log-output", false);
      } else {
        changeVisibility("#log-output", true);
        changeVisibility("#pdf-output", false);
      }
    });
  }
});

document.querySelector("#pdf-button").addEventListener("click", (e) => {
  changeVisibility("#pdf-output", false);
  window.open(pdfurl);
});

document.querySelector("#log-button").addEventListener("click", (e) => {
  changeVisibility("#log-output", false);
  window.open(pdfurl);
});
