# Measuring Viscosity: A Plain-Language Guide

Falling Ball, Saybolt, and Rotary Viscometers
Companion to the Viscosity Measurement Laboratory, Clemson University
(DOI 10.5281/zenodo.22218165)

This guide covers the same lab as the student handout, with the math cut
down to what you need at the bench. The full derivations are in the
separate engineering reference.

## 1. What viscosity is

Viscosity is how much a liquid resists flowing. Water pours easily, so its
viscosity is low. Honey pours slowly, so its viscosity is high. Motor oil
and hydraulic oil sit in between.

Why it matters on a farm or in a shop:

- A hydraulic pump has to pull oil into itself. Thick, cold oil does not
  arrive fast enough. The pump starves, cavitates, and wears out.
- An engine needs oil thin enough to reach every bearing at start-up and
  thick enough to keep a film between metal parts when hot.
- The grade printed on the container (15W-40, ISO 46) is a viscosity
  promise. This lab shows you how such a number is measured.

## 2. The one idea that trips everyone up: two kinds of viscosity

There are two viscosity numbers, and they are not interchangeable.

**Dynamic viscosity** is how hard the liquid is to stir. Unit: centipoise
(cP) or pascal-second (Pa.s). Water is about 1 cP. 1 Pa.s = 1000 cP.

**Kinematic viscosity** is how fast the liquid flows under its own weight.
Unit: centistokes (cSt). Water is about 1 cSt.

The only thing connecting them is density:

    dynamic (cP) = kinematic (cSt) x density (grams per mL)

Oils have a density near 0.87 g/mL, so for oil the cP number is about 13
percent smaller than the cSt number. Water has a density of 1.0, so for
water the two numbers are the same.

Which one does each instrument give you?

| Instrument | What it gives first | Why |
|---|---|---|
| Falling ball | dynamic (Pa.s) | the sphere is pushed by gravity but resisted by stirring drag |
| Saybolt cup | kinematic (cSt) | gravity pushes the liquid through the hole, and gravity works on density |
| Rotary | dynamic (mPa.s, same as cP) | the motor stirs the liquid |

Grades: ISO 46 means 46 cSt (kinematic) at 40 C. SAE 15W-40 means the "40"
is a kinematic band at 100 C and the "15W" is cold-cranking behaviour. The
two labels cannot be compared with each other directly.

## 3. Units cheat sheet

    1 Pa.s   = 1000 cP  = 1000 mPa.s
    1 cP     = 1 mPa.s      (exactly the same thing)
    cSt      = cP / density (g/mL)
    water    = about 1 cP = about 1 cSt at room temperature

Everything in this lab can be done with those four lines.

## 4. Three ways to measure, one sentence each

1. **Falling ball.** Drop a steel ball through the liquid and time it.
   Slow fall means thick liquid.
2. **Saybolt cup.** Let a fixed amount of liquid drain through a small
   hole and time it. Slow drain means thick liquid.
3. **Rotary.** A motor spins a rotor in the liquid and the instrument
   reads how hard it has to push. It shows the viscosity on a screen.

None of the three reads viscosity from nature directly. Each one measures
a time or a force, then a formula turns that into viscosity. The formula
has conditions. If the conditions are not met, the instrument still gives
you a number, but the number is wrong. Part of this lab is learning to
notice when that happens.

## 5. Falling ball, step by step

### 5.1 What you measure

- Mass of the ball (balance) and its diameter (micrometer). On the bench
  these are 8.3 g and 12.70 mm.
- Density of the liquid: weigh 50 mL of it. Mass in grams divided by 50 is
  the density in g/mL. Multiply by 1000 for kg/m3.
- Distance between the two marks on the tube. On the bench: 0.89 m.
- Fall time between the marks. Do it four times and average, because a
  stopwatch thumb is about a tenth of a second slow or fast, and on a
  two-second fall that is 5 percent by itself.

Release the ball at the top of the tube, not at the first mark. The ball
needs a head start to reach its steady speed. Released at the mark, it is
still speeding up while you time it, so it looks slower than it is, and
your viscosity comes out too high.

### 5.2 The bench shortcut

The full formula has the ball's radius, the density difference, gravity,
and the fall distance in it. On this bench all of those are fixed, so they
collapse into one number:

    viscosity (Pa.s) = 0.68 x fall time (seconds)

