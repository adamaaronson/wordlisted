export default class Wordplay {
  // returns only the letters in the word
  static cleanWord(word) {
    return word.toUpperCase().replaceAll(/[^\p{L}]/gu, '');
  }

  // returns reverse word
  static reverse(word) {
    return word.split('').reverse().join('');
  }

  // return sorted word
  static sort(word) {
    return word.split('').sort().join('');
  }

  // returns letter bank
  static getLetterBank(word) {
    word = this.sort(word);
    for (var i = 1; i < word.length; i++) {
      if (word[i] === word[i - 1]) {
        word = word.substring(0, i) + word.substring(i + 1, word.length);
        i--;
      }
    }
    return word;
  }

  // returns whether word1 and word2 are anagrams
  static areAnagrams(word1, word2) {
    var sortedWord1 = this.sort(word1);
    var sortedWord2 = this.sort(word2);
    return sortedWord1 === sortedWord2;
  }

  // returns whether word1 contains an anagram of word2
  static containsAnagram(word1, word2) {
    if (word1.includes(word2)) {
      return false;
    }
    var sortedWord2 = this.sort(word2);
    for (var i = 0; i < word1.length - word2.length + 1; i++) {
      var word1Substring = word1.substring(i, i + word2.length);
      if (word1Substring === word2) {
        continue;
      }
      var sortedWord1Substring = this.sort(word1Substring);
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
    return pattern.split('').every((letter) => /[\w?*]/.test(letter));
  }

  // returns regex equivalent to given simple pattern
  static patternToRegex(pattern) {
    return '^' + pattern.replaceAll('?', '.').replaceAll('*', '.*') + '$';
  }

  // returns whether the word matchers the given simple pattern, case insensitively
  static matchesPattern(word, pattern) {
    return this.matchesRegex(word, this.patternToRegex(pattern));
  }

  // returns whether word2 contains only and all the letters in word1
  static isLetterBank(word1, word2) {
    return (
      word1 !== word2 && this.getLetterBank(word1) === this.getLetterBank(word2)
    );
  }

  // returns whether word can be made using only the letters in tiles
  static isScrabbleWord(word, tiles) {
    // sort letters of tiles and word
    tiles = this.sort(tiles);
    word = this.sort(word);

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

    return word_counter === word.length && !fail;
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
    );
  }

  // returns whether word is monovoc
  static isMonovoc(word) {
    let vowels = 0;
    for (let vowel of ['A', 'E', 'I', 'O', 'U', 'Y']) {
      if (word.includes(vowel)) {
        vowels++;
      }
    }
    return vowels === 1;
  }

  // strips word of its vowels
  static removeVowels(word) {
    return word.replaceAll(/[AEIOUY]/gi, '');
  }

  // strips word of its consonants
  static removeConsonants(word) {
    return word.replaceAll(/[BCDFGHJKLMNPQRSTVWXZ]/gi, '');
  }

  // returns whether word1 and word2 are a consonantcy
  static isConsonantcy(word1, word2) {
    return (
      word1 !== word2 && this.removeVowels(word1) === this.removeVowels(word2)
    );
  }

  // returns whether word1 and word2 are a vowelcy
  static isVowelcy(word1, word2) {
    return (
      word1 !== word2 &&
      this.removeConsonants(word1) === this.removeConsonants(word2)
    );
  }

  // returns whether word is flanked by the bread word
  static isSandwichWord(word, bread) {
    if (word.length <= bread.length) {
      return false;
    }

    for (var i = 1; i < bread.length; i++) {
      if (
        word.startsWith(bread.substring(0, i)) &&
        word.endsWith(bread.substring(i, bread.length))
      ) {
        return true;
      }
    }
    return false;
  }

  // returns whether word1 is spread inside word2
  static isSpread(word1, word2) {
    if (word1 === word2) {
      return false;
    }

    let i1 = 0;
    let i2 = 0;
    while (i1 < word1.length && i2 < word2.length) {
      if (word1[i1] === word2[i2]) {
        i1++;
        i2++;
      } else {
        i2++;
      }
    }
    return i1 === word1.length;
  }

  // returns whether word can be made using only the limited alphabet
  static usesLettersFrom(word, alphabet) {
    alphabet = this.cleanWord(alphabet); // remove non-alpha characters
    var regex = '^[' + alphabet + ']*$';
    return new RegExp(regex).test(word);
  }

  // returns whether word can be spelled with given spelling bee puzzle
  static spellingBee(word, centerLetter, outerLetters) {
    var allLetters = centerLetter + outerLetters;
    var wordLetters = word.split('');
    return (
      word.includes(centerLetter) &&
      wordLetters.every((letter) => allLetters.includes(letter)) &&
      word.length >= 4
    );
  }

  // returns whether word is a palindrome
  static isPalindrome(word) {
    return word === this.reverse(word);
  }

  // returns reversed word if alphabetically greater, or nothing otherwise
  static getSemordnilap(word) {
    var reversed = this.reverse(word);
    if (reversed > word) {
      return reversed;
    } else {
      // return something that definitely won't be in the wordlist
      return '';
    }
  }

  // returns whether word is an isogram
  static isIsogram(word) {
    return this.getLetterBank(word).length === word.length;
  }

  // returns Hamming distance between two words
  static getDistance(word1, word2) {
    if (word1.length !== word2.length) {
      return -1;
    }

    let distance = 0;
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
    if (word1 === word2) {
      return false;
    }
    if (word1.length !== word2.length) {
      return false;
    }
    if (isNaN(n)) {
      throw new Error();
    }

    let letters = {};

    for (const letter of word1) {
      if (letters[letter] === undefined) {
        letters[letter] = 1;
      } else {
        letters[letter]++;
      }
    }

    for (const letter of word2) {
      if (letters[letter] === undefined) {
        letters[letter] = -1;
      } else {
        letters[letter]--;
      }
    }

    let distance = 0;

    for (const letter in letters) {
      distance += Math.abs(letters[letter]);
    }

    return distance / 2 === n;
  }

  // returns array of all possible words formed by replacing one instance of a string with another
  static replaceOne(word, from, to) {
    from = this.cleanWord(from); // remove non-alpha characters
    if (!from) {
      return [];
    }

    let regex = new RegExp(from, 'gi'),
      result,
      indices = [];
    while ((result = regex.exec(word))) {
      indices.push(result.index);
    }

    let results = indices.map(
      (i) => word.slice(0, i) + to + word.slice(i + from.length)
    );
    results = [...new Set(results)]; // remove duplicates
    return results;
  }

  // returns array of all possible words formed by replacing any letters in string with another
  static replaceAny(word, letters) {
    if (letters.length >= word.length) {
      return [];
    }

    let results = [];

    for (let i = 0; i < word.length - letters.length + 1; i++) {
      results.push(word.slice(0, i) + letters + word.slice(i + letters.length));
    }

    return results;
  }

  // returns whether word contains center in the dead center
  static isDeadCenter(word, center) {
    return (
      word.length > center.length &&
      word.includes(word) &&
      word.length % 2 === center.length % 2 &&
      word.slice((word.length - center.length) / 2).slice(0, center.length) ===
        center
    );
  }

  // returns word when swap1 and swap2 are swapped
  static letterSwap(word, swap1, swap2) {
    if (!word.includes(swap1) || !word.includes(swap2)) {
      return '';
    }

    let temp = '$';
    let result = word
      .replaceAll(swap1, temp)
      .replaceAll(swap2, swap1)
      .replaceAll(temp, swap2);

    return result > word ? result : '';
  }

  // returns whether word is repeater
  static isRepeater(word) {
    return (
      word.length % 2 === 0 &&
      word.slice(0, word.length / 2) === word.slice(word.length / 2)
    );
  }

  // returns whether word is neckout
  static isNeckout(word) {
    return (
      !this.isRepeater(word) &&
      word.length % 2 === 0 &&
      this.areAnagrams(
        word.slice(0, word.length / 2),
        word.slice(word.length / 2)
      )
    );
  }

  // returns cryptogram representation of word
  static getCryptogramForm(word) {
    let cryptogramForm = [];
    let letters = new Map();

    for (let i = 0; i < word.length; i++) {
      const letter = word.charAt(i);
      if (letters.has(letter)) {
        cryptogramForm.push(letters.get(letter));
      } else {
        letters.set(letter, i);
        cryptogramForm.push(i);
      }
    }

    return cryptogramForm;
  }

  // returns whether words have same cryptogram pattern
  static areCryptograms(word1, word2) {
    if (word1.length !== word2.length) {
      return false;
    }

    if (word1 === word2) {
      return false;
    }

    const cryptogram1 = this.getCryptogramForm(word1);
    const cryptogram2 = this.getCryptogramForm(word2);

    for (let i = 0; i < cryptogram1.length; i++) {
      if (cryptogram1[i] !== cryptogram2[i]) {
        return false;
      }
    }

    return true;
  }

  // returns whether word's letters are in alphabetical order
  static isAlphabetical(word) {
    return word === this.sort(word);
  }
}
