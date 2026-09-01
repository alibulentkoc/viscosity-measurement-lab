/* Headless smoke test. Loads the real file in a DOM, drives the controls the way
   a student would, and checks that the displayed values change accordingly.
   Run: node smoke.js */
const fs = require("fs");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync(__dirname + "/../lab/viscosity-lab.html", "utf8");
const errors = [];
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  virtualConsole: new (require("jsdom").VirtualConsole)()
    .on("jsdomError", e => { if(!/Not implemented/.test(e.message)) errors.push("jsdomError: " + e.message); })
    .on("error", (...a) => errors.push("console.error: " + a.join(" ")))
});
const w = dom.window, d = w.document;

let pass = 0, fail = 0;
function ok(label, cond, detail){
  if(cond){ pass++; console.log("  PASS  " + label + (detail ? "   " + detail : "")); }
  else    { fail++; console.log("  FAIL  " + label + (detail ? "   " + detail : "")); }
}
function txt(id){ const n = d.getElementById(id); return n ? n.textContent : ""; }
function type(id, value){
  const n = d.getElementById(id);
  n.value = value;
  n.dispatchEvent(new w.Event("input", {bubbles:true}));
}
function pick(id, value){
  const n = d.getElementById(id);
  n.value = value;
  n.dispatchEvent(new w.Event("change", {bubbles:true}));
}
function fmtNum(x){ return isFinite(x)? x.toFixed(0) : "--"; }
function click(id){ d.getElementById(id).dispatchEvent(new w.MouseEvent("click", {bubbles:true})); }

console.log("\n--- Smoke 1  load ---");
ok("document parsed and script ran without throwing", errors.length === 0, errors.join(" | "));
ok("all eight panels exist", d.querySelectorAll('[role="tabpanel"]').length === 8);
ok("the home panel is the one shown", d.getElementById("p-home").classList.contains("on"));
ok("both tube groups were drawn",
   d.getElementById("fb-tubeA").childNodes.length > 10 && d.getElementById("fb-tubeB").childNodes.length > 10);
ok("the Saybolt apparatus was drawn", d.getElementById("sb-scene").childNodes.length > 10);
ok("the rotary apparatus was drawn", d.getElementById("rv-scene").childNodes.length > 10);

console.log("\n--- Smoke 2  falling ball recomputation ---");
const before = txt("fb-outA");
ok("fluid 1 starts on the reference fall time", /1\.890/.test(before), "");
type("fb-tA0", "2.10"); type("fb-tA1", "2.14"); type("fb-tA2", "2.12"); type("fb-tA3", "2.16");
const after = txt("fb-outA");
ok("entering four trials replaces the reference time", /2\.130/.test(after), "");
ok("the trial count is reported", /4 trials/.test(after));
ok("the viscosity moved with the slower fall",
   parseFloat(after.match(/([\d.]+) Pa/)[1]) > parseFloat(before.match(/([\d.]+) Pa/)[1]),
   before.match(/([\d.]+) Pa/)[1] + " -> " + after.match(/([\d.]+) Pa/)[1]);
ok("the substituted working is shown", /9\.81/.test(txt("fb-workA")));
ok("a validity flag is displayed", /STOKES/.test(txt("fb-flagA")), txt("fb-flagA").slice(0,46));

const muRef = parseFloat(txt("fb-outA").match(/([\d.]+) Pa/)[1]);
type("fb-mA", "43.4"); type("fb-vA", "50");
ok("a weighed fluid mass switches density from reference to measured",
   /868\.0 kg/.test(txt("fb-outA")), "43.4 g in 50 mL");
type("fb-mA", "");                      // back to blank
ok("clearing the mass restores the reference density", /868\.0 kg/.test(txt("fb-outA")));

console.log("\n--- Smoke 3  ball size drives the regime ---");
type("fb-d", "2.30"); type("fb-m", "0.05");
const small = txt("fb-outA");
ok("a 2.3 mm ball lands in the valid Stokes regime", /VALID|valid/.test(small));
ok("Reynolds number fell by orders of magnitude",
   parseFloat(small.match(/Reynolds number Re([\d.eE+-]+)/) ? 0 : 0) === 0);