Multiply by 1000 for cP. Divide the cP figure by the liquid density in
g/mL for cSt.

Worked example, 15W-40 oil, class average fall time 1.89 s:

    0.68 x 1.89 = 1.28 Pa.s = 1280 cP
    1280 / 0.868 = 1480 cSt

Worked example, Dexron II ATF, class average fall time 0.80 s:

    0.68 x 0.80 = 0.54 Pa.s = 540 cP
    540 / 0.844 = 645 cSt

(If you use a different ball, tube or liquid density, the 0.68 changes.
The engineering reference shows how to recompute it. It is
2 x (ball density - liquid density) x 9.81 x radius^2 / (9 x distance).)

### 5.3 The honesty check

The falling-ball formula was worked out for a ball that creeps through the
liquid slowly, like a marble in honey. It stops being true when the ball
moves fast enough to push the liquid aside instead of sliding through it.
Engineers measure this with the Reynolds number, Re. For this bench it
reduces to:

    Re = 14 / (fall time in seconds)^2

and the rule is:

| Fall time | Re | Trust the result? |
|---|---|---|
| more than 12 s | under 0.1 | yes, fully |
| 4 to 12 s | 0.1 to 1 | yes, within about 20 percent |
| 1.2 to 4 s | 1 to 10 | no, but report it and say why |
| under 1.2 s | over 10 | no, the formula does not apply |

Both bench fluids fail the check. 15W-40 at 1.89 s gives Re = 4; ATF at
0.80 s gives Re = 22. The formula still returned 1.28 and 0.54 Pa.s. Those
numbers are too high. Real 15W-40 at room temperature is about 0.3 Pa.s
and real ATF is under 0.1 Pa.s.

Two more things make the bench ball read high: the tube wall drags on a
ball this large (in a 50 mm tube the effect roughly doubles the result),
and the ball may not have finished speeding up.

Do not throw the number away. Write it down, write down the Reynolds
number next to it, and write "Stokes' law does not apply, result reads
high." That is a better answer than a blank.

Why does it read high and not low? Because the real drag at these speeds
is bigger than the formula assumes. Bigger drag makes the ball fall slower.
The formula sees a slow ball and concludes "thick liquid."

How to fix the setup: use a smaller ball. Halving the diameter cuts Re by
eight. A 2.3 mm ball bearing instead of the 12.7 mm sphere cuts it by
about 170. A thicker or colder liquid also helps.

## 6. Saybolt cup, step by step

### 6.1 What you measure

Heat 60 mL of the liquid to 50 C. Plug the bottom of the cup, fill it to
overflowing (the height of liquid sets the push, so it must be the same
every time), pull the plug, and time how long it takes 60 mL to collect in
the flask below. The time in seconds is the reading, called Saybolt
Universal Seconds (SUS).

### 6.2 The conversion

For readings longer than 100 s, which is where oils land:

    kinematic (cSt) = 0.22 x seconds - 135 / seconds

For most readings the second term is under 1 cSt, so the mental version is
"a bit less than 0.22 times the seconds."

For readings between 32 and 100 s (thin fluids):

    kinematic (cSt) = 0.226 x seconds - 195 / seconds

Below 32 s the method does not work. Say so instead of forcing a number.

Then, if you need dynamic viscosity:

    dynamic (cP) = kinematic (cSt) x density (g/mL)

Worked example, a reading of 275 s on 15W-40 at 50 C:

    0.22 x 275 = 60.5;  135 / 275 = 0.5;  60.5 - 0.5 = 60 cSt
    60 x 0.868 = 52 cP = 0.052 Pa.s

Compare that with the falling-ball figure of 1280 cP for the same oil.
The difference is not a mistake in your arithmetic. It is the falling-ball
formula being used outside its range, plus the temperature difference (the
Saybolt sample is at 50 C, the ball was timed at room temperature, and
warm oil is much thinner).

Why 50 C? The cup works between about 32 and 1000 s. At room temperature
these oils would take longer than 1000 s to drain. Heating them brings the
drain time into the band the method covers.

## 7. Rotary viscometer, step by step

### 7.1 What you measure

