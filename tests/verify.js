/* Verification suite for the Viscosity Measurement Laboratory.
   Run: node verify.js
   Suite 1  sphere and density
   Suite 2  Stokes' law against the published laboratory results
   Suite 3  Reynolds number and validity classification
   Suite 4  unit conversions
   Suite 5  Saybolt conversion, both branches and the inverse
   Suite 6  wall correction
   Suite 7  curve fitting
   Suite 8  file integrity and DOM wiring
*/
const fs = require("fs");
const path = require("path");
const HTML = fs.readFileSync(path.join(__dirname, "..", "lab", "viscosity-lab.html"), "utf8");

/* extract the physics block exactly as the browser sees it */
const i = HTML.indexOf("PHYSICS-START");
const j = HTML.lastIndexOf("/* PHYSICS-END");
let body = HTML.slice(i + "PHYSICS-START".length, j);
body = body.slice(body.indexOf("*/") + 2);
eval(body);

let pass = 0, fail = 0, suite = "";
function S(name){ suite = name; console.log("\n--- " + name + " ---"); }
function ok(label, cond, detail){
  if(cond){ pass++; console.log("  PASS  " + label + (detail ? "   " + detail : "")); }
  else    { fail++; console.log("  FAIL  " + label + (detail ? "   " + detail : "")); }
}
function near(label, got, want, tol, unit){
  const d = Math.abs(got - want);
  ok(label, d <= tol, "got " + got.toPrecision(6) + " want " + want + (unit ? " " + unit : "") + "  (|d|=" + d.toExponential(2) + ")");
}

/* ------------------------------------------------------------------ */
S("Suite 1  sphere geometry and density");
const r = 12.70 / 2000;                       // 6.35 mm in metres
const V = PHYS.sphereVolume(r);
near("sphere volume of the 12.70 mm lab ball", V, 1.0724e-6, 5e-10, "m3");
near("sphere density from 8.3 g", PHYS.density(0.0083, V), 7739, 2, "kg/m3");
near("fluid density 43.4 g in 50 mL", (43.4/50)*1000, 868, 0.5, "kg/m3");
ok("zero volume gives NaN, not Infinity", !isFinite(PHYS.density(1, 0)));
near("average of four trials", PHYS.average([1.88,1.90,1.89,1.89]), 1.89, 1e-9, "s");
ok("average ignores blanks", PHYS.average([2.0, NaN, 2.0, NaN]) === 2.0);
ok("average of nothing is NaN", !isFinite(PHYS.average([])));

/* ------------------------------------------------------------------ */
S("Suite 2  Stokes' law against the published laboratory results");
const L = 0.89, RHO_S = 7739;
// Fluid 1: 15W-40, rho 868, t_avg 1.89 s  ->  mu 1.2826 Pa.s
let v1 = PHYS.velocity(L, 1.89);
near("15W-40 velocity", v1, 0.470899, 1e-5, "m/s");
let mu1 = PHYS.muStokes(RHO_S - 868, r, v1);
near("15W-40 viscosity reproduces the lab value", mu1, 1.2826, 5e-3, "Pa.s");
// Fluid 2: Dexron II ATF, rho 844, t_avg 0.80 s  ->  mu 0.5448 Pa.s
let v2 = PHYS.velocity(L, 0.80);
near("ATF velocity", v2, 1.1125, 1e-4, "m/s");
let mu2 = PHYS.muStokes(RHO_S - 844, r, v2);
near("ATF viscosity reproduces the lab value", mu2, 0.5448, 5e-3, "Pa.s");
ok("thicker fluid gives the slower fall", 1.89 > 0.80 && mu1 > mu2);
// round trip through the velocity form
near("vStokes inverts muStokes for fluid 1", PHYS.vStokes(RHO_S-868, r, mu1), v1, 1e-9, "m/s");
near("vStokes inverts muStokes for fluid 2", PHYS.vStokes(RHO_S-844, r, mu2), v2, 1e-9, "m/s");
ok("zero velocity yields NaN rather than Infinity", !isFinite(PHYS.muStokes(6871, r, 0)));
// halving the radius quarters the terminal velocity
near("velocity scales with r squared", PHYS.vStokes(6871, r/2, mu1)/PHYS.vStokes(6871, r, mu1), 0.25, 1e-12);