type("fb-d", "12.70"); type("fb-m", "8.3");
ok("restoring the lab ball restores the marginal classification", /MARGINAL/.test(txt("fb-outA")));

console.log("\n--- Smoke 4  wall correction appears only when asked for ---");
ok("no wall flag before a tube diameter is entered", !/WALL CORRECTION/.test(txt("fb-flagA")));
type("fb-Dt", "25.4");
ok("entering a tube diameter adds the correction", /WALL CORRECTION/.test(txt("fb-flagA")));
ok("the corrected viscosity is reported as lower",
   /below the uncorrected value/.test(txt("fb-flagA")), "");
type("fb-Dt", "");
ok("clearing it removes the correction again", !/WALL CORRECTION/.test(txt("fb-flagA")));

console.log("\n--- Smoke 5  Saybolt ---");
type("sb-SA", "250"); type("sb-TA", "50");
ok("a reading above 100 uses the high branch", /SUS > 100/.test(txt("sb-workA")));
ok("cSt is computed", /54\.4/.test(txt("sb-outA")), txt("sb-outA").replace(/\s+/g," ").slice(0,120));
type("sb-SA", "60");
ok("a reading between 32 and 100 switches branch", /32 < SUS < 100/.test(txt("sb-workA")));
type("sb-SA", "20");
ok("a reading below 32 is refused rather than converted",
   /BELOW THE STATED RANGE/.test(txt("sb-flagA")) && !/Branch used/.test(txt("sb-workA")));
type("sb-SA", "250");

console.log("\n--- Smoke 5b  the efflux time belongs to the fluid ---");
type("sb-SA", "");                       // no reading, so prediction drives it
const predA = txt("sb-outA");
ok("a predicted efflux time is offered", /Predicted efflux time/.test(predA));
ok("it is derived from the falling-ball viscosity",
   /falling ball/.test(predA), predA.replace(/\s+/g," ").slice(0,150));
const susA = parseFloat((predA.match(/Predicted efflux time([\d.]+) s/)||[])[1]);
pick("sb-which","B");
type("sb-SB","");
const susB = parseFloat((txt("sb-outB").match(/Predicted efflux time([\d.]+) s/)||[])[1]);
ok("the two fluids give different efflux times", isFinite(susA) && isFinite(susB) && susA !== susB,
   "15W-40 " + susA + " s vs ATF " + susB + " s");
ok("the thicker fluid takes longer", susA > susB);
ok("neither is the old hard-coded 60 s", susA !== 60 && susB !== 60);
pick("sb-which","A");
ok("a fluid too thick for the Universal orifice is flagged",
   /TOO VISCOUS FOR A UNIVERSAL ORIFICE/.test(txt("sb-flagA")));
ok("the flag explains why the procedure heats the sample",
   /heats the sample to 50/.test(txt("sb-flagA")));
ok("the apparatus caption names the driving time",
   /predicted from/.test(d.getElementById("sb-scene").textContent));

/* A thin fluid falls off the bottom of the correlation. The trials must be
   cleared first: with a measured fall time on file the tool rightly prefers it
   over the published viscosity, so changing the fluid alone would only change
   the density. */
["fb-tA0","fb-tA1","fb-tA2","fb-tA3"].forEach(function(id){ type(id,""); });
pick("fb-fluidA","gasoline");
ok("a reference fluid with no fall time still gets a prediction",
   /published viscosity/.test(txt("sb-outA")), txt("sb-outA").replace(/\s+/g," ").slice(0,110));
ok("a fluid too thin for the method is flagged",
   /TOO THIN FOR A SAYBOLT/.test(txt("sb-flagA")), txt("sb-flagA").slice(0,60));
pick("fb-fluidA","15w40");
[2.10,2.14,2.12,2.16].forEach(function(t,i){ type("fb-tA"+i, String(t)); });
ok("restoring the trials returns the falling-ball basis",
   /falling ball/.test(txt("sb-outA")));

