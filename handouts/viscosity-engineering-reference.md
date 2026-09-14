# Viscosity Measurement: Engineering Reference

Falling Ball, Saybolt, and Rotary Viscometers
Companion to the Viscosity Measurement Laboratory, Clemson University
(DOI 10.5281/zenodo.22218165)

This document holds the derivations, validity limits, corrections, and
uncertainty analysis behind the student handout and the plain-language
guide. Equations are numbered independently of the handout. Symbols follow
the handout where they overlap.

## 1. Definitions

Newton's law of viscosity for simple shear:

$$\tau = \mu \dot{\gamma}$$

where $\tau$ is shear stress (Pa), $\dot{\gamma}$ is shear rate (1/s), and
$\mu$ is dynamic viscosity (Pa.s). A fluid for which $\mu$ is independent
of $\dot{\gamma}$ is Newtonian. Every equation below assumes this.

Kinematic viscosity:

$$\nu = \mu / \rho$$

with $\rho$ the fluid density. In SI, $\nu$ is in m^2/s. Practical units:

| Quantity | SI | Practical | Relation |
|---|---|---|---|
| $\mu$ | Pa.s | cP, mPa.s, P | 1 Pa.s = 1000 cP = 1000 mPa.s = 10 P |
| $\nu$ | m^2/s | cSt, St | 1 cSt = 1 mm^2/s = 1e-6 m^2/s; 1 St = 100 cSt |
| $\rho$ | kg/m3 | g/cm3, g/mL | 1 g/cm3 = 1000 kg/m3 |

The bridge used at the bench: $\nu$ [cSt] = $\mu$ [cP] / $\rho$ [g/cm3].
Any conversion across the dynamic/kinematic boundary needs a density at
the same temperature as the viscosity.

Grade systems. ISO 3448 grades (ISO VG 32, 46, 68, ...) are the midpoint
kinematic viscosity in cSt at 40 C, with a band of plus or minus 10
percent. SAE J300 engine oil grades are two-part: the W number sets
low-temperature cranking (CCS) and pumping (MRV) limits at specified
sub-zero temperatures; the second number sets a kinematic band at 100 C
and a minimum HTHS viscosity at 150 C. The two systems share no reference
temperature and cannot be compared without a viscosity-temperature curve.

## 2. Falling-ball viscometer

### 2.1 Stokes' law and the terminal-velocity balance

For a sphere of radius $r$ moving at speed $v$ through an unbounded
Newtonian fluid in creeping flow (inertia negligible), the drag is

$$F_D = 6 \pi \mu r v \tag{1}$$

At terminal velocity, drag balances weight less buoyancy:

$$6 \pi \mu r v = \tfrac{4}{3}\pi r^3 (\rho_s - \rho_f) g \tag{2}$$

Solving for $\mu$:

$$\mu = \frac{2 (\rho_s - \rho_f) g r^2}{9 v} \tag{3}$$

with $v = L / t_{avg}$ over the marked distance $L$.

Sphere density from mass and diameter:

$$\rho_s = \frac{m}{\tfrac{4}{3}\pi r^3} \tag{4}$$

### 2.2 The bench constant

For fixed sphere, tube marks, and fluid density, (3) collapses to

$$\mu = K\, t, \qquad K = \frac{2 (\rho_s - \rho_f) g r^2}{9 L} \tag{5}$$

Bench values: $m$ = 8.3 g, $d$ = 12.70 mm, $L$ = 0.89 m.

$r$ = 6.35e-3 m, $r^2$ = 4.0323e-5 m^2, $V$ = 1.0725e-6 m^3,
$\rho_s$ = 7739 kg/m3.

| Fluid | $\rho_f$ (kg/m3) | $\rho_s - \rho_f$ | $K$ (Pa.s per s) |
|---|---|---|---|
| 15W-40 | 868 | 6871 | 0.6786 |
| Dexron II | 844 | 6895 | 0.6810 |

Both round to 0.68, which is the figure given in the plain-language guide.
The 0.3 percent difference between them is well below timing uncertainty.

Bench results:

| Fluid | $t_{avg}$ (s) | $v$ (m/s) | $\mu$ (Pa.s) | $\mu$ (cP) | $\nu$ (cSt) |
|---|---|---|---|---|---|
| 15W-40 | 1.89 | 0.4709 | 1.2826 | 1283 | 1478 |
| Dexron II | 0.80 | 1.1125 | 0.5448 | 545 | 645 |

