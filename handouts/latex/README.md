# LaTeX source for the student handout

`viscosity-lab-handout.tex` is the print master: **A4**, 2.1 cm margins, page numbers as
"Page n of N" in the footer, and a running head carrying a name rule on every page after
the first.

## Compiling

```
pdflatex viscosity-lab-handout.tex
pdflatex viscosity-lab-handout.tex     # twice, so \pageref{LastPage} resolves
```

Running it once leaves "Page 1 of ??" in the footer. The second pass fixes it.

Packages used, all in a standard TeX Live installation: `geometry`, `fancyhdr`,
`lastpage`, `titlesec`, `booktabs`, `colortbl`, `enumitem`, `tcolorbox`, `tikz`,
`needspace`, `microtype`, `lmodern`, `hyperref`. On a minimal Debian or Ubuntu install:

```
sudo apt install texlive-latex-recommended texlive-latex-extra texlive-pictures lmodern
```

## Relationship to the HTML handout

`../viscosity-lab-handout.html` and this file carry the same content, the same section
numbering and the same twelve equations. The HTML version prints to US Letter from a
browser and needs no toolchain; this one is A4, typeset, and is the version to use for a
printed course pack or for submission with a paper.

If you edit one, edit the other. The section numbers are referenced from inside the text
(Section 5.5, Section 5.6, Question 5), so they must not drift apart.

## Things worth knowing before editing

- `\bl`, `\bll`, `\blll`, `\bls` are the fill-in rules, in four widths.
- `\answerline` is a full-width ruled line for written answers; repeat it for more room.
- `\rowrule` draws the light interior rule in the data tables, so students have a line to
  write on. Outer rules stay black.
- `\graphpaper{width}{height}` draws the plotting grid in centimetres.
- `\needspace{n\baselineskip}` before each section keeps headings from stranding at the
  foot of a page. Adjust these if you add or remove content, and check the page count
  afterwards; the document is tuned to fall on eight pages with nothing wasted.
