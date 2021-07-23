import Wordplay from "./wordplay";

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

    // cleans word and assigns word a score if needed
    processWord(word) {
        word = word.replaceAll(/\s/g, '');
        let cleanedWord = Wordplay.cleanWord(word);

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
}