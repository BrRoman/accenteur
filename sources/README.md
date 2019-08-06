## Sources 

This folder contains some data files extracted from [Collatinus](https://github.com/biblissima/collatinus):

- `models.la` contains the patterns on which all the latin words are constructed.
- `lemmes.la` contains the latin words available in Accenteur and some informations about them, mainly the model from which they depend. For example, "dormio" is constructed on the model "audio".
- `raw_to_json.py` is a script written in Python that transforms these data into JSON Objects and write these Objects in the global data file `accenteur/accenteur_data.js`.
- `morphos.en` is for information only: it is a list of all the morphological forms (cases of the nouns, tenses of the verbs etc.) and their numbers as used in `models.la`.