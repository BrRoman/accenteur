#!/usr/bin/env python3
"""Convert the Latin source files into a JavaScript data file."""

from __future__ import annotations

import json
import re
from copy import deepcopy
from pathlib import Path


DATA_PATH = Path(__file__).resolve().parent.parent
SOURCE_DIR = DATA_PATH / "sources"
MODEL_FILE = SOURCE_DIR / "modeles.la"
LEMME_FILE = SOURCE_DIR / "lemmes.la"
OUTPUT_FILE = DATA_PATH / "static" / "js" / "data.js"
COMMENT_PREFIX = "!"
COMMON_TERM_PREFIX = "$"
COMMON_TERM_PATTERN = re.compile(r"([\w]*)(\$[\w]+)")
ATONE_TRANSLATION = str.maketrans(
    {
        "\u0306": None,
        "ā": "a",
        "ă": "a",
        "ē": "e",
        "ĕ": "e",
        "ī": "i",
        "ĭ": "i",
        "ō": "o",
        "ŏ": "o",
        "ū": "u",
        "ŭ": "u",
        "ȳ": "y",
        "ў": "y",
        "Ā": "A",
        "Ă": "A",
        "Ē": "E",
        "Ĕ": "E",
        "Ī": "I",
        "Ĭ": "I",
        "Ō": "O",
        "Ŏ": "O",
        "Ū": "U",
        "Ŭ": "U",
        "Ȳ": "Y",
        "Ў": "Y",
    }
)


def atone(text: str) -> str:
    return text.translate(ATONE_TRANSLATION)


def long_by_position(word: str) -> str:
    vowels = "aeiouy"
    longs = {"a": "ā", "e": "ē", "i": "ī", "o": "ō", "u": "ū", "y": "ȳ"}
    consonants = set("bcdfglmnrstxz")
    begadkefat = set("bgdcpt")
    liquids = set("lr")

    characters = list(word)
    for index in range(len(characters) - 2):
        letter = characters[index]
        if letter not in vowels:
            continue

        first = characters[index + 1]
        second = characters[index + 2]
        if first in consonants and second in consonants and not (
            first in begadkefat and second in liquids
        ):
            if not ((letter in {"e", "u"}) and index > 0 and characters[index - 1] in {"ā", "ō"}):
                characters[index] = longs[letter]

        if characters[index] == "y":
            characters[index] = "ȳ"

    return "".join(characters)


def expand_ranges(range_str: str) -> list[int]:
    values: list[int] = []
    for segment in range_str.split(","):
        if "-" in segment:
            start, end = segment.split("-", 1)
            values.extend(range(int(start), int(end) + 1))
        else:
            values.append(int(segment))
    return values


def expand_common_terms(term_list: list[str], common_terms: dict[str, list[str]]) -> list[str]:
    expanded: list[str] = []
    for term in term_list:
        match = COMMON_TERM_PATTERN.search(term)
        if match:
            prefix, key = match.groups()
            for common_term in common_terms.get(key, []):
                expanded.append(prefix + common_term)
        else:
            expanded.append(term)
    return expanded