### 2.3 Reynolds number and validity

$$Re = \frac{\rho_f v d}{\mu} \tag{6}$$

Equation (1) is the leading term of an expansion in $Re$. Oseen's
correction gives

$$F_D = 6 \pi \mu r v \left(1 + \tfrac{3}{16} Re\right) \tag{7}$$

so the Stokes drag is low by 2 percent at $Re$ = 0.1, 19 percent at
$Re$ = 1, and about a factor of 2.9 at $Re$ = 10. A practical
classification:

| $Re$ | Label | Error in $\mu$ from (3) |
|---|---|---|
| under 0.1 | good | under 2 percent |
| 0.1 to 1 | usable | up to about 20 percent, always high |
| 1 to 10 | marginal | 20 percent to 3x, high |
| 10 and over | invalid | more than 3x, high |

Direction of the error. Real drag exceeds Stokes drag, so the sphere falls
slower than (3) assumes for the true viscosity. Equation (3) has $v$ in
the denominator, so a low $v$ returns a high $\mu$. Uncorrected
falling-ball results at $Re > 1$ always read high.

Bench form. Substituting (5) and $v = L/t$ into (6):

$$Re = \frac{\rho_f L d}{K t^2} \tag{8}$$

For 15W-40: $Re$ = 868 x 0.89 x 0.0127 / (0.6786 $t^2$) = 14.46 / $t^2$.
For Dexron II: 14.0 / $t^2$. Hence the rule of thumb $Re \approx 14/t^2$
and the thresholds: $t$ > 3.8 s for $Re$ < 1, $t$ > 12 s for $Re$ < 0.1.

Bench Reynolds numbers, computed with the Stokes $\mu$:

| Fluid | $Re$ | Class |
|---|---|---|
| 15W-40 | 4.05 | marginal |
| Dexron II | 21.9 | invalid |

### 2.4 The self-reference problem

Equation (6) evaluated with the Stokes $\mu$ from (3) understates $Re$
whenever (3) is itself invalid, because the inflated $\mu$ sits in the
denominator. The honest check uses an independent viscosity, for example
the rotary reading at the same temperature. With typical published values:

| Fluid | $\mu$ typical, 20 C (Pa.s) | $Re$ with typical $\mu$ | Class |
|---|---|---|---|
| 15W-40 | 0.26 to 0.30 | 17 to 20 | invalid |
| Dexron II | 0.06 to 0.09 | 130 to 190 | invalid |

So on this bench neither fluid is marginal. Both are well outside the law.
Section 5.6 of the handout should be answered twice: once with the Stokes
$\mu$ (as printed) and once with the rotary $\mu$.

### 2.5 Finite-Reynolds correction (for instructors)

To recover a better estimate from the same timing, replace (1) with a drag
coefficient correlation. Schiller and Naumann (valid to about $Re$ = 800):

$$C_D = \frac{24}{Re}\left(1 + 0.15 Re^{0.687}\right) \tag{9}$$

with $F_D = C_D \cdot \tfrac{1}{2}\rho_f v^2 \pi r^2$. The force balance
becomes

$$\mu = \frac{(\rho_s - \rho_f) g V}{6 \pi r v \left(1 + 0.15 Re^{0.687}\right)} \tag{10}$$

which must be iterated because $Re$ contains $\mu$. Starting from the
Stokes value converges in a few steps.

| Fluid | Stokes $\mu$ (Pa.s) | Corrected $\mu$ (Pa.s) | $Re$ at solution |
|---|---|---|---|
| 15W-40 | 1.283 | 0.842 | 6.2 |
| Dexron II | 0.545 | 0.120 | 99 |

The corrected 15W-40 figure (0.84 Pa.s) is still about 3x a typical value.
The rest of the gap is explained by the wall effect (2.6) and possibly by
incomplete settling (2.7). The corrected ATF figure (0.12 Pa.s) is within
a factor of 1.5 to 2 of typical, which is the best that can be expected at
$Re$ near 100 with a wall correction still unapplied.

### 2.6 Wall correction (Faxen)

A sphere of diameter $d$ falling on the axis of a tube of bore $D$ is
retarded by the wall. With $\beta = d/D$, the creeping-flow result of
Faxen is

$$v_\infty = \frac{v_{meas}}{1 - 2.104\beta + 2.09\beta^3 - 0.95\beta^5} \tag{11}$$