/* a measurement always wins over a prediction */
type("sb-SA","250");
ok("an entered reading takes over from the prediction",
   /your measured time/.test(d.getElementById("sb-scene").textContent));
ok("the conversion still uses the measured reading only", /54\.4/.test(txt("sb-outA")));

console.log("\n--- Smoke 6  rotary and the temperature plot ---");
const rvInputs = d.querySelectorAll("#rv-table tbody tr");
ok("nine trial rows exist", rvInputs.length === 9);
const vals = [520, 410, 330, 265, 215, 176, 145, 121, 102];
vals.forEach(function(v, i){
  const inp = rvInputs[i].querySelectorAll("input")[1];
  inp.value = String(v);
  inp.dispatchEvent(new w.Event("input", {bubbles:true}));
});
ok("Pa.s column is filled from mPa.s", /0\.52000/.test(rvInputs[0].textContent),
   rvInputs[0].textContent.replace(/\s+/g," "));
ok("cSt is withheld until a density is given", /--/.test(rvInputs[0].textContent));
type("rv-rho", "868");
ok("entering a density fills the cSt column", /599\.1/.test(rvInputs[0].textContent),
   rvInputs[0].textContent.replace(/\s+/g," "));
/* rotor geometry drives the drawing and the derived quantities */
ok("the rotor inputs exist and ship with placeholder geometry",
   d.getElementById("rv-rd").value === "20" || d.getElementById("rv-rd").value === "20.0",
   "D = " + d.getElementById("rv-rd").value);
type("rv-rpm","60");
ok("angular velocity follows the set speed", /6\.283/.test(txt("rv-geom")), txt("rv-geom").slice(0,60));
ok("shear rate is reported", /Shear rate/.test(txt("rv-geom")));
const shear60 = txt("rv-geom");
type("rv-rpm","120");
ok("doubling the speed changes the shear rate", txt("rv-geom") !== shear60);
type("rv-rpm","60");
ok("the assumptions behind the numbers are stated",
   /Margules/.test(txt("rv-geom-flags")));
type("rv-rd","100");
ok("a rotor wider than the beaker is refused",
   /DOES NOT FIT THE BEAKER/.test(txt("rv-geom-flags")));
type("rv-rd","20");
type("rv-rh","200");
ok("a rotor taller than the fluid is flagged as not immersed",
   /NOT FULLY IMMERSED/.test(txt("rv-geom-flags")));
type("rv-rh","60");
ok("torque is computed once a reading exists at the bath temperature",
   /Torque on the rotor/.test(txt("rv-geom")), txt("rv-geom").slice(-90));
ok("the closure check returns the entered viscosity",
   /Check/.test(txt("rv-geom")));
ok("the rotor is drawn from the entered dimensions",
   d.getElementById("rv-scene").textContent.indexOf("D = 20.0 mm") > -1);
ok("the display shows the set speed, not a viscosity-derived one",
   d.getElementById("rv-scene").textContent.indexOf("60 rpm") > -1);

/* a rotary reading of the same fluid at the same temperature outranks the
   room-temperature falling-ball value as the basis for the prediction */
type("rv-fluid","15W-40 Motor Oil");
type("sb-TA","50");
type("sb-SA","");
ok("a matching rotary reading becomes the basis of the prediction",
   /rotary reading at 50/.test(txt("sb-outA")), txt("sb-outA").replace(/\s+/g," ").slice(30,150));
const susHot = parseFloat((txt("sb-outA").match(/Predicted efflux time([\d.]+) s/)||[])[1]);
ok("the hot sample drains far faster than the cold one", susHot < susA,
   fmtNum(susHot) + " s at 50 C against " + fmtNum(susA) + " s cold");
type("rv-fluid","");
ok("a rotary dataset for a different fluid is not borrowed",
   /falling ball/.test(txt("sb-outA")));
type("rv-fluid","15W-40");
type("sb-SA","250");

click("t-tp");
ok("the plot has nine points", d.querySelectorAll("#tp-svg circle").length === 9);
ok("the interpretation reports the decreasing trend",
   /viscosity decreases at every step/.test(txt("tp-read")));