/* ------------------------------------------------------------------ */
S("Suite 3  Reynolds number and validity classification");
let Re1 = PHYS.reynolds(868, v1, r, mu1);
near("15W-40 Reynolds number", Re1, 4.05, 0.15);
let Re2 = PHYS.reynolds(844, v2, r, mu2);
near("ATF Reynolds number", Re2, 21.9, 0.6);
ok("15W-40 classified MARGINAL", PHYS.stokesClass(Re1).label === "MARGINAL", "Re=" + Re1.toFixed(2));
ok("ATF classified INVALID", PHYS.stokesClass(Re2).label === "INVALID", "Re=" + Re2.toFixed(2));
ok("Re 0.05 is VALID", PHYS.stokesClass(0.05).label === "VALID");
ok("Re 0.5 is lowercase valid", PHYS.stokesClass(0.5).label === "valid");
ok("boundary Re=0.1 leaves VALID", PHYS.stokesClass(0.1).label === "valid");
ok("boundary Re=1 becomes MARGINAL", PHYS.stokesClass(1.0).label === "MARGINAL");
ok("boundary Re=10 becomes INVALID", PHYS.stokesClass(10).label === "INVALID");
ok("NaN Re does not claim validity", PHYS.stokesClass(NaN).label === "--");
ok("invalid tone is bad", PHYS.stokesClass(50).tone === "bad");
ok("marginal tone is warn", PHYS.stokesClass(4).tone === "warn");
// a 2.3 mm BB in the same oil should be in the valid regime
let vBB = PHYS.vStokes(RHO_S-868, 0.00115, mu1);
let ReBB = PHYS.reynolds(868, vBB, 0.00115, mu1);
ok("2.3 mm BB in 15W-40 falls inside the Stokes regime", ReBB < 0.1, "Re=" + ReBB.toExponential(2));

/* ------------------------------------------------------------------ */
S("Suite 4  unit conversions");
near("1 Pa.s is 1000 cP", PHYS.PasToCp(1), 1000, 0);
near("1282.6 cP is 1.2826 Pa.s", PHYS.cpToPas(1282.6), 1.2826, 1e-12);
near("cP to cSt for 15W-40", PHYS.cpToCst(1282.6, 0.868), 1477.6, 0.5, "cSt");
near("cSt back to cP", PHYS.cstToCp(PHYS.cpToCst(1282.6, 0.868), 0.868), 1282.6, 1e-9);
near("kg/m3 to g/cm3", PHYS.kgm3_to_gcm3(868), 0.868, 1e-12);
ok("cSt needs a density", !isFinite(PHYS.cpToCst(100, 0)));
// water sanity: 1 cP at 1 g/cm3 is 1 cSt
near("water, 1 cP at 1 g/cm3 is 1 cSt", PHYS.cpToCst(1, 1), 1, 1e-12);

/* ------------------------------------------------------------------ */
S("Suite 5  Saybolt conversion");
near("SUS 50 on the low branch", PHYS.sayboltToCst(50), 0.226*50 - 195/50, 1e-12, "cSt");
near("SUS 200 on the high branch", PHYS.sayboltToCst(200), 0.220*200 - 135/200, 1e-12, "cSt");
near("the two branches agree at SUS 100", PHYS.sayboltToCst(100), 20.65, 1e-9, "cSt");
near("low branch evaluated at 100 also gives 20.65", 0.226*100 - 195/100, 20.65, 1e-9);
ok("branch label below 32", PHYS.sayboltBranch(20) === "below");
ok("branch label 32 to 100", PHYS.sayboltBranch(60) === "low");
ok("branch label above 100", PHYS.sayboltBranch(250) === "high");
ok("SUS 32 is the floor of the stated range", PHYS.sayboltBranch(31.9) === "below" && PHYS.sayboltBranch(32) === "low");
// inverse round trips
[40, 60, 99, 100, 150, 500, 2000].forEach(function(s){
  const back = PHYS.cstToSaybolt(PHYS.sayboltToCst(s));
  near("SUS round trip at " + s, back, s, 1e-6);
});
ok("inverse picks the low branch below 20.65 cSt", PHYS.cstToSaybolt(10) < 100);
ok("inverse picks the high branch above 20.65 cSt", PHYS.cstToSaybolt(50) > 100);
// a 60 SUS reading in a 0.868 g/cm3 oil
const cst60 = PHYS.sayboltToCst(60);
near("60 SUS gives cSt", cst60, 10.31, 0.01);
near("and cP after density", PHYS.cstToCp(cst60, 0.868), 8.95, 0.02);

