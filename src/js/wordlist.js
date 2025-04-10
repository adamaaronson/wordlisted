import Wordplay from './wordplay';

export default class Wordlist {
  constructor(list) {
    this.list = list;
    this.set = new Set();
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
      if (
        this.scores[cleanedWord] === undefined ||
        this.scores[cleanedWord] < score
      ) {
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
    this.list = this.list.map(
      (word) => this.processWord(word) // changes to all caps, removes non-alphabetic characters, and assigns score
    );

    this.list = this.list.filter((x) => x.length > 0); // remove blank entries
    this.list.sort(); // sort
    this.set = new Set(this.list);
    this.list = [...this.set]; // remove dupes
  }

  // returns random word from the list
  randomWord() {
    var numWords = this.list.length;
    return this.list[Math.floor(Math.random() * numWords)];
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
    return { word1: word, word2: func(word) };
  }

  // returns array of pairs of words (word1, word2) in the wordlist such that func(word1) = word2
  getPairs(func) {
    return this.list
      .map((word) => ({ word1: word, word2: func(word) }))
      .filter((pair) => pair.word1 !== pair.word2)
      .filter((pair) => this.set.has(pair.word2));
  }

  // returns array of pairs of words (word1, word2) in the wordlist such that
  // the array func(word1) contains word2
  getMultipairs(func) {
    let multipairs = [];

    for (let word of this.list) {
      multipairs = multipairs.concat(
        func(word)
          .map((word2) => ({ word1: word, word2: word2 }))
          .filter((pair) => pair.word1 !== pair.word2)
          .filter((pair) => this.set.has(pair.word2))
      );
    }

    return multipairs;
  }

  // returns array of pairs of words (word1, word2) in the wordlist such that
  // mapFunc(func(word1)) == mapFunc(word2)
  getMappairs(func, mapFunc) {
    const map = new Map();
    for (const word1 of this.list) {
      const mapWord1 = mapFunc(func(word1));
      if (map.has(mapWord1)) {
        map.get(mapWord1).push(word1);
      } else {
        map.set(mapWord1, [word1]);
      }
    }

    const resultPairs = [];
    for (const word2 of this.list) {
      const mapWord2 = mapFunc(word2);
      if (map.has(mapWord2)) {
        for (const word1 of map.get(mapWord2)) {
          if (word1 === word2) {
            continue;
          }
          resultPairs.push({ word1: word1, word2: word2 });
        }
      }
    }

    return resultPairs;
  }
}
