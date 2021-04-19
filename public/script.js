const visibilityChanger = (element_id) => {
  return function (visible) {
    document.getElementById(element_id).style.display = visible
      ? "block"
      : "none";
  };
};

const postTex = async (url = "/api", data = {}) => {
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
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
};

document.getElementById("compile").addEventListener("click", function (e) {
  // get inputs
  let inputCoreConcept = document.getElementById("inputCoreConcept").value;
  let inputCoreConcept_wordCount = WordCount(inputCoreConcept);
  let inputAuthorName = document.getElementById("inputAuthorName").value;
  let inputAffiliation = document.getElementById("inputAffiliation").value;

  let inputCoreConceptNoMark = inputCoreConcept;
  let isSentence = false;

  // https://www.w3schools.com/jsref/jsref_endswith.asp
  while (
    inputCoreConceptNoMark.endsWith(".") ||
    inputCoreConceptNoMark.endsWith(" ")
  ) {
    inputCoreConceptNoMark = inputCoreConceptNoMark.slice(0, -1);
    isSentence = true;
  }

  let inputCoreConceptWSpace = inputCoreConceptNoMark + " ";
  console.log(inputCoreConceptWSpace);

  //https://stackoverflow.com/questions/18679576/counting-words-in-string/30335883
  function WordCount(str) {
    return str.split(" ").length;
  }

  //https://www.w3schools.com/js/js_random.asp
  function randomize_length(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // generate paper content
  if (inputCoreConcept.length > 0) {
    let abstract_para_length = randomize_length(120, 160);
    let intro_para_length = randomize_length(100, 150);
    let summary_para_length = randomize_length(120, 160);

    let abstract_repeat;
    let intro_repeat;
    let summary_repeat;

    abstract_repeat = Math.floor(
      abstract_para_length / inputCoreConcept_wordCount
    );
    intro_repeat = Math.floor(intro_para_length / inputCoreConcept_wordCount);
    summary_repeat = Math.floor(
      summary_para_length / inputCoreConcept_wordCount
    );

    //      /placeholder/gi    syntax for replace "placeholder" global and ignore case flags
    // not sure why this line doesn't work as template_latex_code.replace("placeholder", input_phrase);
    let modified_latex_code = template_latex_code
      .replace(/paper_title_text/gi, inputCoreConceptNoMark)
      .replace(/authorName/gi, inputAuthorName)
      .replace(/affiliationName/gi, inputAffiliation)
      .replace(
        /abstract_para/gi,
        `${inputCoreConceptWSpace.repeat(abstract_repeat)}` +
          inputCoreConceptNoMark +
          `.`
      )
      .replace(/section_title/gi, inputCoreConcept)
      .replace(/subsubtitle_text/gi, inputCoreConcept)
      .replace(/subtitle_text/gi, inputCoreConcept)
      .replace(/formulaValue/gi, inputCoreConceptNoMark)
      .replace(
        /summary_para/gi,
        `${inputCoreConceptWSpace.repeat(summary_repeat)}` +
          inputCoreConceptNoMark +
          `.`
      )
      .replace(/reference_text/gi, inputCoreConceptNoMark);
    const content_array = {
      intro_content: 1,
      section1_content: 2,
      section2_content: 3,
      section3_content: 4,
      subsubsection_content: 5,
      subsection_content: 6,
    };
    for (let content in content_array) {
      let paras = randomize_length(1, 4);
      let generated_content = "";
      for (let i = 0; i < paras; i++) {
        let section_para_length;
        if (i == 0 || i == paras - 1) {
          section_para_length = randomize_length(80, 150);
        } else {
          section_para_length = randomize_length(150, 300);
        }
        let n = Math.floor(section_para_length / inputCoreConcept_wordCount);
        generated_content =
          generated_content +
          `${inputCoreConceptWSpace.repeat(n)}` +
          inputCoreConceptNoMark +
          `.` +
          `\n\n`;
      }
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
      let replaceThis = new RegExp(content, "gi");
      modified_latex_code = modified_latex_code.replace(
        replaceThis,
        generated_content
      );
    }
    console.log(modified_latex_code);
    console.log(btoa(unescape(encodeURIComponent(modified_latex_code))));

    fetch("http://example.com/movies.json")
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
});