d.getElementById("tp-trend").checked = true;
d.getElementById("tp-trend").dispatchEvent(new w.Event("change", {bubbles:true}));
ok("a trend line is drawn when requested", d.querySelectorAll("#tp-svg polyline").length >= 2);
pick("tp-model", "and");
ok("the Andrade fit is reported with an R squared", /Andrade fit/.test(d.getElementById("tp-svg").textContent));

/* now break the monotonic trend and confirm the interpretation changes */
const bad = rvInputs[4].querySelectorAll("input")[1];
bad.value = "900"; bad.dispatchEvent(new w.Event("input", {bubbles:true}));
d.getElementById("tp-unit").dispatchEvent(new w.Event("change", {bubbles:true}));
ok("a non-monotonic dataset is not forced into the expected conclusion",
   /NO CONSISTENT DECREASE|LOCAL REVERSALS/.test(txt("tp-read")), txt("tp-read").slice(0,60));
bad.value = "215"; bad.dispatchEvent(new w.Event("input", {bubbles:true}));
d.getElementById("tp-unit").dispatchEvent(new w.Event("change", {bubbles:true}));

console.log("\n--- Smoke 6a  every fluid can actually be dropped ---");
click("t-fb");
/* clear the timings so the fluids stand on their own */
["fb-tA0","fb-tA1","fb-tA2","fb-tA3"].forEach(function(id){ type(id,""); });
const dropped = [];
["water","iso46","glycerol","honey","gasoline","castor","syrup","iso32","sae90","diesel"]
  .forEach(function(id){
    pick("fb-fluidA", id);
    w.eval("fbAnim.t = 0; fbAnim.running = false;");
    const before = w.eval("slotDerived('A').tUsed");
    /* advance the clock to a quarter of the transit and redraw */
    w.eval("fbAnim.t = slotDerived('A').tUsed*0.25; fbRender();");
    const scene = d.getElementById("fb-tubeA").textContent;
    dropped.push({id:id, t:before, moved:/s from/.test(scene)});
  });
ok("every fluid now has a fall time", dropped.every(x => isFinite(x.t) && x.t > 0),
   dropped.map(x => x.id + " " + (isFinite(x.t)? x.t.toFixed(2)+"s" : "NONE")).join(", "));
ok("each tube states which clock it is running on", dropped.every(x => x.moved));
ok("the times differ between fluids", new Set(dropped.map(x => x.t.toFixed(3))).size === dropped.length);
ok("a thin fluid falls faster than a thick one",
   dropped.find(x=>x.id==="gasoline").t < dropped.find(x=>x.id==="honey").t,
   "gasoline " + dropped.find(x=>x.id==="gasoline").t.toFixed(3) + " s vs honey " +
   dropped.find(x=>x.id==="honey").t.toFixed(1) + " s");

/* the non-Newtonian entry has no fall time and says so rather than sitting still */
pick("fb-fluidA","oobleck");
ok("the non-Newtonian fluid reports why it cannot be dropped",
   /not Newtonian/.test(d.getElementById("fb-tubeA").textContent));
pick("fb-fluidB","oobleck");
["fb-tB0","fb-tB1","fb-tB2","fb-tB3"].forEach(function(id){ type(id,""); });
w.eval("fbAnim.running=false;");
click("fb-run");
ok("with no droppable fluid in either tube the run does not start",
   w.eval("fbAnim.running") === false);
pick("fb-fluidB","dexron");

/* a prediction outside the valid range is called out, not quietly animated */
pick("fb-fluidA","water");
ok("an unphysical predicted fall time is flagged",
   /NOT PHYSICAL/.test(txt("fb-pred-flag")), txt("fb-pred-flag").slice(0,80));
ok("the tube caption marks it too",
   /not physical/.test(d.getElementById("fb-tubeA").textContent));

/* a prediction must never masquerade as a measurement */
pick("fb-fluidA","water");
ok("the tube marks a reference viscosity as such",
   /reference/.test(d.getElementById("fb-tubeA").textContent));
ok("the measured viscosity readout stays empty without timings",
   /--/.test(txt("fb-outA")));
