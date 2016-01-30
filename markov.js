/**
 * Markov chain class to generate random strings from source
 *
 * @example
 *
 *     // echo a markov chain from file
 *     var markov = new Markov();
 *     markov.setSourceFile('/path/to/story');
 *     console.log(markov->generate(20));
 *
 * @author Sean Sullivan
 * @author Translated from PHP to Node by Joshua Weinstein (josher19)
 */
var fs = require("fs");

var Markov = function (file) {
        if (file) this.setSourceFile(file);

        return this;
    };

var proto = Markov.prototype;

proto.setSourceString = function (str) {
        this.text = str
};

proto.source = function (str) {
    return this.text
};
proto.setSourceString = function (str) {
    this.text = str;

    return this;
};

// new Markov().setSourceString('hello Markov').source() === 'hello Markov';
proto.setSourceFile = function (file, encoding) {
    this.text = fs.readFileSync(file, encoding || "utf-8");

    return this;
};

// typeof new Markov().setSourceFile(__dirname + '/markov.js').source() === 'string';
/* Strip HTML tags */
function strip_tags(inp) {
    return inp.replace(/<[^>]*?>/g, " ");
}

// function htmlentities(inp) { return inp.replace(/\&([^; ]*?);/g, ''); }
function shuffle(array) {
    for (var curIndex = array.length - 1; curIndex > 0;) {
        var rand = Math.floor(curIndex * Math.random());

        -- curIndex;
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
    var $this = this;

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

    frequency_table = {};

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

    $buffer = "";
    $lastwords = [];

    for ($i = 0; $i < gran; $i ++) {
        $lastwords.push(textwords[$i]);
        $buffer += " " + textwords[$i];
    }

    for ($i = 0; $i < num_words; $i ++) {
        key_string = "";

        for ($j = 0; $j < gran; $j ++) {
            key_string += $lastwords[$j] + " ";
        }

        if (frequency_table[key_string]) {
            $possible = frequency_table[key_string].trim().split(" ");

            // mt_srand();
            $c = $possible.length;
            $r = Math.floor($c * Math.random());
            $nextword = $possible[$r];
            $buffer += " " + $nextword;

            if ($buffer.length >= letters_line) {
                output += $buffer;
                $buffer = "";
            }

            for ($l = 0; $l < gran - 1; $l ++) {
                $lastwords[$l] = $lastwords[$l + 1];
            }

            $lastwords[gran - 1] = $nextword;
        } else {
            // $lastwords.splice(0, $lastwords.length); // array_splice($lastwords, 0, count($lastwords));
            for ($l = 0; $l < gran; $l ++) {
                $lastwords.push(textwords[$l]);
                $buffer += " " + textwords[$l];
            }
        }
    }

    output = output.trim();

    return output;
}

module.exports = Markov;
