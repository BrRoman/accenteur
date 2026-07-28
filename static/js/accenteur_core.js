// This module returns the accented version(s) of a word.

const vowels = ["a", "e", "i", "o", "u", "y", "A", "E", "I", "O", "U", "Y"];
const consonants = [
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "q",
  "r",
  "s",
  "t",
  "v",
  "x",
  "z",
];
const longs = ["ā", "ē", "ī", "ō", "ū", "ȳ", "Ā", "Ē", "Ī", "Ō", "Ū", "Ȳ"];
const breves = ["ă", "ĕ", "ĭ", "ŏ", "ŭ", "ў", "Ă", "Ĕ", "Ĭ", "Ŏ", "Ŭ", "Ў"];
const accented = ["á", "é", "í", "ó", "ú", "ý"];
const uppercase = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "X",
  "Y",
  "Z",
];
const lowercase = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "x",
  "y",
  "z",
];

const PREFIX_CASES = [
  {
    prefix: "acc",
    replaceWith: "adc",
    finalRegex: /^([aāă])dc/g,
    finalReplacement: "$1cc",
  },
  {
    prefix: "aff",
    replaceWith: "adf",
    finalRegex: /^([aāă])df/g,
    finalReplacement: "$1ff",
  },
  {
    prefix: "agg",
    replaceWith: "adg",
    finalRegex: /^([aāă])dg/g,
    finalReplacement: "$1gg",
  },
  {
    prefix: "all",
    replaceWith: "adl",
    finalRegex: /^([aāă])dl/g,
    finalReplacement: "$1ll",
  },
  {
    prefix: "arr",
    replaceWith: "adr",
    finalRegex: /^([aāă])dr/g,
    finalReplacement: "$1rr",
  },
  {
    prefix: "ass",
    replaceWith: "ads",
    finalRegex: /^([aāă])ds/g,
    finalReplacement: "$1ss",
  },
  {
    prefix: "att",
    replaceWith: "adt",
    finalRegex: /^([aāă])dt/g,
    finalReplacement: "$1tt",
  },
  {
    prefix: "ex",
    replaceWith: "exs",
    finalRegex: /^([eēĕ])xs/g,
    finalReplacement: "$1x",
  },
  {
    prefix: "coll",
    replaceWith: "conl",
    finalRegex: /^conl/g,
    finalReplacement: "coll",
  },
  {
    prefix: "con",
    replaceWith: "com",
    finalRegex: /^con/g,
    finalReplacement: "com",
  },
  {
    prefix: "obc",
    replaceWith: "occ",
    finalRegex: /^occ/g,
    finalReplacement: "obc",
  },
];