The simulator uses the series to $\beta^3$; the $\beta^5$ term is under
0.1 percent for $\beta$ < 0.3. The simpler Ladenburg form is
$v_\infty = v_{meas}(1 + 2.4\beta)$ and agrees with (11) to first order.
The viscosity should be computed from $v_\infty$, and is therefore lower
than the uncorrected result by the same factor.

| $D$ (mm) | $\beta$ | correction factor | uncorrected $\mu$ / corrected $\mu$ |
|---|---|---|---|
| 25.4 | 0.500 | 0.209 | 4.8 |
| 38.1 | 0.333 | 0.376 | 2.7 |
| 50.8 | 0.250 | 0.507 | 2.0 |
| 76.2 | 0.167 | 0.659 | 1.5 |
| 101.6 | 0.125 | 0.741 | 1.3 |

With the 12.70 mm sphere the wall effect is never small in any tube a
student can lift. In a 50 mm tube it alone doubles the result. Faxen's
result is a creeping-flow result and carries the same $Re$ caveat as
Stokes' law; at the bench $Re$ it is indicative, not exact.

### 2.7 Settling distance before the START mark

In creeping flow the approach to terminal velocity is exponential with
time constant

$$\tau_v = \frac{(\rho_s + \tfrac{1}{2}\rho_f)\, d^2}{18 \mu} \tag{12}$$

where the $\tfrac{1}{2}\rho_f$ term is the added mass. Settling to 99
percent takes about $4.6\tau_v$ and covers roughly $v_t \cdot 3.6\tau_v$.

For the bench sphere in 15W-40 at $\mu$ = 0.3 Pa.s: $\tau_v$ = 0.24 s.
A numerical integration of the fall with the drag law (9) and added mass
gives:

| Fluid ($\mu$, Pa.s) | $v_t$ free (m/s) | 95 percent settled after (m) | 99 percent settled after (m) |
|---|---|---|---|
| 15W-40 (0.26 to 0.30) | 0.80 to 0.84 | 0.12 to 0.13 | 0.20 to 0.23 |
| ATF (0.07 to 0.12) | 1.11 to 1.29 | 0.21 to 0.28 | 0.37 to 0.48 |

The START mark should therefore be at least 0.25 m below the release point
for the oil and at least 0.5 m for the ATF. If the tube does not allow
that, the ATF timing includes acceleration and reads high on top of the
$Re$ and wall errors.

The same integration predicts a free-fall transit of about 1.1 s over 0.89
m for a typical 15W-40 at room temperature, against the bench average of
1.89 s. A wall factor near 0.5 (50 mm bore) accounts for the difference,
which supports the interpretation in 2.5 and 2.6.

### 2.8 Uncertainty

From (3), with independent errors,

$$\left(\frac{\delta\mu}{\mu}\right)^2 = \left(\frac{\delta t}{t}\right)^2 + \left(\frac{2\,\delta r}{r}\right)^2 + \left(\frac{\delta(\rho_s - \rho_f)}{\rho_s - \rho_f}\right)^2 + \left(\frac{\delta L}{L}\right)^2 \tag{13}$$

Bench estimates:

| Source | Value | Relative | Contribution to $\delta\mu/\mu$ |
|---|---|---|---|
| stopwatch, $\delta t$ = 0.1 s on 1.89 s | 5.3 percent | 5.3 percent |
| micrometer, $\delta r$ = 0.01 mm on 6.35 mm | 0.16 percent | 0.3 percent |
| balance, $\delta m$ = 0.05 g on 8.3 g | 0.6 percent | 0.6 percent (through $\rho_s$) |
| fluid density, 2 percent of 868 | 2 percent of 12.6 percent of $\Delta\rho$ | 0.25 percent |
| tape, $\delta L$ = 2 mm on 890 mm | 0.2 percent | 0.2 percent |
| Combined (root sum of squares) | | about 5.4 percent |

Timing dominates. Four trials bring the random part down by a factor of 2;
reaction-time bias does not average out and should be estimated
separately by timing a known interval. The range of the four timings
divided by the mean is the first-order estimate the handout asks for.

None of this accounts for model error (Sections 2.3 to 2.7), which at the
bench $Re$ is a factor of 3 to 8, not a few percent. Report both:
"1.28 plus or minus 0.07 Pa.s by Stokes' law, model invalid at $Re$ = 4,
result reads high by an estimated factor of 3 to 4."

### 2.9 Design of a valid falling-ball test

From (3) and (6), $v \propto r^2$ and $Re \propto r^3$. To bring the bench
fluids inside $Re$ < 1:

| Sphere $d$ (mm) | $Re$ scale factor vs 12.70 mm | 15W-40 $Re$ (from 17) | ATF $Re$ (from 170) |
|---|---|---|---|
| 6.35 | 1/8 | 2.1 | 21 |
| 3.18 | 1/64 | 0.27 | 2.7 |
| 2.38 | 1/152 | 0.11 | 1.1 |
| 1.59 | 1/512 | 0.03 | 0.33 |

A 3/32 inch (2.38 mm) chrome steel ball makes the oil measurement valid
and the ATF marginal. A 1/16 inch ball makes both valid. Small balls fall
slowly (about 8 mm/s in the oil for 2.38 mm), so a shorter marked distance
and a longer tube-to-diameter ratio both follow naturally, and the wall
correction shrinks to a few percent.

## 3. Saybolt viscometer

### 3.1 Principle

A fixed volume (60 mL) drains under its own head through a calibrated
orifice. For a gravity-driven efflux the driving pressure scales with
$\rho g h$ and the resistance with $\mu$, so the efflux time scales with
$\mu/\rho = \nu$. This is why the Saybolt reading converts to kinematic
viscosity without a density. The instrument is standardised in ASTM D88;
conversions to cSt are in ASTM D2161.

### 3.2 Conversion

The classic two-branch approximation used in the lab:

$$\nu\,[\text{cSt}] = 0.226\,t - \frac{195}{t}, \qquad 32 < t \le 100 \tag{14}$$

$$\nu\,[\text{cSt}] = 0.220\,t - \frac{135}{t}, \qquad t > 100 \tag{15}$$

with $t$ in SUS. Both give 20.65 cSt at $t$ = 100, so the pair is
continuous. Below 32 s the orifice flow is no longer laminar-dominated and
neither branch applies. Above about 1000 s the test is impractical and the
Saybolt Furol orifice (about 10x larger) is used instead.

Inverse, for prediction from a known $\nu$: solve the quadratic
$a t^2 - \nu t - c = 0$ with $(a, c)$ = (0.226, 195) for $\nu \le 20.65$
and (0.220, 135) above:

$$t = \frac{\nu + \sqrt{\nu^2 + 4ac}}{2a} \tag{16}$$

Dynamic viscosity then follows from $\mu$ [cP] = $\nu$ [cSt] x $\rho$
[g/cm3], with $\rho$ at the test temperature.

### 3.3 Temperature note

Equations (14) and (15) are defined at 100 F (37.8 C). ASTM D2161 corrects
SUS at other temperatures by the factor $1 + 0.000061\,(T_F - 100)$, which
is 0.1 percent at 50 C and can be ignored at bench precision. The choice
of 50 C in the procedure is a practical one: it moves the efflux time of
the bench oils into the 32 to 1000 s window. From the Walther curve of a
typical 15W-40 ($\nu$ = 105 cSt at 40 C, 14.5 cSt at 100 C):

| T (C) | $\nu$ (cSt) | predicted SUS |
|---|---|---|
| 20 | 300 | 1364 |
| 40 | 105 | 484 |
| 50 | 68 | 313 |
| 60 | 46 | 213 |

At room temperature the oil is outside the window; at 50 C it is well
inside.

### 3.4 Worked example

Reading: 275 SUS on 15W-40 at 50 C, $\rho$ = 0.868 g/cm3 (measured at 20 C;
correct by about -0.0007 g/cm3 per C if a 50 C density is wanted, giving
0.847).

$\nu$ = 0.220 x 275 - 135/275 = 60.5 - 0.49 = 60.0 cSt
$\mu$ = 60.0 x 0.847 = 50.8 cP = 0.051 Pa.s

## 4. Rotary (concentric-cylinder) viscometer

### 4.1 Couette flow between coaxial cylinders

Rotor (bob) of radius $R_i$ and immersed height $H$ turns at angular
speed $\omega$ inside a stationary cup of radius $R_o$. For steady laminar
Newtonian flow the azimuthal velocity is

$$v_\theta(r) = A r + \frac{B}{r} \tag{17}$$

with $v_\theta(R_i) = \omega R_i$ and $v_\theta(R_o) = 0$, giving

$$A = -\frac{\omega R_i^2}{R_o^2 - R_i^2}, \qquad B = \frac{\omega R_i^2 R_o^2}{R_o^2 - R_i^2} \tag{18}$$