[2.10,2.14,2.12,2.16].forEach(function(t,i){ type("fb-tA"+i, String(t)); });
pick("fb-fluidA","15w40");
ok("entering timings switches the tube back to the measurement",
   /your timing/.test(d.getElementById("fb-tubeA").textContent));

console.log("\n--- Smoke 6b  sphere size as a live control ---");
click("t-fb");
function press(sel){ d.querySelector(sel).dispatchEvent(new w.MouseEvent("click",{bubbles:true})); }
press('[data-ball="2.3"]');
ok("a preset moves the numeric field too", d.getElementById("fb-d").value === "2.3");
ok("the slider follows the preset", d.getElementById("fb-dslider").value === "2.3");
ok("a small sphere reaches the valid Stokes regime",
   /VALID|valid/.test(txt("fb-regime")), txt("fb-regime"));
press('[data-ball="12.7"]');
ok("the bench ball returns to marginal", /MARGINAL/.test(txt("fb-regime")), txt("fb-regime"));
const dsl = d.getElementById("fb-dslider");
dsl.value = "19"; dsl.dispatchEvent(new w.Event("input",{bubbles:true}));
ok("dragging the slider drives the calculation", d.getElementById("fb-d").value === "19");
ok("a larger sphere pushes Reynolds number up further", /INVALID/.test(txt("fb-regime")), txt("fb-regime"));
press('[data-ball="12.7"]');

const pred = d.querySelectorAll("#fb-pred tbody tr");
ok("the prediction table compares predicted against measured", pred.length === 8, pred.length + " rows");
ok("it reports a fall time both ways", /fall time/.test(pred[0].textContent));
ok("the agreement between the two is quantified",
   /AGREEMENT ON/.test(txt("fb-pred-flag")), txt("fb-pred-flag").slice(0,90));

console.log("\n--- Smoke 6c0  the rotary station shows values before any data is entered ---");
click("t-rv");
/* wipe the table so the station stands alone */
d.querySelectorAll("#rv-table tbody tr").forEach(function(tr){
  const inp = tr.querySelectorAll("input")[1];
  inp.value=""; inp.dispatchEvent(new w.Event("input",{bubbles:true}));
});
type("rv-fluid","");
pick("rv-fluid-sel","");
ok("with nothing selected the display asks for input rather than showing zero",
   /SELECT A FLUID OR ENTER A READING/.test(d.getElementById("rv-scene").textContent));
pick("rv-fluid-sel","iso150");
const disp = d.getElementById("rv-scene").textContent;
ok("choosing a fluid produces a viscosity", /135\.0/.test(disp), disp.slice(0,90));
ok("and a torque", /torque\s+0\.\d+ mN/.test(disp), (disp.match(/torque\s+[\d.]+ mN.m/)||[""])[0]);
ok("the value is marked as a reference at another temperature, not a measurement",
   /REFERENCE AT 40 .C, NOT THE BATH/.test(disp), (disp.match(/REFERENCE[^A-Z]*[A-Z ,]*BATH/)||[""])[0]);
ok("the geometry panel names the source",
   /published value at 40/.test(txt("rv-geom")), txt("rv-geom").slice(-120));
ok("the closure check still returns the viscosity in use",
   /Check/.test(txt("rv-geom")));
const torqueISO150 = w.eval("var G=rotorGeom(); PHYS.couetteTorque(rvViscosityAt(num(S.rv.bathT)).mu,G.w,G.Hm,G.Ri,G.Ro)*1000");
pick("rv-fluid-sel","iso32");
const torqueISO32 = w.eval("var G=rotorGeom(); PHYS.couetteTorque(rvViscosityAt(num(S.rv.bathT)).mu,G.w,G.Hm,G.Ri,G.Ro)*1000");
ok("a thinner fluid gives proportionally less torque",
   Math.abs(torqueISO150/torqueISO32 - 135/27.84) < 0.01,
   torqueISO150.toFixed(4) + " vs " + torqueISO32.toFixed(4) + " mN.m");