function accentify(word) {
  const isCapitalized = is_uppercase(word);
  const lowerWord = word.toLowerCase();
  const normalizedWord = isCapitalized ? lowerWord : word;
  let normalizedAll = normalizedWord;
  let found = [...search_quantified(word)];
  let matchedPrefixCase = null;
  let enclitic = "";

  if (isCapitalized) {
    found.push(
      ...search_quantified(normalizedWord).map((s) =>
        s ? to_uppercase(s) : s,
      ),
    );
  }

  for (const {
    prefix,
    replaceWith,
    finalRegex,
    finalReplacement,
  } of PREFIX_CASES) {
    if (lowerWord.startsWith(prefix)) {
      const transformed = normalizedWord.replace(
        new RegExp(`^${prefix}`),
        replaceWith,
      );
      const subFound = search_quantified(transformed);
      matchedPrefixCase = { finalRegex, finalReplacement };
      normalizedAll = normalizedAll.replace(
        new RegExp(`^${prefix}`),
        replaceWith,
      );
      found.push(
        ...subFound.map((s) =>
          s ? s.replace(finalRegex, finalReplacement) : s,
        ),
      );
      break;
    }
  }

  const enclitics = ["que", "ne", "ve", "dam", "quam", "libet"];
  for (const candidate of enclitics) {
    if (word.length > candidate.length && word.endsWith(candidate)) {
      enclitic = candidate;
      const baseAll = normalizedAll.slice(0, -candidate.length);
      const subFound = search_quantified(baseAll);
      found.push(...subFound.map((s) => (s ? last_long(s) + candidate : s)));
      break;
    }
  }

  let newWord = normalizedWord;
  let newWordAll = normalizedAll;
  newWord = newWord
    .replace(/^i([aeiouy])/g, "j$1")
    .replace(/([aeiouy])i([aeiouy])/g, "$1j$2")
    .replace(/^abi/g, "abj")
    .replace(/^adi/g, "adj")
    .replace(/^coni/g, "conj")
    .replace(/^disi/g, "disj")
    .replace(/^ini/g, "inj")
    .replace(/^obi/g, "obj")
    .replace(/^peri/g, "perj")
    .replace(/^subi/g, "subj");

  newWordAll = newWordAll
    .replace(/^i([aeiouy])/g, "j$1")
    .replace(/([aeiouy])i([aeiouy])/g, "$1j$2")
    .replace(/^abi/g, "abj")
    .replace(/^adi/g, "adj")
    .replace(/^coni/g, "conj")
    .replace(/^disi/g, "disj")
    .replace(/^ini/g, "inj")
    .replace(/^obi/g, "obj")
    .replace(/^peri/g, "perj")
    .replace(/^subi/g, "subj");

  let withJ = false;
  if (newWord !== normalizedWord && count_vowels(newWord) > 2) {
    withJ = true;
    found.push(
      ...search_quantified(newWord).map((s) => (s ? s.replace("j", "i") : s)),
    );
  }

  const aeWord = word
    .replace(/æ/g, "ae")
    .replace(/Æ/g, "Ae")
    .replace(/œ/g, "oe");
  newWordAll = newWordAll
    .replace(/æ/g, "ae")
    .replace(/Æ/g, "Ae")
    .replace(/œ/g, "oe");

  let hasAeOe = false;
  if (aeWord !== word) {
    hasAeOe = true;
    found.push(
      ...search_quantified(aeWord).filter((s) => s.indexOf("āĕ") === -1),
    );
  }

  const finalSearch = search_quantified(newWordAll);
  found.push(
    ...finalSearch
      .map((s) => {
        if (!s) return null;
        let result = s;
        if (isCapitalized) {
          result = to_uppercase(result);
        }
        if (matchedPrefixCase) {
          result = result.replace(
            matchedPrefixCase.finalRegex,
            matchedPrefixCase.finalReplacement,
          );
        }
        if (enclitic) {
          result = last_long(result) + enclitic;
        }
        if (withJ) {
          result = result.replace("j", "i");
        }
        if (hasAeOe && result.indexOf("āĕ") !== -1) {
          return null;
        }
        return result;
      })
      .filter(Boolean),
  );

  if (word.includes("cumque")) {
    found.push(word.replace("cumque", "cūmque"));
  }

  if (word.includes("emetips")) {
    found.push(word.replace("emetips", "emetīps"));
  }

  if (word.endsWith("cine")) {
    const plainWord = word.slice(0, -4);
    if (
      plainWord.toLowerCase().startsWith("hae") ||
      plainWord.toLowerCase().startsWith("hæ")
    ) {
      found.push(word.replace(/ae/g, "āe").replace(/æ/g, "āe"));
    } else {
      found.push(last_long(plainWord) + "cine");
    }
  }

  if (word.includes("familias")) {
    found.push(word.replace("familias", "familĭas"));
  }

  if (found.length === 0) {
    if (word.search(/[!?:;]/) === -1 && count_vowels(word) > 2) {
      found.push("<span class='red'>" + word + "</span>");
    } else {
      found.push(word);
    }
  } else {
    found = found.map((candidate) => qty_to_accent(word, candidate)[1]);
  }

  return unique(found);
}