Shear stress in cylindrical Couette flow is $\tau = \mu\, r\, \frac{d}{dr}\!\left(\frac{v_\theta}{r}\right) = -\frac{2\mu B}{r^2}$, and the
torque transmitted across any cylindrical surface, $M = 2\pi r^2 H \tau$,
is independent of $r$:

$$M = \frac{4\pi\mu\,\omega\,H\,R_i^2 R_o^2}{R_o^2 - R_i^2} \tag{19}$$

This is the Margules equation. Solved for viscosity:

$$\mu = \frac{M\,(R_o^2 - R_i^2)}{4\pi\,\omega\,H\,R_i^2 R_o^2} \tag{20}$$

Shear rate and shear stress at the rotor surface:

$$\dot{\gamma}_i = \frac{2\,\omega\,R_o^2}{R_o^2 - R_i^2}, \qquad \tau_i = \frac{M}{2\pi R_i^2 H}, \qquad \mu = \frac{\tau_i}{\dot{\gamma}_i} \tag{21}$$

Angular speed from rev/min: $\omega = 2\pi N/60$.

Wide-cup limit ($R_o \to \infty$): $\dot{\gamma}_i \to 2\omega$ and
$M \to 4\pi\mu\omega H R_i^2$. This is the regime of a spindle in a large
beaker, which is how bench rotary viscometers are normally used.

### 4.2 The spindle factor

Everything in (20) except $M$ and $N$ is geometry, so

$$\mu = K_s \frac{M}{N} \tag{22}$$

with $K_s$ a constant for a given spindle in a given cup. Instrument
makers tabulate it as a spindle factor (often as a "full-scale range" per
spindle and speed). A reading without spindle and speed cannot be
reproduced or checked, which is why the handout requires both.

Percent of full scale. If the instrument's torque capacity is $M_{fs}$,
the reading is at $100\,M/M_{fs}$ percent. Below about 10 percent the
torque signal is in the noise; above 100 percent the instrument is over
range. Choose spindle and speed to sit in between.

### 4.3 Assumptions and their limits

- Newtonian fluid. Oils and water qualify; suspensions and polymer
  solutions generally do not.
- Laminar flow. For an inner rotating cylinder the flow becomes unstable
  to Taylor vortices when the Taylor number
  $Ta = \rho^2 \omega^2 R_i (R_o - R_i)^3 / \mu^2$ exceeds roughly 1700
  (narrow gap). For oils at bench speeds $Ta$ is far below this; for
  water in a wide gap it is not, which is one reason bench rotary
  viscometers do not read water well.
- Isothermal. Viscous heating at these torques is negligible.
- End effects neglected. The top and bottom faces of the rotor add torque
  not captured by (19). Makers either shape the spindle to minimise it or
  fold it into $K_s$ by calibration.
- Rotor fully immersed and coaxial. Partial immersion reduces $H$ in an
  unknown way; eccentricity changes the gap.

### 4.4 Worked example

$R_i$ = 10 mm, $R_o$ = 40 mm, $H$ = 40 mm, $N$ = 60 rev/min, $\mu$ =
0.300 Pa.s.

$\omega$ = 6.283 rad/s
$\dot{\gamma}_i$ = 2 x 6.283 x 0.0016 / (0.0016 - 0.0001) = 13.4 1/s
$M$ = 4 pi x 0.300 x 6.283 x 0.040 x 1e-4 x 0.0016 / 0.0015 = 1.01e-4 N.m
$\tau_i$ = 1.01e-4 / (2 pi x 1e-4 x 0.040) = 4.02 Pa
$\mu$ = 4.02 / 13.4 = 0.300 Pa.s (closes)

A torque of 0.1 mN.m is typical of a bench instrument's low range, which
illustrates why a larger spindle or faster speed is needed for thin fluids.

## 5. Viscosity against temperature

### 5.1 Walther equation (ASTM D341)

$$\log_{10}\!\big(\log_{10}(\nu + 0.7)\big) = A - B\log_{10} T \tag{23}$$

with $\nu$ in cSt and $T$ in kelvin. Two points $(T_1, \nu_1)$ and
$(T_2, \nu_2)$ determine the constants:

$$B = \frac{Z_1 - Z_2}{\log_{10} T_2 - \log_{10} T_1}, \qquad A = Z_1 + B\log_{10} T_1, \qquad Z = \log_{10}\big(\log_{10}(\nu+0.7)\big) \tag{24}$$