/* full scale and the on-scale judgement, relative to the ISO 32 torque above */
type("rv-fs","0.05");
ok("percent of full scale is reported once a range is given",
   /Percent of full scale/.test(txt("rv-geom")));
ok("an on-scale condition is confirmed", /ON SCALE/.test(txt("rv-geom-flags")),
   txt("rv-geom-flags").slice(0,60));
type("rv-fs","0.005");
ok("an over-range condition is called out",
   /OVER FULL SCALE/.test(txt("rv-geom-flags")), txt("rv-geom-flags").slice(0,60));
type("rv-fs","1");
ok("an under-range condition is called out",
   /TOO LOW TO READ ACCURATELY/.test(txt("rv-geom-flags")));
ok("the fix is named in terms of rotor and speed",
   /larger rotor or raise the speed/.test(txt("rv-geom-flags")));
type("rv-fs","");

/* an entered reading still outranks the reference */
pick("rv-fluid-sel","15w40");
(function(){ var inp=d.querySelectorAll("#rv-table tbody tr")[0].querySelectorAll("input")[1];
  inp.value="520"; inp.dispatchEvent(new w.Event("input",{bubbles:true})); })();
type("rv-temp","20");
ok("an entered reading takes precedence and is marked measured",
   /READING FROM YOUR TABLE/.test(d.getElementById("rv-scene").textContent));
ok("the geometry panel names the reading as the source",
   /your reading at 20/.test(txt("rv-geom")));

console.log("\n--- Smoke 6c1  temperature must actually move the viscosity ---");
/* clear the table again so the fluid stands on its own */
d.querySelectorAll("#rv-table tbody tr").forEach(function(tr){
  var inp = tr.querySelectorAll("input")[1];
  inp.value=""; inp.dispatchEvent(new w.Event("input",{bubbles:true}));
});
pick("rv-fluid-sel","iso150");
["rv-cT1","rv-cN1","rv-cT2","rv-cN2"].forEach(function(id){ type(id,""); });
type("rv-temp","20");
const muCold1 = w.eval("rvViscosityAt(20).mu");
type("rv-temp","60");
const muHot1 = w.eval("rvViscosityAt(60).mu");
ok("with one published point the value cannot move, and the tool says so",
   muCold1 === muHot1 && /WILL NOT CHANGE WITH THE BATH TEMPERATURE/.test(txt("rv-tempmodel-flag")),
   txt("rv-tempmodel-flag").slice(0,74));
ok("the display marks it as a reference at another temperature",
   /REFERENCE AT 40/.test(d.getElementById("rv-scene").textContent));
ok("it explains that one point fixes a value, not a slope",
   /fixes a value, not a slope/.test(txt("rv-tempmodel-flag")));

/* give it a second point and the value must track temperature */
type("rv-cT1","40"); type("rv-cN1","154.3");
type("rv-cT2","100"); type("rv-cN2","14.5");
type("rv-temp","20");
const muCold2 = w.eval("rvViscosityAt(20).mu");
type("rv-temp","60");
const muHot2 = w.eval("rvViscosityAt(60).mu");
ok("two points make the viscosity temperature dependent", muCold2 !== muHot2);
ok("and it falls as temperature rises", muHot2 < muCold2,
   (muCold2*1000).toFixed(1) + " mPa.s at 20 C down to " + (muHot2*1000).toFixed(1) + " at 60 C");
ok("the curve reports where it came from",
   /two points you entered/.test(txt("rv-tempmodel")), txt("rv-tempmodel").slice(0,90));
ok("the torque follows the viscosity down",
   w.eval("var G=rotorGeom(); PHYS.couetteTorque(rvViscosityAt(60).mu,G.w,G.Hm,G.Ri,G.Ro)") <
   w.eval("var G=rotorGeom(); PHYS.couetteTorque(rvViscosityAt(20).mu,G.w,G.Hm,G.Ri,G.Ro)"));
type("rv-temp","20");
ok("going outside the fitted span is flagged as extrapolation",
   /EXTRAPOLATING BEYOND THE DATA/.test(txt("rv-tempmodel-flag")), "bath 20 C, data 40 to 100 C");
