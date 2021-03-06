# Accenteur

Accenteur is a web application written in Javascript to accentuate latin texts according to the liturgical rules in force in the Roman Catholic Church.

Its algorithms and data were adaptated from [Collatinus](https://github.com/biblissima/collatinus).

Its name comes from the french name of a little bird: the Dunnock (*Prunella modularis*).


### Instructions for use

Simply click on `index.html`.


### Demo

Try Accenteur [here](https://brroman.github.io/accenteur/).


### Resources

On [latin-ecclesiastic-accents](https://github.com/gregorio-project/latin-ecclesiastic-accents), you will find the rules of the latin accentuation and a corpus of latin accented texts.


### Thanks

Great thanks to [Philippe Verkerk](https://github.com/PhVerkerk) from Collatinus for its counsels, patience and encouragements, and to [Élie Roux](https://github.com/eroux) for his advices about programming methods.


# For developers

The most important files are `static/js/data.js` and `static/js/accenteur_core.js`. If you want to integrate Accenteur in your own web application, just copy those files where you want, and integrate them into your html page, like this:

    <script src="path/to/data.js">
    <script src="path/to/accenteur_core.js">

Then you can accentify any latin word in another JS file, calling the `accentify` function:

    accentify("vidimus"); // Expected output: "vídimus".

Below are some details about the code.

### Algorithm
The algorithm is quite simple in its outlines:
- The input text is splitted into words.
- Each word is split into all the possible couples of roots + terminations.
- If a root and a termination are consistent, then their accented versions are joined.
- Finally all the accented words are joined and paste in the output field.

For example:
'Domine' will be successively splitted into:

'' and 'Domine'

'D' and 'omine'

'Do' and 'mine'

'Dom' and 'ine'

'Domi' and 'ne'

'Domin' and 'e'

'Domine' and ''

The couple 'Dom' and 'ine' will be rejected, because, although 'dom' can be the root of 'domus', we can see in the model of 'domus' (model 'domus') that this word can't have the termination '-ine'.

On the contrary, 'domin' + 'e' will be retained, because 'domin' can be the root of 'dominus' (model 'lupus') with the vocative termination of the 'lupus' model.

Accenteur knows the enclitics, and thus he will retain a second combination: 'domi' + 'ne', i.e. 'dom' (from 'domus') + 'i' (locative) + 'ne' (enclitic).

Hence the result in the output field: 'Dómine|Domíne'.


### Data
The file `accenteur/data.js` contains all the data necessary to accentify a latin word (models, roots and terminations).

The folder `accenteur/sources/` contains the raw data files extracted from Collatinus (`models.la` and `lemmes.la`) and a script to convert them into JS Objects and write these Objects in the file `accenteur/data.js`.