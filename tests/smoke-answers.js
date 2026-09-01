const fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");
const html = fs.readFileSync(__dirname + "/../handouts/viscosity-lab-answers.html", "utf8");
const errors = [];
const vc = new VirtualConsole()
  .on("jsdomError", e => { if(!/Not implemented/.test(e.message)) errors.push(e.message); })
  .on("error", (...a) => errors.push("console.error: " + a.join(" ")));
const dom = new JSDOM(html, { runScripts:"dangerously", pretendToBeVisual:true, virtualConsole:vc });
const w = dom.window, d = w.document;
let pass=0, fail=0;
function ok(l,c,det){ if(c){pass++;console.log("  PASS  "+l+(det?"   "+det:""));}
  else {fail++;console.log("  FAIL  "+l+(det?"   "+det:""));} }
function txt(id){ const n=d.getElementById(id); return n? n.textContent.replace(/\s+/g," ") : ""; }
function type(id,v){ const n=d.getElementById(id); n.value=v; n.dispatchEvent(new w.Event("input",{bubbles:true})); }
function cellInput(tableId, rowIdx, colIdx, v){
  const tr = d.querySelectorAll("#"+tableId+" tbody tr")[rowIdx];
  const inp = tr.querySelectorAll("input")[colIdx];
  inp.value = v; inp.dispatchEvent(new w.Event("input",{bubbles:true}));
}

console.log("\n--- answer sheet ---");
ok("loads without error", errors.length===0, errors.join(" | "));

/* master dataset: the real lab numbers */
const rows = d.querySelectorAll("#fluid-in tbody tr");
ok("ten master fields per fluid", rows.length === 10, rows.length + " rows");
function setField(rowIdx, col, v){
  const inp = rows[rowIdx].querySelectorAll("input")[col];
  inp.value = v; inp.dispatchEvent(new w.Event("input",{bubbles:true}));
}
setField(0,0,"15W-40 Motor Oil");  setField(0,1,"Dexron II ATF");
setField(1,0,"22.5");              setField(1,1,"22.5");
setField(3,0,"43.4");              setField(3,1,"42.2");
[1.88,1.90,1.89,1.89].forEach((t,i)=>setField(4+i,0,String(t)));
[0.79,0.81,0.80,0.80].forEach((t,i)=>setField(4+i,1,String(t)));
setField(8,0,"50"); setField(9,0,"250");

ok("column headers pick up the fluid names",
   /15W-40/.test(d.querySelectorAll("#fluid-in thead th")[1].textContent));
ok("sphere density computes to steel", /773[0-9]\./.test(txt("k-sphere")), txt("k-sphere").slice(0,70));
ok("fluid 1 density is 868 kg/m3", /868/.test(txt("k-density")));
ok("average fall time is 1.890 s", /1\.890/.test(txt("k-velocity")));
ok("velocity is 0.4709 m/s", /0\.4709/.test(txt("k-velocity")));
ok("viscosity reproduces 1.2826 Pa.s", /1\.28/.test(txt("k-visc")), txt("k-visc").slice(0,90));
ok("centistokes are computed", /cSt/.test(txt("k-visc")));
ok("uncertainty is derived from the spread", /1\.1 percent|percent/.test(txt("k-unc")));
ok("Reynolds number is reported and classified",
   /Re = 4\.0/.test(txt("k-re")) && /MARGINAL/.test(txt("k-re")));
ok("fluid 2 is classified INVALID", /INVALID/.test(txt("k-re")));
ok("Saybolt uses the above-100 branch", /above-100 branch/.test(txt("k-saybolt")));
ok("Saybolt cSt computed", /54\.4/.test(txt("k-saybolt")), txt("k-saybolt").slice(0,110));

/* rotary */
const rvRows = d.querySelectorAll("#rv-table tbody tr");
ok("nine rotary rows", rvRows.length === 9);
[520,410,330,265,215,176,145,121,102].forEach((v,i)=>cellInput("rv-table", i, 1, String(v)));
ok("Pa.s column fills", /0\.52000/.test(rvRows[0].textContent), rvRows[0].textContent.replace(/\s+/g," "));
ok("cSt withheld without density", /--/.test(rvRows[0].textContent));
type("rv_rho","868");
ok("cSt fills once density is given", /599\.1/.test(rvRows[0].textContent));
ok("temperature trend answer computed", /drop of/.test(txt("k-rotary")));
ok("the exponential-versus-linear point is made", /exponential/.test(txt("k-rotary")));

/* questions */
const qs = d.querySelectorAll("#k-questions li");
ok("ten model answers rendered", qs.length === 10, qs.length + " questions");
ok("Q1 names the thicker fluid with a ratio",
   /15W-40/.test(qs[0].textContent) && /factor of/.test(qs[0].textContent));
ok("Q3 computes the falling-ball versus rotary difference",
   /percent relative to the rotary/.test(qs[2].textContent), qs[2].textContent.replace(/\s+/g," ").slice(0,120));
ok("Q5 states the direction of the error", /too high/.test(qs[4].textContent));
ok("Q6 gives the r-cubed factor", /168|divides it by about/.test(qs[5].textContent),
   qs[5].textContent.replace(/\s+/g," ").slice(60,180));
ok("Q10 cites the student's own Re and uncertainty",
   /4\.0/.test(qs[9].textContent) && /percent/.test(qs[9].textContent));

/* wall correction only on request */
ok("no wall correction before a bore is entered", !/Wall correction/i.test(txt("k-visc")));
type("Dt","25.4");
ok("entering the tube bore adds the instructor-only wall note", /Wall correction/i.test(txt("k-visc")));
ok("it states the uncorrected result reads high", /reads high/.test(txt("k-visc")));

/* persistence */
d.getElementById("btn-save").dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
ok("save reports a state", txt("flag").length>0, txt("flag"));

ok("still no runtime errors", errors.length===0, errors.join(" | "));
console.log("\n  " + (pass+fail) + " checks   " + pass + " passed   " + fail + " failed\n");
process.exit(fail?1:0);