More than two points are fitted by least squares in the $(\log_{10} T, Z)$
plane. The 0.7 form loses accuracy below about 2 cSt, where D341 switches
to a polynomial in $\nu$. On Walther paper a mineral oil plots as a
straight line, which is the basis of the ASTM viscosity-temperature chart
and of the viscosity index.

Example, generic 15W-40 from its grade sheet ($\nu$ = 105 cSt at 40 C,
14.5 cSt at 100 C): $B$ = 3.62, $A$ = 9.27. Evaluated:

| T (C) | $\nu$ (cSt) | $\mu$ (cP, $\rho$ = 0.868) |
|---|---|---|
| 5 | 816 | 708 |
| 20 | 300 | 261 |
| 40 | 105 | 91 |
| 50 | 68 | 59 |
| 60 | 46 | 40 |

Roughly a halving every 12 to 15 C in the 20 to 60 C band, and a factor
of about 8 between 40 C and 5 C. That factor is the cold-start problem in
Analysis Question 8.

### 5.2 Andrade (Arrhenius) form

$$\mu = A\,e^{B/T} \tag{25}$$

fitted as $\ln\mu = \ln A + B/T$. Adequate over a narrow range (30 to 40
C span); the Walther form is better over wide ranges and is the industry
standard. The simulator carries both; the Walther fit drives the
displayed curve.

### 5.3 Using the rotary sweep

A rotary sweep of two or more temperatures on the same fluid supersedes
published pairs in the simulator. A bath temperature outside the span of
the fitted data is extrapolation and should be labelled as such. A single
point fixes a value, not a slope, and must never be extrapolated.

## 6. Reconciling the three methods on the bench

For 15W-40, one fluid, three numbers:

| Method | Condition | Raw result | Assessment |
|---|---|---|---|
| Falling ball, 12.70 mm sphere, room temperature | $Re$ about 17 (true) | 1.28 Pa.s | invalid; reads high by 3x to 5x from $Re$ and wall effects combined |
| Saybolt, 50 C | inside 32 to 1000 s | about 0.05 Pa.s | valid at 50 C; convert to 20 C with the Walther curve before comparing |
| Rotary, sweep 60 to 20 C | spindle and speed recorded, on scale | about 0.26 to 0.30 Pa.s at 20 C | valid; the reference for the other two |

The comparison the handout asks for in Question 3 is falling ball against
rotary at the same temperature. The expected disagreement is several
hundred percent, and Question 5 asks for its direction and cause. The
Saybolt result enters only after temperature correction, and then should
agree with the rotary within the combined uncertainty of the two methods,
typically 5 to 15 percent at bench precision.

## 7. Constants

| Constant | Value |
|---|---|
| $g$ | 9.81 m/s^2 |
| steel (chrome, AISI 52100) | 7810 kg/m3 |
| 1/2 inch chrome steel ball | 12.700 mm, 8.36 g |
| water, 20 C | 998.2 kg/m3, 1.002 cP, 1.004 cSt |
| mineral oil density coefficient | about -0.0007 g/cm3 per C |
| 1 inch | 25.4 mm |
| 100 F | 37.8 C |

## 8. References

- ASTM D88, Standard Test Method for Saybolt Viscosity.
- ASTM D2161, Standard Practice for Conversion of Kinematic Viscosity to
  Saybolt Universal Viscosity or to Saybolt Furol Viscosity.
- ASTM D341, Standard Practice for Viscosity-Temperature Equations and
  Charts for Liquid Petroleum or Hydrocarbon Products.
- ISO 3448, Industrial liquid lubricants: ISO viscosity classification.
- SAE J300, Engine Oil Viscosity Classification.
- Faxen, H. (1922). Der Widerstand gegen die Bewegung einer starren Kugel
  in einer zahen Flussigkeit, die zwischen zwei parallelen ebenen Wanden
  eingeschlossen ist. Annalen der Physik 68, 89 to 119.
- Schiller, L. and Naumann, A. (1933). Uber die grundlegenden
  Berechnungen bei der Schwerkraftaufbereitung. Zeitschrift des Vereines
  Deutscher Ingenieure 77, 318 to 320.
- Clift, R., Grace, J. R., Weber, M. E. (1978). Bubbles, Drops, and
  Particles. Academic Press. (drag correlations, wall effects, settling)
- Macosko, C. W. (1994). Rheology: Principles, Measurements, and
  Applications. Wiley-VCH. (concentric-cylinder derivation, end effects,
  Taylor instability)