/* ------------------------------------------------------------------ */
S("Suite 6  wall correction");
const beta = 12.70 / 25.4;                    // sphere in a 1 inch tube
near("beta for a 1 inch tube", beta, 0.5, 1e-12);
const K = PHYS.wallFactor(beta);
ok("correction factor lies between 0 and 1", K > 0 && K < 1, "K=" + K.toFixed(4));
ok("corrected velocity exceeds the measured velocity", PHYS.velocityCorrected(0.4709, beta) > 0.4709);
ok("a corrected velocity lowers the computed viscosity",
   PHYS.muStokes(6871, r, PHYS.velocityCorrected(0.4709, beta)) < PHYS.muStokes(6871, r, 0.4709));
ok("a very wide tube leaves the result nearly unchanged",
   Math.abs(PHYS.wallFactor(0.001) - 1) < 0.003);
ok("beta of 1 or more is rejected", !isFinite(PHYS.wallFactor(1)) && !isFinite(PHYS.wallFactor(1.5)));
ok("beta of zero is rejected", !isFinite(PHYS.wallFactor(0)));

/* ------------------------------------------------------------------ */
S("Suite 6b  rotating cylinder, Searle geometry");
near("60 rev/min is 2pi rad/s", PHYS.omega(60), 2*Math.PI, 1e-12, "rad/s");
near("0 rev/min is stationary", PHYS.omega(0), 0, 0);
const wR = PHYS.omega(60), Ri = 0.010, Ro = 0.040, Hm = 0.060;
const gam = PHYS.couetteShearRate(wR, Ri, Ro);
near("shear rate for a 10 mm rotor in a 40 mm beaker", gam, 2*wR*Ro*Ro/(Ro*Ro-Ri*Ri), 1e-12, "1/s");
ok("shear rate exceeds 2 omega in any real gap", gam > 2*wR, gam.toFixed(3) + " vs " + (2*wR).toFixed(3));
ok("a very wide beaker approaches the 2 omega limit",
   Math.abs(PHYS.couetteShearRate(wR, 0.0005, 0.20) - 2*wR) < 1e-3);
ok("a beaker no larger than the rotor is rejected",
   !isFinite(PHYS.couetteShearRate(wR, 0.02, 0.02)) && !isFinite(PHYS.couetteShearRate(wR, 0.02, 0.01)));
const Mt = PHYS.couetteTorque(0.265, wR, Hm, Ri, Ro);
ok("torque is a plausible bench magnitude", Mt > 1e-6 && Mt < 1e-2, Mt.toExponential(3) + " N.m");
near("torque is linear in viscosity", PHYS.couetteTorque(0.530, wR, Hm, Ri, Ro), 2*Mt, 1e-12);
near("torque is linear in immersed height", PHYS.couetteTorque(0.265, wR, 2*Hm, Ri, Ro), 2*Mt, 1e-12);
near("torque is linear in speed", PHYS.couetteTorque(0.265, PHYS.omega(120), Hm, Ri, Ro), 2*Mt, 1e-12);
/* the closure test: stress divided by shear rate must return the viscosity */
const tau = PHYS.couetteStress(Mt, Ri, Hm);
near("stress over shear rate recovers the viscosity", tau/gam, 0.265, 1e-9, "Pa.s");
ok("zero viscosity gives no torque", !isFinite(PHYS.couetteTorque(0, wR, Hm, Ri, Ro)));
ok("a rotor of no height gives no torque", !isFinite(PHYS.couetteTorque(0.265, wR, 0, Ri, Ro)));

/* ------------------------------------------------------------------ */
S("Suite 6c  ASTM D341 viscosity-temperature model");
/* build synthetic data from a known A and B, then recover them */
const A0d = 9.5, B0d = 3.6;
function nuFrom(A,B,TC){
  const y = A - B*Math.log10(TC+273.15);
  return Math.pow(10, Math.pow(10,y)) - 0.7;
}
const dT = [20,40,60,80], dNu = dT.map(t => nuFrom(A0d,B0d,t));
ok("the synthetic curve is decreasing and in a sensible range",
   dNu[0] > dNu[3] && dNu[3] > 1, dNu.map(x=>x.toFixed(1)).join(", ") + " cSt");