def parse_modeles(text: str) -> dict[str, dict[str, dict]]:
    models: dict[str, dict[str, dict]] = {}
    common_terms: dict[str, list[str]] = {}
    current_key = ""
    current_roots: dict[int, str | list[str]] = {}
    current_terms: dict[str, list[list[str]]] = {}

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            if current_key:
                models[current_key] = {
                    "roots": deepcopy(current_roots),
                    "terms": deepcopy(current_terms),
                }
                current_key = ""
                current_roots.clear()
                current_terms.clear()
            continue

        if line.startswith(COMMENT_PREFIX):
            continue

        if line.startswith(COMMON_TERM_PREFIX):
            key, value = line.split("=", 1)
            common_terms[key] = value.split(";")
            continue

        if line.startswith("modele:"):
            current_key = line.split(":", 1)[1]
            continue

        if line.startswith("pere:"):
            father = line.split(":", 1)[1]
            current_roots = deepcopy(models[father]["roots"])
            current_terms = deepcopy(models[father]["terms"])
            continue

        if line.startswith("R:"):
            _, root_index, payload = line.split(":", 2)
            index = int(root_index)
            if payload in {"K", "-"}:
                current_roots[index] = payload
            else:
                pieces = payload.split(",")
                current_roots[index] = [pieces[0], pieces[1] if len(pieces) > 1 else "0"]
            continue

        if line.startswith("des") or line.startswith("abs"):
            add_term = line.startswith("des+")
            remove_term = line.startswith("abs")
            pieces = line.split(":")
            term_range = pieces[1]
            term_root = pieces[2] if len(pieces) > 2 else ""
            term_list: list[str] = []
            if len(pieces) > 3:
                term_list = expand_common_terms(pieces[3].split(";"), common_terms)

            for index in expand_ranges(term_range):
                key = str(index)
                if not add_term:
                    current_terms.setdefault(key, [])
                if remove_term:
                    current_terms.pop(key, None)
                else:
                    if term_list and term_list[0] == "-":
                        current_terms[key].append([term_root, ""])
                    else:
                        term_value = term_list.pop(0) if term_list else ""
                        current_terms[key].append([term_root, term_value])
            continue

    if current_key:
        models[current_key] = {
            "roots": deepcopy(current_roots),
            "terms": deepcopy(current_terms),
        }

    return models


def build_terminations(models: dict[str, dict[str, dict]]) -> dict[str, list[list[object]]]:
    terminations: dict[str, list[list[object]]] = {}
    for model_name, model_data in models.items():
        for term_list in model_data["terms"].values():
            for root_number, term_value in term_list:
                for quantified in term_value.split(","):
                    term_key = atone(quantified)
                    terminations.setdefault(term_key, []).append(
                        [quantified, model_name, int(root_number)]
                    )
    return terminations


def parse_lemmes(text: str, models: dict[str, dict[str, dict]]) -> dict[str, list[list[object]]]:
    roots: dict[str, list[list[object]]] = {}
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith(COMMENT_PREFIX):
            continue

        fields = [field.strip() for field in line.split("|")]
        canonical_field = fields[0]
        model_key = fields[1]
        model_data = models[model_key]

        canonicals = canonical_field.split("=")
        if len(canonicals) > 1 and atone(canonicals[0]) == atone(canonicals[1].split(",")[0]):
            canonicals.pop(0)

        for canonical in canonicals:
            canonical = canonical[:-1] if canonical.endswith(("2", "3", "4")) else canonical
            for variant in canonical.split(","):
                for root_number, root_data in model_data["roots"].items():
                    if model_key == "inv" or root_data in ["K", "-"]:
                        root_value = variant
                    else:
                        delete_part = int(root_data[0])
                        add_part = root_data[1]
                        root_value = (variant[:-delete_part] if delete_part else variant) + (add_part if add_part != "0" else "")
                    roots.setdefault(atone(root_value), []).append(
                        [long_by_position(root_value), model_key, root_number]
                    )

        for offset, field_index in enumerate((2, 3), start=1):
            if len(fields) > field_index and fields[field_index]:
                for splinter in fields[field_index].split(","):
                    roots.setdefault(atone(splinter), []).append(
                        [long_by_position(splinter), model_key, offset]
                    )

    return roots


def write_output(models: dict[str, dict[str, dict]], roots: dict[str, list[list[object]]], terminations: dict[str, list[list[object]]]) -> None:
    OUTPUT_FILE.write_text("", encoding="utf-8")
    with OUTPUT_FILE.open("a", encoding="utf-8") as output:
        output.write("//##### Models #####\n\nvar models = ")
        output.write(json.dumps(models, ensure_ascii=False))
        output.write("\n\n\n//##### Roots #####\n\nvar roots = ")
        output.write(json.dumps(roots, ensure_ascii=False))
        output.write("\n\n\n//##### Terminations #####\n\nvar terminations = ")
        output.write(json.dumps(terminations, ensure_ascii=False))
        output.write("\n\n")


def main() -> None:
    models_text = MODEL_FILE.read_text(encoding="utf-8")
    lemmes_text = LEMME_FILE.read_text(encoding="utf-8")

    models = parse_modeles(models_text)
    terminations = build_terminations(models)
    roots = parse_lemmes(lemmes_text, models)

    write_output(models, roots, terminations)


if __name__ == "__main__":
    main()
