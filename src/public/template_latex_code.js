//use `` instead of "" when storing multiple-line string
//the line \usepackage{amsmath} gives an error, because \u is taken
//as the indicator of unicode
//all the \(backslah) has to be written as \\(double backslahes)
//when storing latex code as a string

let template_latex_code = `
\\documentclass[a4paper, times, 10pt, twocolumn]{article}
\\usepackage[margin=1in]{geometry}
%\\documentclass[journal]{IEEEtran}
% https://www.overleaf.com/learn/latex/Questions%2FHow_do_I_add_additional_author_names_and_affiliations_to_my_paper%3F
\\usepackage{authblk}
% https://tex.stackexchange.com/questions/268/whats-the-best-way-to-write-e-mail-addresses
\\usepackage{hyperref}
% for title uppercase: https://tex.stackexchange.com/questions/335990/is-there-a-command-to-make-first-letter-upper-case
% \\usepackage{mfirstuc}
% \\usepackage{titlecaps}
\\usepackage{csquotes}
\\usepackage{hyperref}
\\usepackage{textcomp}


\\begin{document}


% It's technically risky to use _ in latex, replace it if necessary.
% See: https://tex.stackexchange.com/questions/52804/missing-inserted-inserted-text
%\\titlecap{
  \\title{paper_title_text}
  \\author{authorName}
  \\affil{affiliationName}
  \\affil{
    \\href{mailto:emailAdress}{emailAdress}
  }
%}
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

\\section{section_title}
section3_content

\\section*{Summary}
summary_para

\\begin{thebibliography}{3}
\\bibitem{latexcompanion}
Zongker, Doug. (2002). \\enquote{Chicken Chicken Chicken: Chicken Chicken.}
\\href{https://isotropic.org/papers/chicken.pdf}{\\textit{https://isotropic.org/papers/chicken.pdf}}

\\bibitem{latexcompanion}
Zongker, Doug. (2007, February 16). 
\\textit{Chicken Chicken Chicken}.
[Humor Session]. American Association for the Advancement of Science, San Francisco, LA.
\\href{https://www.youtube.com/watch?v=yL_-1d9OSdk}{\\textit{https://www.youtube.com/watch?v=yL\\_-1d9OSdk}}

\\bibitem{latexcompanion}
Mazières, David and Kohler, Eddie. (2005). \\enquote{Get me off Your Fucking Mailing List.}
\\textit{International Journal of Advanced Computer Technology.}
\\href{https://www.scs.stanford.edu/~dm/home/papers/remove.pdf}{\\textit{https://www.scs.stanford.edu/\\raisebox{0.5ex}{\\texttildelow}dm /home/papers/remove.pdf}}



\\end{thebibliography}

\\end{document}`;