const wf = PHYS.waltherFit(dT, dNu);
near("D341 recovers A", wf.A, A0d, 1e-6);
near("D341 recovers B", wf.B, B0d, 1e-6);
near("D341 fit is exact on synthetic data", wf.r2, 1, 1e-9);
near("evaluating the fit returns the input", PHYS.waltherAt(wf, 40), dNu[1], 1e-6, "cSt");
ok("interpolation lies between the bracketing points",
   PHYS.waltherAt(wf,30) < dNu[0] && PHYS.waltherAt(wf,30) > dNu[1]);
ok("viscosity always falls as temperature rises", PHYS.waltherAt(wf,80) < PHYS.waltherAt(wf,20));
ok("a single point cannot be fitted", PHYS.waltherFit([40],[50]) === null);
ok("nonpositive viscosity is rejected", PHYS.waltherFit([20,40],[0,-3]) === null);
/* the two lab fluids: a fit through a plausible sweep must pass back through it */
const rvT = [20,30,40,50,60], rvNu = [600,330,190,120,80];
const wf2 = PHYS.waltherFit(rvT, rvNu);
ok("a fit through a rotary sweep tracks the data",
   Math.abs(PHYS.waltherAt(wf2,40) - 190)/190 < 0.05,
   PHYS.waltherAt(wf2,40).toFixed(1) + " against 190 cSt");
ok("the fit reports its quality", wf2.r2 > 0.99, "R2 = " + wf2.r2.toFixed(5));
ok("water published pairs fit", !!PHYS.waltherFit(
   fluidById("water").tempPts.map(p=>p[0]), fluidById("water").tempPts.map(p=>p[1])));

/* the chain that makes the Saybolt temperature curve: nu -> SUS */
const nu50 = PHYS.waltherAt(wf2, 50);
const sus50 = PHYS.cstToSaybolt(nu50);
near("the fitted viscosity converts back through the Saybolt correlation",
     PHYS.sayboltToCst(sus50), nu50, 1e-6, "cSt");
ok("a hot sample gives a shorter Saybolt time than a cold one",
   PHYS.cstToSaybolt(PHYS.waltherAt(wf2,60)) < PHYS.cstToSaybolt(PHYS.waltherAt(wf2,20)));

/* ------------------------------------------------------------------ */
S("Suite 7  curve fitting");
const lf = PHYS.linfit([1,2,3,4],[3,5,7,9]);       // y = 2x + 1
near("linear slope", lf.m, 2, 1e-12);
near("linear intercept", lf.b, 1, 1e-12);
near("perfect fit gives R2 of 1", lf.r2, 1, 1e-12);
ok("a single point cannot be fitted", PHYS.linfit([1],[1]) === null);
ok("a vertical set cannot be fitted", PHYS.linfit([2,2,2],[1,2,3]) === null);
// Andrade round trip: build data from a known A and B
const A0 = 1e-5, B0 = 3000;
const temps = [20,30,40,50,60];
const mus = temps.map(function(t){ return A0*Math.exp(B0/(t+273.15)); });
const af = PHYS.andradeFit(temps, mus);
near("Andrade recovers A", af.A, A0, A0*1e-6);
near("Andrade recovers B", af.B, B0, 1e-6);
near("Andrade R2 is 1 on synthetic data", af.r2, 1, 1e-9);
near("Andrade evaluates back to the input", PHYS.andradeAt(af, 40), mus[2], 1e-9);
ok("Andrade rejects nonpositive viscosity", PHYS.andradeFit([20,30],[0,-1]) === null);
ok("Andrade predicts falling viscosity with rising temperature",
   PHYS.andradeAt(af, 60) < PHYS.andradeAt(af, 20));

/* ------------------------------------------------------------------ */
S("Suite 8  fluid library");
ok("library has 15 fluids", FLUIDS.length === 15);
ok("water is present as the reference point", !!fluidById("water").tempPts);
ok("a non-Newtonian fluid is present and carries no viscosity",
   FLUIDS.some(f => f.nonNewtonian && f.mu === null));
