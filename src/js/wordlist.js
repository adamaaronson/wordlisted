export default class Wordlist { 
    constructor(list) {
        this.list = list;
        this.scores = {};
        this.clean();
    }

    loadList(list) {
        this.list = list;
        this.clean();
    }

    // appends all the words in the other list
    addWords(otherList) {
        this.list = this.list.concat(otherList);
        this.clean();
    }

    // returns only the letters in the word
    static cleanWord(word) {
        return word.toUpperCase().replaceAll(/[^\p{L}]/gu, '')
    }

    // cleans word and assigns word a score if needed
    processWord(word) {
        word = word.replaceAll(/\s/g, '');
        let cleanedWord = Wordlist.cleanWord(word);

        // matches semicolon followed by at least one number followed by end
        let scoreMatches = word.match(/;[0-9]+$/);
        let score = -1;
        if (scoreMatches !== null) {
            score = parseInt(scoreMatches[0].slice(1));
        }

        // if there was a score and the word is good to go
        if (score !== -1 && cleanedWord.length > 0) {
            // set score if it's a new max score
            if (this.scores[cleanedWord] === undefined || this.scores[cleanedWord] < score) {
                this.scores[cleanedWord] = score;
            }
        }

        return cleanedWord;
    }

    // makes the wordlist:
    // sorted
    // scored
    // all caps (RIP MF DOOM)
    // sans dupes
    // sans non-alphabetical characters
    // sans blank entries
    clean() {
        this.list = this.list.map(word =>
            this.processWord(word) // changes to all caps, removes non-alphabetic characters, and assigns score
        );
        
        this.list = this.list.filter(x => x.length > 0) // remove blank entries
        this.list.sort(); // sort
        this.list = [...new Set(this.list)] // remove dupes
    }

    // returns random word from the list
    randomWord() {
        var numWords = this.list.length;
        return this.list[Math.floor(Math.random() * numWords)]
    }

    // returns new wordlist filtered by given boolean function
    filtered(func) {
        return new Wordlist(this.list.filter(func));
    }

    // returns array of words in the wordlist such that func(word) is true
    getWords(func) {
        var resultWords = [];

        for (const word of this.list) {
            if (func(word)) {
                resultWords.push(word);
            }
        }

        return resultWords;
    }

    // returns {word, func(word)} object
    makePair(func, word) {
        return {word1: word, word2: func(word)};
    }

    // returns array of pairs of words (word1, word2) in the wordlist such that func(word1) = word2
    getPairs(func) {
        // array of {word, func(word)} objects
        var wordPairs = this.list.map(word => this.makePair(func, word));
        
        // remove pairs where word1 === word2
        wordPairs = wordPairs.filter(word => word.word1 !== word.word2);

        // sort by word2
        wordPairs.sort((x, y) => x.word2.localeCompare(y.word2));

        var resultPairs = [];
        var pairCounter = 0;
        var listCounter = 0;

        // iterates through sorted array and wordlist simultaneously to find pairs whose word2 are in the wordlist
        while (pairCounter < wordPairs.length && listCounter < this.list.length) {
            var pairCurrent = wordPairs[pairCounter];
            var listCurrent = this.list[listCounter];

            if (listCurrent > pairCurrent.word2) {
                pairCounter++;
            } else if (listCurrent === pairCurrent.word2) {
                resultPairs.push(pairCurrent);
                pairCounter++;
            } else {
                listCounter++;
            }
        }

        resultPairs.sort((x, y) => x.word1.localeCompare(y.word1));
        
        return resultPairs;
    }

    // returns reverse word
    static reverse(word) {
        return word.split('').reverse().join('')
    }

    // return sorted word
    static sort(word) {
        return word.split('').sort().join('');
    }

    // returns letter bank
    static getLetterBank(word) {
        word = this.sort(word)
        for (var i = 1; i < word.length; i++) {
            if (word[i] === word[i - 1]) {
                word = word.substring(0,i) + word.substring(i+1, word.length);
                i--;
            }
        }
        return word
    }

    // returns whether word1 and word2 are anagrams
    static areAnagrams(word1, word2) {
        var sortedWord1 = this.sort(word1)
        var sortedWord2 = this.sort(word2)
        return sortedWord1 === sortedWord2;
    }

    // returns whether word1 contains an anagram of word2
    static containsAnagram(word1, word2) {
        var sortedWord2 = this.sort(word2)
        for (var i = 0; i < word1.length - word2.length + 1; i++) {
            var word1Substring = word1.substring(i, i + word2.length);
            if (word1Substring === word2) {
                continue;
            }
            var sortedWord1Substring = this.sort(word1Substring)
            if (sortedWord1Substring === sortedWord2) {
                return true;
            }
        }
        return false;
    }

    // returns whether the word matches the regex, case insensitively
    static matchesRegex(word, regex) {
        var caseInsensitiveRegex;
        caseInsensitiveRegex = new RegExp(regex, 'i');
        return caseInsensitiveRegex.test(word);
    }

    // returns whether the input is a valid simple pattern
    static isValidPattern(pattern) {
        return pattern.split('').every(letter => /[\w?*]/.test(letter))
    }

    // returns regex equivalent to given simple pattern
    static patternToRegex(pattern) {
        return '^' + pattern.replaceAll('?', '.').replaceAll('*', '.*') + '$';
    }

    // returns whether the word matchers the given simple pattern, case insensitively
    static matchesPattern(word, pattern) {
        return this.matchesRegex(word, this.patternToRegex(pattern))
    }

    // returns whether word2 contains only and all the letters in word1
    static isLetterBank(word1, word2) {
        return word1 !== word2 && this.getLetterBank(word1) === this.getLetterBank(word2)
    }

    // returns whether word can be made using only the letters in tiles
    static isScrabbleWord(word, tiles) {
        // sort letters of tiles and word
        tiles = this.sort(tiles)
        word = this.sort(word)

        var tile_counter = 0;
        var word_counter = 0;
        var fail = false;

        while (word_counter < word.length && tile_counter < tiles.length) {
            var tile_current = tiles[tile_counter];
            var word_current = word[word_counter];

            if (tile_current > word_current) {
                fail = true;
                break;
            } else if (tile_current === word_current) {
                tile_counter++;
                word_counter++;
            } else {
                tile_counter++;
            }
        }

        return (word_counter === word.length && !fail)
    }

    // returns whether word is supervocalic
    static isSupervocalic(word) {
        return (
            this.isScrabbleWord('AEIOU', word) &&
            !this.isScrabbleWord('AA', word) &&
            !this.isScrabbleWord('EE', word) &&
            !this.isScrabbleWord('II', word) &&
            !this.isScrabbleWord('OO', word) &&
            !this.isScrabbleWord('UU', word)
        )
    }

    // strips word of its vowels
    static removeVowels(word) {
        return word.replaceAll('A', '').replaceAll('E', '').replaceAll('I', '').replaceAll('O', '').replaceAll('U', '').replaceAll('Y', '')
    }

    // returns whether word1 and word2 are a consonantcy
    static isConsonantcy(word1, word2) {
        return this.removeVowels(word1) === this.removeVowels(word2)
    }

    // returns whether word is flanked by the bread word
    static isSandwichWord(word, bread) {
        if (word.length <= bread.length) {
            return false
        }

        for (var i = 1; i < bread.length; i++) {
            if (word.startsWith(bread.substring(0,i)) && word.endsWith(bread.substring(i, bread.length))) {
                return true
            }
        }
        return false
    }

    // returns whether word1 is spread inside word2
    static isSpread(word1, word2) {
        if (word1 === word2) {
            return false;
        }
        word1 = Wordlist.cleanWord(word1) // remove non-alpha characters
        var regex = "^.*" + word1.split('').join('.*') + ".*$"
        return (new RegExp(regex)).test(word2)
    }

    // returns whether word can be made using only the limited alphabet
    static usesLettersFrom(word, alphabet) {
        alphabet = Wordlist.cleanWord(alphabet) // remove non-alpha characters
        var regex = "^[" + alphabet + "]*$"
        return (new RegExp(regex)).test(word)
    }

    // returns whether word can be spelled with given spelling bee puzzle
    static spellingBee(word, centerLetter, outerLetters) {
        var allLetters = (centerLetter + outerLetters)
        var wordLetters = word.split('')
        return word.includes(centerLetter) && wordLetters.every(letter => allLetters.includes(letter)) && word.length >= 4
    }

    // returns whether word is a palindrome
    static isPalindrome(word) {
        return word === this.reverse(word)
    }

    // returns reversed word if alphabetically greater, or nothing otherwise
    static getSemordnilap(word) {
        var reversed = this.reverse(word)
        if (reversed > word) {
            return reversed;
        } else {
            // return something that definitely won't be in the wordlist
            return '';
        }
    }

    // returns whether word is an isogram
    static isIsogram(word) {
        return this.getLetterBank(word).length === word.length
    }

    // returns Hamming distance between two words
    static getDistance(word1, word2) {
        if (word1.length !== word2.length) {
            return -1;
        }

        let distance = 0
        for (let i = 0; i < word1.length; i++) {
            if (word1[i] !== word2[i]) {
                distance++;
            }
        }
        return distance;
    }

    // returns whether word1 and word2 are some Hamming distance away
    static isDistance(word1, word2, distance) {
        if (isNaN(distance)) {
            throw new Error();
        }
        return this.getDistance(word1, word2) === distance;
    }

    // returns whether word1 and word2 are n distance away from being anagrams
    static areAlmostAnagrams(word1, word2, n) {
        if (word1.length !== word2.length) {
            return false;
        }
        if (isNaN(n)) {
            throw new Error();
        }

        let letters = {};

        for (const letter of word1) {
            if (letters[letter] === undefined) {
                letters[letter] = 1
            } else {
                letters[letter]++;
            }
        }

        for (const letter of word2) {
            if (letters[letter] === undefined) {
                letters[letter] = -1
            } else {
                letters[letter]--;
            }
        }

        let distance = 0

        for (const letter in letters) {
            distance += Math.abs(letters[letter])
        }

        return distance / 2 === n;

        // word1 = Wordlist.sort(word1);
        // word2 = Wordlist.sort(word2);
        // let distance1 = 0;
        // let distance2 = 0;
        // let counter1 = 0;
        // let counter2 = 0;

        // while (counter1 < word1.length && counter2 < word2.length) {
        //     if (word1[counter1] !== word2[counter2]) {
        //         if (word1[counter1] < word2[counter2]) {
        //             counter1++;
        //             distance1++;
        //         } else {
        //             counter2++;
        //             distance2++;
        //         }
        //     } else {
        //         counter1++;
        //         counter2++;
        //     }
        // }

        // return distance1 === n || distance2 === n;
    }
}