Fill a beaker with 500 mL, heat it to 60 C, lower the rotor in, and read
the screen. Record the temperature and the reading every 5 C as the sample
cools. The screen reads in mPa.s, which is the same thing as cP.

    Pa.s = reading in mPa.s / 1000

### 7.2 What to write down every time

The rotor (spindle) number and the speed in rev/min. The instrument
converts the twisting force it feels into viscosity using a factor that
depends on the rotor size, how deep it sits, how wide the beaker is, and
the speed. A reading without the spindle and speed is just a number that
nobody can check or repeat.

If the screen shows a percent-of-scale figure, keep it between about 10
and 100 percent. Under 10 percent the instrument is barely feeling
anything; pick a bigger rotor or a faster speed. Over 100 percent it is
overloaded; pick a smaller rotor or a slower speed.

### 7.3 Temperature

Plot viscosity against temperature. It is not a straight line. It drops
steeply as the oil warms from 20 C and then flattens. For a typical motor
oil the viscosity roughly halves for every 10 to 15 C of warming. That is
why a viscosity number without a temperature next to it means nothing, and
why grades are always stated at a fixed temperature (40 C for ISO, 100 C
for the SAE hot number).

Practical note: 500 mL of oil cools very slowly in air. Use a water bath
and step it down, or stop the sweep at 35 C.

## 8. Putting the three together

Fill in this table for one fluid at one temperature:

| Method | Viscosity (cP) | Trust it? | Why |
|---|---|---|---|
| Falling ball | | | Reynolds number from Section 5.3 |
| Saybolt | | | reading inside 32 to 1000 s? |
| Rotary | | | spindle and speed recorded, percent of scale in range? |

Expect the rotary and Saybolt figures to agree within about 10 to 20
percent once you correct for temperature. Expect the falling ball to be
far higher. Being able to say which number you trust, and why, is the
point of the lab. "The rotary one, because it was the most expensive
machine" is not a reason. "The rotary one, because the falling-ball
Reynolds number was 4 and the Saybolt reading was at a different
temperature" is.

## 9. Cold-start question, in plain terms

A hydraulic system designed for oil at 40 C is started at 5 C. The oil is
five to ten times thicker. The pump tries to pull that thick oil through
the suction hose and cannot get enough. The pressure at the pump inlet
drops until vapour bubbles form, and those bubbles collapse hard on the
pressure side. That is cavitation. It sounds like gravel and it eats the
pump. The cylinders on the other end merely move slowly. So the trouble is
at the pump inlet, not at the actuator.

## 10. Glossary

- **Viscosity**: resistance to flow. Thick = high, thin = low.
- **Dynamic (absolute) viscosity**: resistance to stirring. cP, mPa.s, Pa.s.
- **Kinematic viscosity**: flow under its own weight. cSt.
- **Density**: mass per volume. Oils about 0.87 g/mL, water 1.00.
- **Terminal velocity**: the steady speed a falling ball settles at once
  drag balances weight.
- **Stokes' law**: the falling-ball formula. Valid only for slow, creeping
  motion.
- **Reynolds number (Re)**: a check on whether the motion is slow enough
  for Stokes' law. Small is good. Under 1 is required.
- **SUS**: Saybolt Universal Seconds, the drain time in the Saybolt cup.
- **Spindle factor**: the number a rotary viscometer multiplies its torque
  by. Different for every rotor and speed.
- **Newtonian fluid**: a liquid whose viscosity does not change with how
  hard you stir it. Oils and water are. Cornstarch in water is not, and no
  formula in this lab works for it.
- **Cavitation**: vapour bubbles forming in a pump because the oil cannot
  arrive fast enough, then collapsing and damaging metal.

## 11. Common mistakes

1. Quoting cSt where cP was asked, or the other way round. Check the unit
   every time.
2. Forgetting the density when converting between them.
3. Releasing the ball at the first mark instead of above it.
4. Not recording the temperature. Every viscosity needs one.
5. Not recording the rotor and speed on the rotary instrument.
6. Deleting the falling-ball result because it disagrees with the rotary.
   Report it with its Reynolds number instead.
7. Forcing a Saybolt reading under 32 s through the formula.
8. Trusting the instrument that looked most impressive rather than the one
   whose conditions were met.