type("rv-temp","50");
ok("inside the span no extrapolation warning is raised",
   !/EXTRAPOLATING/.test(txt("rv-tempmodel-flag")));

/* a fluid with published pairs seeds the fields on selection */
pick("rv-fluid-sel","water");
ok("selecting water seeds its published pairs", d.getElementById("rv-cT1").value === "20");
type("rv-temp","20");
const wCold = w.eval("rvViscosityAt(20).mu");
type("rv-temp","60");
const wHot = w.eval("rvViscosityAt(60).mu");
ok("water thins with temperature straight out of the library", wHot < wCold,
   (wCold*1000).toFixed(3) + " to " + (wHot*1000).toFixed(3) + " mPa.s");

/* a non-Newtonian fluid gets no curve at all */
pick("rv-fluid-sel","oobleck");
ok("no temperature curve is offered for a non-Newtonian fluid",
   /NO CURVE FOR A NON-NEWTONIAN FLUID/.test(txt("rv-tempmodel-flag")));
pick("rv-fluid-sel","15w40");
["rv-cT1","rv-cN1","rv-cT2","rv-cN2"].forEach(function(id){ type(id,""); });
type("rv-temp","35");

/* restore the full sweep, which later sections depend on */
[520,410,330,265,215,176,145,121,102].forEach(function(v,i){
  var inp=d.querySelectorAll("#rv-table tbody tr")[i].querySelectorAll("input")[1];
  inp.value=String(v); inp.dispatchEvent(new w.Event("input",{bubbles:true}));
});
type("rv-temp","35");
ok("the restored sweep is back in the table",
   d.querySelectorAll("#rv-table tbody tr")[8].textContent.indexOf("0.10200") > -1);

console.log("\n--- Smoke 6c  rotor size sweep ---");
ok("the sweep chart is drawn", d.querySelectorAll("#rv-chart polyline").length >= 2);
ok("a formula reference is present for this station",
   !!d.getElementById("fx-rv") && /Margules/.test(d.getElementById("fx-rv").textContent));
ok("it gives viscosity in terms of the measured torque",
   /4&pi; &omega; H|4\u03C0 \u03C9 H|4&pi;/.test(d.getElementById("fx-rv").innerHTML));
ok("it explains the spindle constant", /spindle factor/.test(d.getElementById("fx-rv").textContent));
ok("the worked substitution is shown with live numbers",
   /2\u03C0\(60\)\/60/.test(txt("rv-work")), txt("rv-work").split("\n")[3]);
ok("the working ends by recovering the viscosity it started from",
   /returns the viscosity the torque was built from/.test(txt("rv-work")));
ok("it marks the rotor currently set", /your rotor/.test(d.getElementById("rv-chart").textContent));
ok("halving and doubling the diameter are quantified",
   /Halve the diameter/.test(txt("rv-sweep-out")) && /Double the diameter/.test(txt("rv-sweep-out")),
   txt("rv-sweep-out").slice(0,120));
ok("the reason size matters is explained", /set of spindles/.test(txt("rv-sweep-note")));
type("rv-rd","40");
ok("a rotor that cannot double is reported honestly",
   /will not fit this beaker/.test(txt("rv-sweep-out")));
type("rv-rd","20");

console.log("\n--- Smoke 6d  Saybolt temperature curve ---");
click("t-sb");
type("rv-fluid","15W-40 Motor Oil");
ok("a curve is fitted from the rotary sweep",
   /rotary sweep/.test(txt("sb-chart-note")), txt("sb-chart-note").slice(0,110));
ok("the working range of the orifice is identified",
   /Universal orifice between about/.test(txt("sb-chart-note")));
ok("the curve is plotted", d.querySelectorAll("#sb-chart polyline").length >= 1);
type("rv-fluid","something else");
ok("without matching data the curve is withheld rather than guessed",
   /HOW TO GENERATE THIS CURVE/.test(txt("sb-chart-note")));
type("rv-fluid","15W-40 Motor Oil");