function search_quantified(word) {
  const found = [];

  for (let i = 0; i <= word.length; i++) {
    const root = word.slice(0, i);
    const term = word.slice(i);

    if (roots[root] != null && terminations[term] != null) {
      for (const r of roots[root]) {
        const [quantified, model, numRoot] = r;
        if (
          root === word &&
          (model === "inv" || models[model]["roots"][numRoot] === "K")
        ) {
          found.push(quantified);
        } else {
          for (const t of terminations[term]) {
            if (t[1] === model && t[2] === numRoot) {
              found.push(quantified + t[0]);
            }
          }
        }
      }
    }
  }

  return found;
}

function qty_to_accent(plain, quantified) {
  plain = plain.replace(/æ/g, "ae").replace(/Æ/g, "Ae").replace(/œ/g, "oe");
  quantified = quantified
    .replace(/æ/g, "ae")
    .replace(/Æ/g, "Ae")
    .replace(/œ/g, "oe");

  const plainChars = [...plain];
  const quantifiedChars = [...quantified];
  const quantities = new Array(quantifiedChars.length);
  let numSyllables = 0;

  for (let i = 0; i < quantifiedChars.length; i++) {
    const previous = quantifiedChars[i - 1];
    const current = quantifiedChars[i];
    const next = quantifiedChars[i + 1];

    if (current !== "\u0306") {
      if (vowels.includes(current)) {
        if (
          current === "u" &&
          ["A", "a", "Q", "q"].includes(dequantify(previous))
        ) {
          quantities[i] = "0";
        } else if (current === "e" && dequantify(previous) === "a") {
          quantities[i] = "0";
        } else if (
          current === "u" &&
          previous === "g" &&
          vowels.includes(dequantify(next))
        ) {
          quantities[i] = "0";
        } else if (current === "i" && dequantify(next) === "u") {
          quantities[i] = "0";
        } else {
          quantities[i] = "-";
        }
      } else if (longs.includes(current)) {
        quantities[i] = quantifiedChars[i + 1] === "\u0306" ? "-" : "+";
      } else if (breves.includes(current)) {
        quantities[i] = "-";
      } else if (current === "\u0306") {
        quantities[i - 1] = "-";
        quantities[i] = "c";
      } else {
        quantities[i] = "0";
      }

      let newSyllable = quantities[i] !== "0" && quantities[i] !== "c";
      if (
        quantities[i] === "0" &&
        ["e", "u"].includes(dequantify(current)) &&
        ["a", "e", "A", "E", "q"].includes(dequantify(previous))
      ) {
        newSyllable = false;
      }
      if (
        quantities[i] === "-" &&
        dequantify(current) === "e" &&
        dequantify(previous) === "o"
      ) {
        newSyllable = false;
      }
      if (
        current === "u" &&
        previous === "g" &&
        vowels.includes(dequantify(next))
      ) {
        newSyllable = false;
      }
      if (
        ["i", "I"].includes(dequantify(current)) &&
        i === 0 &&
        ["a", "o", "u"].includes(dequantify(next))
      ) {
        newSyllable = false;
      }
      if (newSyllable) {
        numSyllables++;
      }
    }
  }

  const filteredQuantities = quantities.filter((item) => item !== "c");
  const filteredQuantified = quantifiedChars.filter(
    (item) => item !== "\u0306",
  );

  if (numSyllables > 2) {
    let nbVowels = 0;
    let accentPos = 0;

    for (let j = 0; j < filteredQuantities.length; j++) {
      const qty = filteredQuantities[filteredQuantities.length - j - 1];
      if (qty !== "0") {
        nbVowels++;
        if (
          (nbVowels === 2 && qty === "+") ||
          (nbVowels === 3 && accentPos === 0)
        ) {
          const charIndex = filteredQuantities.length - j - 1;
          const currentPlain = plainChars[charIndex];
          const previousPlain = plainChars[charIndex - 1];

          if (currentPlain === "e" && ["a", "A"].includes(previousPlain)) {
            accentPos = qty === "+" ? charIndex : charIndex + 1;
          } else if (
            ["e", "u"].includes(currentPlain) &&
            ["a", "e", "o", "A", "E", "U"].includes(previousPlain) &&
            qty !== "+"
          ) {
            accentPos = charIndex;
          } else {
            accentPos = charIndex + 1;
          }
        }
      }
    }

    if (accentPos > 0 && vowels.indexOf(plain[accentPos - 1]) < 6) {
      plainChars[accentPos - 1] =
        accented[vowels.indexOf(plain[accentPos - 1])];

      if (
        plainChars[accentPos - 1] === "á" &&
        filteredQuantified[accentPos] === "e"
      ) {
        plainChars[accentPos - 1] = "\u01FD";
        plainChars[accentPos] = "";
      }
      if (
        plainChars[accentPos - 1] === "ó" &&
        filteredQuantified[accentPos] === "e"
      ) {
        plainChars[accentPos - 1] = "œ\u0301";
        plainChars[accentPos] = "";
      }
    }
  }

  for (let j = 0; j < plainChars.length; j++) {
    if (plainChars[j] === "a" && filteredQuantified[j + 1] === "e") {
      plainChars[j] = "æ";
      plainChars[j + 1] = "";
    }
    if (plainChars[j] === "A" && filteredQuantified[j + 1] === "e") {
      plainChars[j] = "Æ";
      plainChars[j + 1] = "";
    }
    if (plainChars[j] === "o" && filteredQuantified[j + 1] === "e") {
      plainChars[j] = "œ";
      plainChars[j + 1] = "";
    }
  }

  return [numSyllables > 2, plainChars.join("")];
}

