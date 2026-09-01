# Viscosity Measurement Laboratory

[![License: MIT](https://img.shields.io/badge/Code-MIT-green.svg)](LICENSE)
[![Content: CC BY 4.0](https://img.shields.io/badge/Content-CC%20BY%204.0-blue.svg)](LICENSE-CONTENT.md)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22218165.svg)](https://doi.org/10.5281/zenodo.22218165)

Interactive falling ball, Saybolt and rotary viscometers, with a student handout,
an instructor answer sheet and a grading tool, for undergraduate courses in fluid
power systems and internal combustion engines.

**Live simulator:** https://alibulentkoc.github.io/viscosity-measurement-lab/lab/viscosity-lab.html

## What is here

| File | Audience | Purpose |
|---|---|---|
| `lab/viscosity-lab.html` | students | Interactive laboratory: three instruments, fluid library comparison, unit conversion, temperature analysis, notebook and export |
| `handouts/viscosity-lab-handout.html` | students | Printable handout, print to PDF from any browser |
| `handouts/viscosity-lab-answers.html` | instructors | Answer sheet with live calculation from the bench master values |
| `handouts/viscosity-lab-grader.html` | instructors | Measurement audit against tolerances, every answer computed twice |
| `tests/` | maintainers | Verification and headless DOM suites |
| `RELEASING.md` | maintainers | Step-by-step GitHub push, Pages and Zenodo DOI procedure |

Every file is self-contained. No CDN, no build step, no network access, no server.
Open any of them directly from disk, a memory stick, or a learning management
system upload, and they work offline.

## Educational purpose

The activity teaches viscosity measurement by three independent methods and then
asks why the three results disagree. The central lesson is in Section 5.6 of the
handout: with the 12.70 mm sphere used at the bench, the Reynolds number of the
falling ball is far above the creeping-flow limit that Stokes' law was derived
for. The equation still returns a repeatable number. Students are asked to report
that number, state that the model does not apply to it, and work out the direction
of the resulting error.

The simulator computes the Reynolds number live and labels the regime, so a student
can watch a measurement move in and out of validity by changing the sphere size.

## Equations

All three stations use the equations exactly as printed in the laboratory procedure.

**Falling ball.** Sphere volume `V = (4/3)pi r^3`; density `rho = m/V`; average time
`t_avg = (t1+t2+t3+t4)/4`; velocity `v = L/t_avg`; Stokes' law solved for viscosity

    mu = 2 (rho_s - rho_f) g r^2 / (9 v)

with `g = 9.81 m/s^2`. Validity is assessed with `Re = rho_f v (2r) / mu`, classified
as VALID below 0.1, valid below 1, MARGINAL below 10, INVALID at or above 10.

**Saybolt.** For `32 < SUS < 100`, `cSt = 0.226 SUS - 195/SUS`. For `SUS > 100`,
`cSt = 0.220 SUS - 135/SUS`. Both give 20.65 cSt at SUS = 100, so the pair is
continuous. Below 32 s neither applies and the tools refuse the conversion rather
than returning a number. Dynamic viscosity follows as `cP = cSt x rho [g/cm3]`.

The Saybolt station also runs the correlation backwards. When no reading has been
entered, the cup drains over the time that fluid's own viscosity implies, obtained by
solving the appropriate branch for SUS. The viscosity is taken from a rotary reading of
the same fluid at the same temperature where one exists, otherwise from the falling-ball
result, otherwise from the fluid's published viscosity, and the readout always names
which. A measurement, once entered, overrides the prediction. Predictions below 32 s or
above roughly 1000 s are flagged rather than animated silently: the first is too thin for
the method, the second beyond the working range of the Universal orifice, which is why
the procedure heats the sample to 50 degrees before pouring it.

**Rotary.** `1 Pa.s = 1000 mPa.s`, and `1 mPa.s = 1 cP` exactly.

The rotor is a cylinder on the shaft, turning about the vertical axis, and its diameter,
immersed height, speed, beaker bore and fluid depth are all set by the user. The drawing
is built from those numbers. Treating the arrangement as a Searle-type concentric cylinder
gives the shear rate at the rotor surface and the torque the instrument must be sensing to
report the entered viscosity:

    w            = 2 pi N / 60
    shear rate   = 2 w Ro^2 / (Ro^2 - Ri^2)
    shear stress = M / (2 pi Ri^2 H)
    mu           = shear stress / shear rate
    M            = 4 pi mu w H Ri^2 Ro^2 / (Ro^2 - Ri^2)      (Margules)
    mu           = M (Ro^2 - Ri^2) / (4 pi w H Ri^2 Ro^2)     (solved for viscosity)

Every quantity except M and N is fixed once the spindle and beaker are chosen, so the last
line collapses to `mu = K M / N` with K a pure geometric constant: the spindle factor an
instrument prints in its tables, and the reason a reading is meaningless without its
spindle and speed. In the wide-beaker limit the shear rate tends to 2w and the torque to
`4 pi mu w H Ri^2`. The station prints the full set in a formula panel and shows the chain
worked through with the current numbers, ending by inverting the torque back to the
viscosity it was built from. End effects are neglected and the fluid is assumed Newtonian,
isothermal, laminar, and the rotor fully immersed and coaxial; the tool states these
assumptions on screen and refuses the calculation when the rotor does not fit the beaker
or is not fully immersed. The displayed viscosity remains the value entered from the
bench, never a computed one.

Viscosity tracks the bath temperature only when something on file says how. A single
published viscosity fixes a value, not a slope, so for a fluid with one reference point the
displayed value stays at its reference temperature and the station says so in as many
words rather than leaving a number that silently refuses to move. Two viscosity-temperature
points can be typed in at the station, and a rotary sweep of two or more readings supersedes
them. Selecting a fluid that carries published pairs seeds the fields so the mechanism is
visible. A bath temperature outside the span the curve was fitted over is flagged as
extrapolation.

The station shows a viscosity and a torque without waiting for data to be typed in. The
viscosity in use is resolved in priority order: a reading entered at the current bath
temperature, otherwise the fitted temperature curve for the selected fluid evaluated
there, otherwise the fluid's published viscosity at its own reference temperature. The
display and the readout name the source every time, and a value that is not a measurement
is shown in amber and labelled as such.

Entering an instrument full-scale torque adds a percent-of-full-scale figure and the
on-scale judgement that governs spindle choice in practice: below about 10 percent the
reading is in the noise and a larger rotor or higher speed is needed, above 100 percent
the instrument is over range and a smaller rotor or lower speed is needed.

The rotor turns at the speed set, not at a speed derived from viscosity. A controlled-rate
instrument holds the speed fixed and measures the torque, so resistance appears in the
torque readout.

**Units.** `1 Pa.s = 1000 cP`; `cSt = cP / rho [g/cm3]`. Conversions between the
dynamic and kinematic families require a density and are refused without one.

## Viscosity against temperature

A single ASTM D341 (Walther) curve ties the three stations together:

    log10( log10( nu + 0.7 ) ) = A - B log10( T )      nu in cSt, T in kelvin

Two points determine A and B; more are fitted by least squares. The curve is fitted from
the student's own rotary sweep where the rotary fluid name matches the station's fluid,
and otherwise from published pairs held in the library. It is never extrapolated from a
single point, and the readout names its source. Below about 2 cSt the 0.7 form loses
accuracy and the tool says so.

This is what drives the Saybolt temperature chart, which plots predicted efflux time
against temperature with the 32 to 1000 s working range of the Universal orifice shaded.
For the bench oils the curve enters that band in the low forties, which is why the
procedure specifies 50 degrees: the choice of test temperature becomes something the
student can see rather than something the handout asserts.

## Fluid library

Fifteen fluids across six categories, including water as the reference point, ISO VG 32,
46 and 150 hydraulic grades, the two bench fluids, and a cornstarch suspension carried
deliberately with no viscosity at all. The comparison tab plots any of five quantities on
a logarithmic axis: dynamic viscosity, kinematic viscosity, predicted fall time, predicted
Saybolt time, or Reynolds number with the sphere currently set at Station 1. Dynamic
viscosity spans four decades from gasoline at 0.6 cP to honey at 6000 cP.

The cornstarch entry is shear thickening, so its apparent viscosity depends on shear rate
and it has no single value. It is excluded from every chart and calculation, with the
exclusion explained rather than silent, because every equation in this laboratory assumes
a Newtonian fluid and this is what that assumption rules out.

## What drives the falling-ball animation

The sphere falls on one of three clocks, and the tube always names which:

1. the average of the student's four timings;
2. the class reference time, for the two bench fluids, until timings are entered;
3. the Stokes prediction from the fluid's reference viscosity, for every other fluid.

The third exists because most of the library carries no bench timing, and without it the
sphere would simply not move for those fluids. The predicted clock never feeds the
viscosity result: deriving mu from a time that was itself derived from mu would be
circular and would present a reference value as though it had been measured. Values shown
from the reference rather than from a measurement are amber and marked.

Where the prediction falls outside the valid range of the law it is labelled as not
physical rather than quietly animated. Water with the bench sphere is the extreme case:
Stokes predicts 591 m/s and a transit of 0.005 s at a Reynolds number near seven million.
The sphere does drop that fast on screen, and the tool explains that this is the equation
being used far outside its range, not a prediction of anything. The animation speed goes
down to 0.1x so short transits can still be watched.

## Optional wall correction

The falling-ball station accepts a tube inner diameter. Entered, it applies the
Ladenburg correction `v_inf = v / (1 - 2.104 b + 2.09 b^3)` with `b = d/D`, and
reports both results. This is not part of the printed student procedure. It is
included because the tube wall retards the sphere, which makes an uncorrected
result read high, and it accounts for part of the disagreement with the rotary
viscometer. Left blank, nothing changes.

## Data and measurement assumptions

Default sphere and fluid values are the measured values from the physical bench:
a 12.70 mm steel sphere of mass 8.3 g, a fall distance of 0.89 m, and class average
fall times of 1.89 s in 15W-40 motor oil and 0.80 s in Dexron II ATF. Reference
densities and viscosities for the other library fluids are published values used
for comparison only. Every default is editable; nothing is hard-coded as immutable.

The application distinguishes measured, calculated and reference values by colour
throughout, and marks a value amber whenever a published figure is standing in for
a measurement the student has not yet entered.

Reference Reynolds annotations from an earlier Python implementation of the
falling-ball station were found to disagree with that implementation's own formulas
by roughly an order of magnitude and were not carried forward. All Reynolds numbers
here are computed live.

## Running locally

No build step. Clone and open any HTML file in a browser:

    git clone https://github.com/alibulentkoc/viscosity-measurement-lab.git
    cd viscosity-measurement-lab
    # then open lab/viscosity-lab.html

## Tests

Requires Node. `jsdom` is needed only for the headless DOM suites.

    cd tests
    npm install jsdom
    node verify.js          # physics and file integrity
    node smoke.js           # simulator, driven headlessly
    node smoke-answers.js   # answer sheet
    node smoke-grader.js    # grading tool

The physics in each file sits between `PHYSICS-START` and `PHYSICS-END` markers,
contains no DOM access, and is extracted and executed in isolation by `verify.js`.
It is duplicated across the files on purpose, so each one opens on its own.

## Deploying to GitHub Pages

Settings, Pages, Deploy from a branch, `main`, folder `/ (root)`. The simulator is
then at `/lab/viscosity-lab.html` and the handouts under `/handouts/`. Because the
files are self-contained there is nothing to configure.

## Releasing and DOIs

See `RELEASING.md` for the full procedure: pushing to GitHub, enabling Pages, connecting
Zenodo, cutting a release and collecting the concept and version DOIs. The order matters,
because Zenodo only archives releases made after the integration is switched on, and it
archives only what has actually been pushed.

## Citation

Koc, A. B. *Viscosity Measurement Laboratory: Interactive Falling Ball, Saybolt, and Rotary
Viscometers with Laboratory Materials*. Department of Agricultural Sciences, Agricultural
Mechanization and Business Program, Clemson University.
DOI: [10.5281/zenodo.22218165](https://doi.org/10.5281/zenodo.22218165)

That is the **concept DOI**: it always resolves to the newest release, so it stays correct
after future versions and is the one to print on handouts and quote in papers. To cite this
exact release instead, use the version DOI [10.5281/zenodo.22218166](https://doi.org/10.5281/zenodo.22218166).

Machine-readable metadata is in `CITATION.cff`. Laboratory materials are licensed CC BY 4.0;
source is MIT.