ok("ISO grades are present for hydraulic oil",
   ["iso32","iso46","iso150"].every(id => fluidById(id).cat === "Hydraulic Fluids"));
/* an ISO grade is defined by its kinematic viscosity at 40 C, so check the entry
   reproduces the grade number it is named after */
[["iso32",32],["iso46",46],["iso150",150]].forEach(function(g){
  const f = fluidById(g[0]);
  const cSt = PHYS.cpToCst(PHYS.PasToCp(f.mu), f.rho/1000);
  near("ISO VG " + g[1] + " reproduces its grade number at 40 C", cSt, g[1], g[1]*0.05, "cSt");
  ok("ISO VG " + g[1] + " is referenced to 40 C", f.refT === 40);
});
ok("two fluids are flagged as laboratory fluids", FLUIDS.filter(f => f.lab).length === 2);
ok("15W-40 carries the reference density", fluidById("15w40").rho === 868);
ok("15W-40 carries a published reference viscosity, not the invalid Stokes result",
   fluidById("15w40").mu === 0.261 && fluidById("15w40").refT === 20);
ok("15W-40 carries grade-sheet temperature pairs for the D341 fit",
   fluidById("15w40").tempPts && fluidById("15w40").tempPts.length >= 2);
ok("15W-40 carries the class fall time", fluidById("15w40").t_measured === 1.89);
ok("ATF carries its reference values", fluidById("dexron").rho === 844 && fluidById("dexron").mu === 0.072);
ok("ATF carries grade-sheet temperature pairs for the D341 fit",
   fluidById("dexron").tempPts && fluidById("dexron").tempPts.length >= 2);
ok("neither bench fluid uses its own Stokes result as a reference",
   fluidById("15w40").mu !== 1.2826 && fluidById("dexron").mu !== 0.5448);