function dequantify(vowel) {
  const longIndex = longs.indexOf(vowel);
  if (longIndex !== -1) {
    return vowels[longIndex];
  }
  const breveIndex = breves.indexOf(vowel);
  if (breveIndex !== -1) {
    return vowels[breveIndex];
  }
  return vowel;
}

function count_vowels(word) {
  let numVowels = 0;

  for (let i = 0; i < word.length; i++) {
    const char = dequantify(word[i]);
    if (!vowels.includes(char)) {
      continue;
    }
    if (char === "u" && ["q", "Q"].includes(word[i - 1])) {
      continue;
    }
    if (char === "u" && ["i", "I"].includes(dequantify(word[i - 1]))) {
      continue;
    }
    if (
      char === "u" &&
      ["g", "G"].includes(dequantify(word[i - 1])) &&
      vowels.includes(word[i + 1])
    ) {
      continue;
    }
    if (word[i] === "e" && dequantify(word[i - 1]) === "a") {
      continue;
    }
    numVowels++;
  }

  return numVowels;
}

function is_uppercase(word) {
  return uppercase.includes(word.charAt(0));
}

function to_lowercase(word) {
  const firstChar = word.charAt(0);
  const normalized = longs.includes(firstChar)
    ? vowels[longs.indexOf(firstChar)]
    : breves.includes(firstChar)
      ? vowels[breves.indexOf(firstChar)]
      : firstChar;

  const lowercased = lowercase[uppercase.indexOf(normalized)];
  return lowercased + word.slice(1);
}

function to_uppercase(word) {
  const chars = [...word];
  const firstChar = chars[0];
  const normalized = longs.includes(firstChar)
    ? vowels[longs.indexOf(firstChar)]
    : breves.includes(firstChar)
      ? vowels[breves.indexOf(firstChar)]
      : firstChar;

  chars[0] = uppercase[lowercase.indexOf(normalized)];
  return chars.join("");
}

function unique(thisArray) {
  return [...new Set(thisArray)];
}

function last_long(word) {
  if (!word.endsWith("āe")) {
    let transformed = word;
    for (let i = 0; i < vowels.length; i++) {
      const regexLong = new RegExp(longs[i], "g");
      transformed = transformed.replace(regexLong, vowels[i]);
      const regexBreve = new RegExp(breves[i], "g");
      transformed = transformed.replace(regexBreve, vowels[i]);
    }
    const match = /^(\S*)([aeiouy])([bcdfghjklmnpqrstvxz]*)/.exec(transformed);
    if (match) {
      return match[1] + longs[vowels.indexOf(match[2])] + match[3];
    }
  }
  return word;
}
