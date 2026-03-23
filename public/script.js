let pdfurl = "";

const engine = new PdfTeXEngine();
let engineReady = false;

async function initEngine() {
  try {
    await engine.loadEngine();
    engine.setTexliveEndpoint("https://texlive.texlyre.org/");
    engineReady = true;
    console.log("SwiftLaTeX PdfTeX engine ready");
  } catch (err) {
    console.error("Failed to initialize LaTeX engine:", err);
  }
}

initEngine();

const visibilityChanger = (element_id) => {
  console.log(element_id);
  return function (visible) {
    document.getElementById(element_id).style.display = visible
    ? "block"
    : "none";
  };
};

const showLoadingIndicator = visibilityChanger("running");
const showOpenButton = visibilityChanger("tab_open_pdf");

document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault();
  let inputCoreConcept = document.getElementById("inputCoreConcept").value;
  let inputAuthorName = document.getElementById("inputAuthorName").value;
  let inputAffiliation = document.getElementById("inputAffiliation").value;
  let inputEmail = document.getElementById("inputEmail").value;
  let isSentence = false;

  if(!inputCoreConcept||!inputAuthorName||!inputAffiliation||!inputEmail){
    document.getElementById("notice").style.display = "block";
    console.log("no");

  }else{
    if (!engineReady || !engine.isReady()) {
      console.log("Engine not ready yet, please wait...");
      return;
    }

    console.log("yes");
    showLoadingIndicator(true);
    document.getElementById("notice").style.display = "none";

    // remove " " "," ";" at the begin or end of input, if any
    while(inputCoreConcept.startsWith(" ")||inputCoreConcept.startsWith(",")||inputCoreConcept.startsWith(";")){
      inputCoreConcept = inputCoreConcept.slice(1);
    }

    while(inputCoreConcept.endsWith(" ")||inputCoreConcept.endsWith(",")||inputCoreConcept.endsWith(";")){
      inputCoreConcept = inputCoreConcept.slice(0,-1);
    }

    console.log("done removing space");

    let inputCoreConcept_wordCount = WordCount(inputCoreConcept);
    let inputCoreConceptNoMark = inputCoreConcept;
    let inputCoreConceptMark = inputCoreConcept;
    let inputCoreConceptAsSentence;

    if(inputCoreConcept.endsWith(".") || inputCoreConcept.endsWith("?") || inputCoreConcept.endsWith("!")){
      inputCoreConceptAsSentence = sentenceCase(inputCoreConcept) + " ";
      isSentence = true;
    }else{
      inputCoreConceptAsSentence = sentenceCase(inputCoreConcept) + ". "
    }

    console.log(inputCoreConceptMark, inputCoreConceptNoMark, inputCoreConceptAsSentence);


    while (
      inputCoreConceptNoMark.endsWith(".") || inputCoreConceptNoMark.endsWith("?") || inputCoreConceptNoMark.endsWith("!")
    ) {
      inputCoreConceptNoMark = inputCoreConceptNoMark.slice(0, -1);
    }

    console.log(inputCoreConceptMark, inputCoreConceptNoMark, inputCoreConceptAsSentence);



    let inputCoreConceptCap = titleCase(inputCoreConceptNoMark);
    inputAuthorName = titleCase(inputAuthorName);
    inputAffiliation = titleCase(inputAffiliation);

    function WordCount(str) {
      return str.split(" ").length;
    }

    function randomize_length(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function titleCase(str) {
      var splitStr = str.split(' ');
      for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
      }
      return splitStr.join(' ');
    }

    function sentenceCase(str)
    {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

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

      let modified_latex_code = template_latex_code
      .replace(/paper_title_text/gi, inputCoreConceptCap)
      .replace(/authorName/gi, inputAuthorName)
      .replace(/affiliationName/gi, inputAffiliation)
      .replace(/emailAdress/gi, inputEmail)
      .replace(
        /abstract_para/gi,
        `${inputCoreConceptAsSentence.repeat(abstract_repeat)}` +
        inputCoreConceptAsSentence
      )
      .replace(/section_title/gi, inputCoreConceptCap)
      .replace(/subsubtitle_text/gi, inputCoreConceptCap)
      .replace(/subtitle_text/gi, inputCoreConceptCap)
      .replace(/formulaValue/gi, inputCoreConceptNoMark)
      .replace(
        /summary_para/gi,
        `${inputCoreConceptAsSentence.repeat(summary_repeat)}` +
        inputCoreConceptAsSentence
      )
      .replace(/reference_text/gi, inputCoreConceptCap);
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
          `${inputCoreConceptAsSentence.repeat(n)}` +
          inputCoreConceptAsSentence +
          `\n\n`;
        }
        let replaceThis = new RegExp(content, "gi");
        modified_latex_code = modified_latex_code.replace(
          replaceThis,
          generated_content
        );
      }

      console.log(modified_latex_code);

      try {
        engine.writeMemFSFile("main.tex", modified_latex_code);
        engine.setEngineMainFile("main.tex");
        const result = await engine.compileLaTeX();

        console.log("Compilation status:", result.status);
        console.log("Compilation log:", result.log);

        if (result.status === 0 && result.pdf) {
          const pdfBlob = new Blob([result.pdf], { type: "application/pdf" });
          pdfurl = URL.createObjectURL(pdfBlob);
          showLoadingIndicator(false);
          showOpenButton(true);
        } else {
          showLoadingIndicator(false);
          console.error("LaTeX compilation failed. Log:", result.log);
          alert("Compilation failed. Check the browser console for details.");
        }
      } catch (err) {
        showLoadingIndicator(false);
        console.error("Compilation error:", err);
        alert("Compilation error. Check the browser console for details.");
      }
    }
  }
});

document.getElementById("open_pdf_btn").addEventListener("click", (e) => {
  showOpenButton(false);
  console.log("new pdf at " + pdfurl);
  window.open(pdfurl);
});