ok("ATF carries the class fall time", fluidById("dexron").t_measured === 0.80);
ok("every Newtonian fluid has a density, a viscosity, a colour and a category",
   FLUIDS.filter(f => !f.nonNewtonian).every(f => f.rho > 0 && f.mu > 0 && /^#/.test(f.color) && f.cat));
ok("the non-Newtonian entry still has a density and a category, but no viscosity",
   FLUIDS.filter(f => f.nonNewtonian).every(f => f.rho > 0 && f.mu === null && f.cat));
ok("all ids are unique", new Set(FLUIDS.map(f => f.id)).size === FLUIDS.length);
ok("unknown id falls back rather than throwing", fluidById("nope") === FLUIDS[0]);
// each library fluid, evaluated with the lab ball, produces a finite classification
ok("every Newtonian library fluid classifies without error", FLUIDS.filter(f=>!f.nonNewtonian).every(function(f){
  const v = PHYS.vStokes(7739 - f.rho, r, f.mu);
  const Re = PHYS.reynolds(f.rho, v, r, f.mu);
  return typeof PHYS.stokesClass(Re).label === "string";
}));
// honey should be firmly valid, gasoline firmly invalid
const honey = fluidById("honey"), gas = fluidById("gasoline");
const ReHoney = PHYS.reynolds(honey.rho, PHYS.vStokes(7739-honey.rho, r, honey.mu), r, honey.mu);
ok("honey is the only library fluid inside the Stokes regime with the lab ball",
   PHYS.stokesClass(ReHoney).label === "valid", "Re=" + ReHoney.toFixed(3));
ok("no bench oil is classified VALID with the 12.70 mm ball, which is the lesson",
   FLUIDS.filter(f=>!f.nonNewtonian && f.mu>0.1).every(function(f){
     const v = PHYS.vStokes(7739 - f.rho, r, f.mu);
     return PHYS.stokesClass(PHYS.reynolds(f.rho, v, r, f.mu)).label !== "VALID";
   }));
ok("gasoline is far outside it",
   PHYS.stokesClass(PHYS.reynolds(gas.rho, PHYS.vStokes(7739-gas.rho, r, gas.mu), r, gas.mu)).label === "INVALID");

/* ------------------------------------------------------------------ */
S("Suite 9  file integrity and wiring");
ok("no external script or stylesheet is referenced",
   !/<script[^>]+src=/i.test(HTML) && !/<link[^>]+stylesheet/i.test(HTML));
ok("no http or https request appears in code",
   !/(fetch|XMLHttpRequest|import\s*\()/.test(HTML));
ok("single html file, one script block", (HTML.match(/<script/g)||[]).length === 1);
/* every localStorage reference must sit inside the guarded STORE closure, so a
   browser that throws on storage access cannot break the rest of the tool */
const storeStart = HTML.indexOf("var STORE = (function(){");
const storeEnd   = HTML.indexOf("var SKEY", storeStart);
const lsHits = [];
{ const re = /localStorage/g; let m2; while((m2 = re.exec(HTML)) !== null) lsHits.push(m2.index); }
ok("localStorage is only reached inside the guarded store",
   storeStart > -1 && lsHits.length > 0 && lsHits.every(i2 => i2 > storeStart && i2 < storeEnd),
   lsHits.length + " references, all inside the closure");
ok("the store probes storage in a try block before using it",
   /try\s*\{[^}]*localStorage\.setItem/.test(HTML));
ok("a memory fallback exists for browsers that block storage",
   /persistent:\s*ok/.test(HTML) && /mem\[k\]/.test(HTML));
ok("charset is declared before any content", HTML.indexOf("charset") < HTML.indexOf("<title>"));
ok("viewport meta present for tablet use", /name="viewport"/.test(HTML));
ok("print stylesheet present", /@media print/.test(HTML));
ok("physics block is marked for extraction",
   HTML.indexOf("PHYSICS-START") > -1 && HTML.lastIndexOf("/* PHYSICS-END") > -1);
ok("physics block contains no DOM access",
   !/\bdocument\.|window\.|getElementById/.test(body));

/* every getElementById target must exist as an id in the markup */
const markup = HTML.slice(0, HTML.indexOf("<script>"));
const wanted = new Set();
const reId = /\$\("([a-zA-Z0-9_-]+)"\)/g;
let mm;
while((mm = reId.exec(HTML)) !== null) wanted.add(mm[1]);
const built = new Set(["fb-cardA","fb-cardB","sb-cardA","sb-cardB"]);
// ids created at runtime by the card builders
["A","B"].forEach(function(k){
  ["fb-out","fb-work","fb-flag","sb-out","sb-work","sb-flag","fb-fluid","fb-m","fb-v","fb-T","sb-T","sb-S"]
    .forEach(function(p){ built.add(p+k); });
});
const missing = [];
wanted.forEach(function(id){
  if(built.has(id)) return;
  if(markup.indexOf('id="'+id+'"') < 0) missing.push(id);
});
ok("every element referenced by id exists in the markup", missing.length === 0,
   missing.length ? "missing: " + missing.join(", ") : "checked " + wanted.size + " ids");

/* every tab button points at a panel that exists */
const tabIds = [...HTML.matchAll(/aria-controls="([a-z-]+)"/g)].map(m => m[1]);
ok("every tab controls a real panel",
   tabIds.length === 8 && tabIds.every(id => markup.indexOf('id="'+id+'"') > -1),
   tabIds.join(" "));

/* the laboratory objectives from the procedure are present verbatim in substance */
["falling ball viscometer", "Saybolt viscometer", "rotary viscometer"].forEach(function(t){
  ok("objectives mention the " + t, HTML.toLowerCase().indexOf(t.toLowerCase()) > -1);
});
ok("both Saybolt equations appear in the formula reference",
   HTML.indexOf("0.226 SUS") > -1 && HTML.indexOf("0.220 SUS") > -1);
ok("the dynamic versus kinematic warning is present", HTML.indexOf("DYNAMIC &ne; KINEMATIC") > -1);
ok("the invalid-model wording required by the brief is present",
   HTML.indexOf("STOKES' LAW: INVALID FOR THESE CONDITIONS") > -1);

/* the browser script must at least parse */
const script = HTML.slice(HTML.indexOf("<script>")+8, HTML.lastIndexOf("</script>"));
let parsed = true, perr = "";
try { new Function(script); } catch(e){ parsed = false; perr = e.message; }
ok("the full browser script parses without a syntax error", parsed, perr);

/* ------------------------------------------------------------------ */
console.log("\n==========================================");
console.log("  " + (pass + fail) + " checks   " + pass + " passed   " + fail + " failed");
console.log("==========================================");
process.exit(fail ? 1 : 0);