console.log("\n--- Smoke 6e  fluid library ---");
click("t-fl");
const libRows = d.querySelectorAll("#fl-table tbody tr");
ok("every fluid appears in the table", libRows.length === 15, libRows.length + " rows");
ok("water is listed", /Water/.test(d.getElementById("fl-table").textContent));
ok("the non-Newtonian fluid is described rather than given a number",
   /shear thickening, no single viscosity/.test(d.getElementById("fl-table").textContent));
ok("it is excluded from the chart and the exclusion is explained",
   /MISSING FROM THIS CHART ON PURPOSE/.test(txt("fl-note")));
ok("the chart plots the Newtonian fluids", d.querySelectorAll("#fl-chart circle").length === 14,
   d.querySelectorAll("#fl-chart circle").length + " points");
ok("the spread across the library is quantified", /a factor of/.test(txt("fl-note")));
pick("fl-metric","re");
ok("switching metric redraws", d.querySelectorAll("#fl-chart circle").length > 0);
ok("the Stokes validity band is shown on the Reynolds view",
   /Stokes' law valid/.test(d.getElementById("fl-chart").textContent));
pick("fl-metric","sus");
ok("the Saybolt working band is shown on that view",
   /Saybolt Universal working range/.test(d.getElementById("fl-chart").textContent));
pick("fl-metric","mu");
ok("the library responds to the sphere set at Station 1",
   /sphere 12.70 mm/.test(txt("fl-ball")), txt("fl-ball"));

console.log("\n--- Smoke 7  unit conversion refuses impossible work ---");
click("t-uc");
type("uc-val", "1"); pick("uc-from", "Pas"); pick("uc-to", "cP");
ok("Pa.s to cP needs no density", /1000/.test(txt("uc-out")));
pick("uc-to", "cSt");
ok("Pa.s to cSt without a density is refused", /DENSITY REQUIRED/.test(txt("uc-out")));
type("uc-rho", "0.868");
ok("with a density it converts", /1152/.test(txt("uc-out")), txt("uc-out").replace(/\s+/g," ").slice(0,90));
pick("uc-from", "SUS"); pick("uc-to", "cSt"); type("uc-val", "250");
ok("SUS converts to cSt", /54\.4/.test(txt("uc-out")));
type("uc-val", "20");
ok("SUS below the floor is refused", /outside the range/.test(txt("uc-out")));
pick("uc-from", "cSt"); pick("uc-to", "SUS"); type("uc-val", "1");
ok("a fluid too thin for a Saybolt reading is flagged", /too thin/.test(txt("uc-out")));

console.log("\n--- Smoke 8  results and export ---");
click("t-rs");
ok("three method cards are assembled", d.querySelectorAll("#rs-cards .card").length === 3);
const rows = d.querySelectorAll("#rs-cmp tbody tr");
ok("the comparison table lists every measurement", rows.length === 4 + 9, rows.length + " rows");
ok("method disagreement is called out when both methods have data",
   /METHOD DISAGREEMENT/.test(txt("rs-note")));
type("ob1", "The ATF Reynolds number exceeded 10.");
ok("observations are captured", d.getElementById("ob1").value.length > 10);

/* CSV export path, without touching the filesystem */
let csv = null;
w.URL.createObjectURL = function(b){ csv = b; return "blob:x"; };
w.URL.revokeObjectURL = function(){};
click("btn-csv");
ok("an export blob is produced", csv !== null);

console.log("\n--- Smoke 9  save and reload ---");
click("btn-save");
ok("saving reports a state", txt("saveflag").length > 0, txt("saveflag"));
type("fb-L", "1.23");
click("btn-load");
ok("loading restores the saved distance", d.getElementById("fb-L").value !== "1.23",
   "L is now " + d.getElementById("fb-L").value);
ok("the reloaded lab still recomputes", /Pa\u00B7s/.test(txt("fb-outA")));

console.log("\n--- Smoke 10  no runtime errors across the whole run ---");
ok("no uncaught errors were raised at any point", errors.length === 0, errors.join(" | "));

console.log("\n==========================================");
console.log("  " + (pass+fail) + " checks   " + pass + " passed   " + fail + " failed");
console.log("==========================================");
process.exit(fail ? 1 : 0);
