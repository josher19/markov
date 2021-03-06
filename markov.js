/**
 * Markov chain class to generate random strings from source
 *
 * Example usage:
 *
 *     // echo a markov chain from file
 *     var markov = new Markov();
 *     markov.setSourceFile('/path/to/story');
 *     console.log(markov->generate(20));
 *
 * Author: Sean Sullivan
 * Author: Translated from PHP to Node by Joshua Weinstein (josher19)
 */
var fs = require("fs");

var Markov = function (file) {
        if (file) this.setSourceFile(file);

        return this;
};

var proto = Markov.prototype;

proto.setSourceString = function (str) {
        this.text = str;
};

proto.source = function (str) {
    return this.text;
};

/**
 * Get Markov source from a string
 * Example usage: 
 *    new Markov().setSourceString('hello Markov').source() === 'hello Markov';
 */
proto.setSourceString = function (str) {
    this.text = str;

    return this;
};


/** 
 * Get Markov source from a File
 * Example usage:
 *    typeof new Markov().setSourceFile(__dirname + '/markov.js').source() === 'string';
 */
proto.setSourceFile = function (file, encoding) {
    this.text = fs.readFileSync(file, encoding || "utf-8");

    return this;
};


/** Strip HTML tags */
function strip_tags(inp) {
    return inp.replace(/<[^>]*?>/g, " ");
}

// If we need to strip html entities, use this:
//~ function htmlentities(inp) { return inp.replace(/\&([^; ]*?);/g, ''); }

/**  Based on Fisher-Yates shuffle popularized by Knuth */
function shuffle(array) {
    for (var curIndex = array.length - 1; curIndex > 0;) {
        var rand = Math.floor(curIndex * Math.random());

        --curIndex;
        var tmp = array[curIndex];

        array[curIndex] = array[rand];
        array[rand] = tmp;
    }

    return array;
}


/**
 * Generate Markov chain from source
 *
 * @param string num_words
 * @return string of at least num_words words
 */
proto.generate = function generate(num_words) {
    if (!this.text) {
        throw new Error("Markov can not generate without text");
    }

    var output = "";

    var gran = 2;

    var letters_line = 50;

    // clean up and randomize the input text
    var input = this.text.replace(/\s\s+/g, " ");

    input = input.replace(/\n|\r/g, "");
    input = strip_tags(input);

    // input = htmlentities(input);
    input = input.split(".");
    input = shuffle(input);
    input = input.join(".");
    var textwords = input.split(" ");

    var loopmax = textwords.length - (gran - 2) - 1;

    var frequency_table = {}, key_string, end, buffer, lastwords, possible, nextword;
    var j, k, i, c, l, r; // TODO: better names for loop variables

    for (j = 0; j < loopmax; j ++) {
        key_string = "";
        end = j + gran;

        for (k = j; k < end; k ++) {
            key_string += textwords[k] + " ";
        }

        frequency_table[key_string] = "";

        if (textwords[j + gran]) {
            frequency_table[key_string] += textwords[j + gran] + " ";
        }

        if ((j + gran) > loopmax) {
            break;
        }
    }

    buffer = "";
    lastwords = [];

    for (var i = 0; i < gran; i ++) {
        lastwords.push(textwords[i]);
        buffer += " " + textwords[i];
    }

    for (i = 0; i < num_words; i ++) {
        key_string = "";

        for (j = 0; j < gran; j ++) {
            key_string += lastwords[j] + " ";
        }

        if (frequency_table[key_string]) {
            possible = frequency_table[key_string].trim().split(" ");

            c = possible.length;
            r = Math.floor(c * Math.random());
            nextword = possible[r];
            buffer += " " + nextword;

            if (buffer.length >= letters_line) {
                output += buffer;
                buffer = "";
            }

            for (l = 0; l < gran - 1; l ++) {
                lastwords[l] = lastwords[l + 1];
            }

            lastwords[gran - 1] = nextword;
        } else {
            for (l = 0; l < gran; l ++) {
                lastwords.push(textwords[l]);
                buffer += " " + textwords[l];
            }
        }
    }

    output = output.trim();

    return output;
};

module.exports = Markov;
