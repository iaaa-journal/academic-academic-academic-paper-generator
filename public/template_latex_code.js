//use `` instead of "" when storing multiple-line string
//the line \usepackage{amsmath} gives an error, because \u is taken
//as the indicator of unicode
//all the \(backslah) has to be written as \\(double backslahes)
//when storing latex code as a string

let template_latex_code = `
%\\documentclass[a4paper, times, 10pt, twocolumn, twoside]{article}
\\documentclass[journal]{IEEEtran}
%\\usepackage{amsmath}
\\usepackage{graphicx}
% \\usepackage{IEEEtran}


\\begin{document}

\\title{paper_title_text}
\\author{authorName}
\\date{\\today}

% render title section
\\maketitle

\\begin{abstract}
abstract_para
\\end{abstract}

\\section*{Introduction}
% line break to start a new paragraph
intro_content

\\section{section_title}
section1_content


\\section{section_title}
section2_content

\\subsection{subtitle_text}
subsection_content


\\subsubsection{subsubtitle_text}
subsubsection_content

% The following shows typesetting power of LaTeX:
% \\begin{align}
% E_0 &= formulaValue^2                              \\
% E &= \\frac{formulaValue^2}{\sqrt{1-\\frac{formulaValue^2}{formulaValue^2}}}
% \\end{align}


\\section{section_title}
section3_content

\\section*{Summary}
summary_para

\\begin{thebibliography}{9}
\\bibitem{latexcompanion}
reference_text, reference_text, and reference_text.
\\textit{reference_text reference_text reference_text}.
reference_text-reference_text, reference_text, reference_text, 1993.

\\bibitem{einstein}
reference_text.
\\textit{reference_text reference_text reference_text reference_text}.
[\\textit{reference_text reference_text reference_text}].
reference_text, 322(10):891–921, 1905.
\\end{thebibliography}

\\end{document}`;
