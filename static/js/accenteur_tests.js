let counter = (success = failed = 0);

const tests = [
  { input: "abiuro", output: Array("abiúro") },
  { input: "adisse", output: Array("adísse") },
  { input: "adiuva", output: Array("ádiuva") },
  { input: "adjuvo", output: Array("ádjuvo") },
  { input: "Aegyptum", output: Array("Ægýptum") },
  { input: "Ægyptum", output: Array("Ægýptum") },
  { input: "aerem", output: Array("áerem", "ærem") },
  { input: "ærem", output: Array("ærem") },
  { input: "aereum", output: Array("ǽreum", "aéreum") },
  { input: "æreum", output: Array("ǽreum") },
  { input: "aeris", output: Array("áeris", "æris") },
  { input: "æris", output: Array("æris") },
  { input: "aerius", output: Array("aérius") },
  { input: "aero", output: Array("æro") },
  { input: "æternæ", output: Array("ætérnæ") },
  { input: "alleluia", output: Array("allelúia") },
  { input: "Alleluia", output: Array("Allelúia") },
  { input: "alligat", output: Array("álligat") },
  { input: "amasti", output: Array("amásti") },
  { input: "Ambrosi", output: Array("Ambrósi") },
  { input: "attende", output: Array("atténde") },
  { input: "audierunt", output: Array("audiérunt") },
  { input: "audisset", output: Array("audísset") },
  { input: "audisti", output: Array("audísti") },
  { input: "auferas", output: Array("áuferas") },
  { input: "autem", output: Array("autem") },
  { input: "benedic", output: Array("bénedic") },
  { input: "benefac", output: Array("bénefac") },
  { input: "Boetius", output: Array("Boétius") },
  { input: "caelestis", output: Array("cæléstis") },
  { input: "cælestis", output: Array("cæléstis") },
  { input: "coelestis", output: Array("cœléstis") },
  { input: "cœlestis", output: Array("cœléstis") },
  { input: "coeperit", output: Array("cœ́perit") },
  { input: "coepit", output: Array("cœpit") },
  { input: "collaudet", output: Array("colláudet") },
  { input: "conplevit", output: Array("conplévit") },
  { input: "convenissent", output: Array("conveníssent") },
  { input: "cordibus", output: Array("córdibus") },
  { input: "cordium", output: Array("córdium") },
  { input: "degusto", output: Array("degústo") },
  { input: "delesti", output: Array("delésti") },
  { input: "Dicitque", output: Array("Dicítque") },
  { input: "disiunctus", output: Array("disiúnctus") },
  { input: "Ergone", output: Array("Ergóne") },
  { input: "eumdem", output: Array("eúmdem") },
  { input: "eunuchus", output: Array("eunúchus") },
  { input: "foederis", output: Array("fœdéris", "fœ́deris") },
  { input: "fœderis", output: Array("fœdéris", "fœ́deris") },
  { input: "foenera", output: Array("fœ́nera") },
  { input: "haeccine", output: Array("hǽccine") },
  { input: "hæccine", output: Array("hǽccine") },
  { input: "hæreo", output: Array("hǽreo") },
  { input: "holocaustum", output: Array("holocáustum") },
  { input: "Iacob", output: Array("Iacob") },
  { input: "iecit", output: Array("iecit") },
  { input: "Iesus", output: Array("Iesus") },
  { input: "Ignati", output: Array("Ignáti") },
  { input: "iniunctus", output: Array("iniúnctus") },
  { input: "interventione", output: Array("interventióne") },
  { input: "introduc", output: Array("intróduc") },
  { input: "Ioseph", output: Array("Ioseph") },
  { input: "iota", output: Array("iota") },
  { input: "Israel", output: Array("Israel") },
  { input: "Israeli", output: Array("Israéli") },
  { input: "Israelita", output: Array("Israelíta") },
  { input: "Iuda", output: Array("Iuda") },
  { input: "laudarunt", output: Array("laudárunt") },
  { input: "Maria", output: Array("Mária", "María") },
  { input: "Mariae", output: Array("Máriæ", "Maríæ") },
  { input: "Mariæ", output: Array("Máriæ", "Maríæ") },
  { input: "nemo", output: Array("nemo") },
  { input: "neminem", output: Array("néminem") },
  { input: "objuro", output: Array("objúro") },
  { input: "periurus", output: Array("periúrus") },
  { input: "praedam", output: Array("prædam") },
  { input: "quaedam", output: Array("quædam") },
  { input: "qualisve", output: Array("qualísve") },
  { input: "saeculorum", output: Array("sæculórum") },
  { input: "saeculum", output: Array("sǽculum") },
  { input: "sæculum", output: Array("sǽculum") },
  { input: "sanguinem", output: Array("sánguinem") },
  { input: "sequemurque", output: Array("sequemúrque") },
  { input: "sermone", output: Array("sermóne") },
  { input: "subiectum", output: Array("subiéctum") },
  { input: "tenebrae", output: Array("ténebræ") },
  { input: "tenebræ", output: Array("ténebræ") },
];

for (const test of tests) {
  counter = counter + 1;
  const result = accentify(test["input"]).toString();
  const expected = test["output"].toString();

  if (result == expected) {
    console.log(`"${test["input"]}" => "${result}": Success ✅`);
    success = success + 1;
  } else {
    console.log(
      `"${test["input"]}" => "${result}": Error ❌ (expected: ${expected})`,
    );
    failed = failed + 1;
  }
}

console.log(
  `${counter} words tested.
  ${success} success.
  ${failed} failed.`,
);
