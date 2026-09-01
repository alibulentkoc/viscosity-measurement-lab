const fs=require("fs");
const {JSDOM,VirtualConsole}=require("jsdom");
const html=fs.readFileSync(__dirname+"/../handouts/viscosity-lab-grader.html","utf8");
const errors=[];
const vc=new VirtualConsole()
  .on("jsdomError",e=>{ if(!/Not implemented/.test(e.message)) errors.push(e.message); })
  .on("error",(...a)=>errors.push("console.error: "+a.join(" ")));
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,virtualConsole:vc});
const w=dom.window,d=w.document;
let pass=0,fail=0;
function ok(l,c,det){ if(c){pass++;console.log("  PASS  "+l+(det?"   "+det:""));}
  else{fail++;console.log("  FAIL  "+l+(det?"   "+det:""));} }
function txt(id){ const n=d.getElementById(id); return n? n.textContent.replace(/\s+/g," "):""; }
function setCell(key, which, v){
  const tr=d.querySelector('#audit tr[data-k="'+key+'"]');
  const inp=tr.querySelector("input."+which);
  inp.value=v; inp.dispatchEvent(new w.Event("input",{bubbles:true}));
}
function rowText(key){ return d.querySelector('#audit tr[data-k="'+key+'"]').textContent.replace(/\s+/g," "); }
function dualRow(i){ return d.querySelectorAll("#dual tbody tr")[i].textContent.replace(/\s+/g," "); }

console.log("\n--- grading tool ---");
ok("loads without error", errors.length===0, errors.join(" | "));
ok("eleven audited measurements", d.querySelectorAll("#audit tbody tr").length===11);
ok("eighteen dual-computed answers", d.querySelectorAll("#dual tbody tr").length===18);
ok("bench master values ship pre-filled",
   d.querySelector('#audit tr[data-k="d_sph"] input.m').value==="12.70");

/* master: the real bench dataset */
const master={m_sph:"8.3",d_sph:"12.70",L:"0.89",mass1:"43.4",temp1:"22.5",t1:"1.89",
              mass2:"42.2",temp2:"22.5",t2:"0.80",sus1:"250",sus2:"120"};
Object.keys(master).forEach(k=>setCell(k,"m",master[k]));

console.log("\n--- audit: a group that measures well ---");
Object.keys(master).forEach(k=>setCell(k,"r",master[k]));
ok("identical values read as within tolerance", /within/.test(rowText("d_sph")));
ok("exact agreement on every reading is flagged as implausible",
   /MATCH THE MASTER EXACTLY/.test(txt("audit-flags")));

console.log("\n--- audit: a mismeasured sphere diameter ---");
setCell("d_sph","r","12.40"); setCell("t1","r","1.87"); setCell("mass1","r","43.3");
ok("a 0.30 mm error is 6x tolerance", /6\.00\u00D7|6\.00x/.test(rowText("d_sph")), rowText("d_sph"));
ok("verdict reads REMEASURE", /REMEASURE/.test(rowText("d_sph")));
ok("the copied-data warning persists while 8 of 11 still match exactly",
   /8 of 11 readings agree/.test(txt("audit-flags")));
ok("the out-of-tolerance flag names the measurement",
   /Sphere diameter is off/.test(txt("audit-flags")), txt("audit-flags").slice(0,90));
ok("small time and mass errors stay within tolerance",
   /within/.test(rowText("t1")) && /within/.test(rowText("mass1")));
["mass2","temp1","temp2","sus1","t2"].forEach(function(k,i){
  setCell(k,"r", String(parseFloat(master[k]) + [0.3,0.4,-0.5,3,0.02][i]));
});
ok("the copied-data warning clears once most readings differ",
   !/MATCH THE MASTER EXACTLY/.test(txt("audit-flags")), txt("audit-flags").slice(0,60));
["mass2","temp1","temp2","sus1","t2"].forEach(k=>setCell(k,"r",master[k]));

console.log("\n--- dual computation ---");
const volRow=dualRow(0), rhoSRow=dualRow(1);
ok("sphere volume differs between master and reported", /1\.0725e-6/.test(volRow) && /9\.98/.test(volRow),
   volRow);
ok("sphere density knock-on is shown as a percentage",
   /\+7\.[0-9] %|\+7 %/.test(rhoSRow), rhoSRow);
ok("fluid 1 viscosity computed from both columns", /1\.28/.test(dualRow(4)), dualRow(4));
ok("Reynolds row carries both validity labels",
   /MARGINAL/.test(dualRow(7)), dualRow(7));
ok("Saybolt rows compute", /54\.4/.test(dualRow(14)), dualRow(14));

console.log("\n--- automatic checks ---");
ok("the Section 5.6 reminder fires on this bench",
   /SECTION 5.6 MUST BE ADDRESSED/.test(txt("auto")));
ok("it names the direction of the error", /reads high/.test(txt("auto")));

/* a sphere density that is not steel */
setCell("m_sph","r","83"); 
ok("an impossible sphere density is caught",
   /NOT STEEL/.test(txt("auto")), txt("auto").slice(0,80));
setCell("m_sph","r","8.3"); setCell("d_sph","r","12.70");

/* a fluid denser than the sphere */
setCell("mass1","r","400");
ok("a fluid that would float the sphere is caught", /WOULD FLOAT THE SPHERE/.test(txt("auto")));
ok("a fluid denser than water is also flagged", /DENSER THAN WATER/.test(txt("auto")));
setCell("mass1","r","43.4");

/* Saybolt below the floor */
setCell("sus1","r","20");
ok("a Saybolt reading below 32 s is caught", /BELOW 32 s/.test(txt("auto")));
setCell("sus1","r","250");

/* arithmetic-only divergence cannot be produced through the audited inputs,
   so confirm the clean state instead */
Object.keys(master).forEach(k=>setCell(k,"r",master[k]));
setCell("t1","r","1.88");
ok("with everything in tolerance only the validity reminder remains",
   !/REMEASURE|NOT STEEL|FLOAT|DENSER/.test(txt("auto")), txt("auto").slice(0,70));

console.log("\n--- scoring ---");
const sInputs=d.querySelectorAll("#score tbody input");
ok("seven score lines", sInputs.length===7);
[22,18,8,15,9,10,8].forEach((v,i)=>{ sInputs[i].value=String(v);
  sInputs[i].dispatchEvent(new w.Event("input",{bubbles:true})); });
ok("total sums to 90 of 100", /90\.0 \/ 100/.test(txt("total")), txt("total"));
ok("a suggested comment is generated", txt("autocomment").length>10, txt("autocomment").slice(0,70));

d.getElementById("btn-save").dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
ok("save reports a state", txt("flag").length>0, txt("flag"));
ok("no runtime errors across the whole run", errors.length===0, errors.join(" | "));

console.log("\n  "+(pass+fail)+" checks   "+pass+" passed   "+fail+" failed\n");
process.exit(fail?1:0);
