import Wordplay from './wordplay.js';
import searchTypes from './searchtypes.js';

const searchModes = [
    {
        id: "simple-search",
        name: "Simple search",
        desc: "Words matching the given pattern of letters, where ? denotes one wildcard letter and * denotes any number of wildcard letters; e.g. ?WE*E yields AWESOME.",
        fields: ["Pattern"],
        type: searchTypes.SINGLE,
        func: pattern => (x => Wordplay.matchesPattern(x, pattern))
    },
    {
        id: "regex",
        name: "Regex",
        desc: "Words matching the given regex, or regular expression; e.g. ^S.*[AEIOU]{4} yields SEQUOIA. If you're new to regex, regexone.com has a great tutorial.",
        fields: ["Regex"],
        type: searchTypes.SINGLE,
        func: regex => (x => Wordplay.matchesRegex(x, regex))
    },
    {
        id: "anagram",
        name: "Anagram",
        desc: "Words formed by rearranging the letters of the given word; e.g. LINDSEY yields SNIDELY.",
        fields: ["Word"],
        type: searchTypes.SINGLE,
        func: word => (x => Wordplay.areAnagrams(x, word) && x !== word)
    },
    {
        id: "hidden-anagram",
        name: "Hidden anagram",
        desc: "Words containing an anagram of the given word; e.g. HOLLY yields TALLYHO.",
        fields: ["Word"],
        type: searchTypes.SINGLE,
        func: word => (x => Wordplay.containsAnagram(x, word))
    },
    {
        id: "subanagram",
        name: "Subanagram",
        desc: "Words that can be made from the letters in the given word; e.g. PARENTING yields PREGNANT.",
        fields: ["Word"],
        type: searchTypes.SINGLE,
        func: tiles => (x => Wordplay.isScrabbleWord(x, tiles))
    },
    {
        id: "almost-anagram",
        name: "Almost anagram",
        desc: "Words that become an anagram of the given word if you change a certain number of letters; e.g. ANAGRAM with 1 yields GRANDMA.",
        fields: ["Word", "# of changes"],
        type: searchTypes.SINGLE,
        func: (word, num) => (x => Wordplay.areAlmostAnagrams(x, word, parseInt(num)))
    },
    {
        id: "letter-bank",
        name: "Letter bank",
        desc: "Words with the same set of letters as the given word, ignoring repeated letters; e.g. TIME MACHINE yields MATHEMATICIAN.",
        fields: ["Word"],
        type: searchTypes.SINGLE,
        func: word => (x => Wordplay.isLetterBank(x, word))
    },
    {
        id: "required-letters",
        name: "Required letters",
        desc: "Words that contain all of the given letters, regardless of order; e.g. RSTUVW yields LIVERWURST.",
        fields: ["Letters"],
        type: searchTypes.SINGLE,
        func: letters => (x => Wordplay.isScrabbleWord(letters, x))
    },
    {
        id: "limited-alphabet",
        name: "Limited alphabet",
        desc: "Words that can be written using only the given letters, any number of times; e.g. ABCDEFG yields CABBAGE.",
        fields: ["Letters"],
        type: searchTypes.SINGLE,
        func: alphabet => (x => Wordplay.usesLettersFrom(x, alphabet))
    },
    {
        id: "spread",
        name: "Spread letters",
        desc: "Words that contain the given letters in order, but not necessarily consecutively; e.g. RAUCOUS yields RAMBUNCTIOUS.",
        fields: ["Letters"],
        type: searchTypes.SINGLE,
        func: word => (x => Wordplay.isSpread(word, x))
    },
    {
        id: "sandwich",
        name: "Sandwich word",
        desc: "Words formed by slicing the given word in two and adding letters inside; e.g. CRUST yields CRUMBLIEST.",
        fields: ["Bread"],
        type: searchTypes.SINGLE,
        func: word => (x => Wordplay.isSandwichWord(x, word))
    },
    {
        id: "consonantcy",
        name: "Consonantcy",
        desc: "Words with the same consonants in the same order as the given word; e.g. AMONG US yields MONGOOSE.",
        fields: ["Word"],
        type: searchTypes.SINGLE,
        func: word => (x => Wordplay.isConsonantcy(x, word))
    },
    {
        id: "vowelcy",
        name: "Vowelcy (new!)",
        desc: "Words with the same vowels in the same order as the given word; e.g. SEQUOIA yields EUPHORIA.",
        fields: ["Word"],
        type: searchTypes.SINGLE,
        func: word => (x => Wordplay.isVowelcy(x, word))
    },
    {
        id: "letterchanges",
        name: "Letter changes",
        desc: "Words that result from changing a certain number of letters in the given word; e.g. PERPETRATE with 1 yields PERPETUATE.",
        fields: ["Word", "# of changes"],
        type: searchTypes.SINGLE,
        func: (word, num) => (x => Wordplay.isDistance(x, word, parseInt(num)))
    },
    {
        id: "replaceone",
        name: "Replace one (new!)",
        desc: "Pairs of words formed by replacing one occurrence of one group of letters with another; e.g. replacing E with T yields MINISERIES → MINISTRIES.",
        fields: ["Replace one", "With"],
        type: searchTypes.MULTIPAIRS,
        func: (replace, with_) => (x => Wordplay.replaceOne(x, replace, with_))
    },
    {
        id: "replaceall",
        name: "Replace all",
        desc: "Pairs of words formed by replacing all occurrences of one group of letters with another; e.g. ",
        fields: ["Replace one", "With"],
        type: searchTypes.PAIRS,
        func: (replace, with_) => (x => x.replaceAll(replace, with_))
    },
    {
        id: "deletion",
        name: "Deletion",
        desc: "Pairs of words formed by removing all instances of a group of letters; e.g. removing DEM yields PANDEMIC → PANIC.",
        fields: ["Remove"],
        type: searchTypes.PAIRS,
        func: str => (x => x.replaceAll(str, ''))
    },
    {
        id: "prefix",
        name: "Prefix",
        desc: "Pairs of words formed by inserting a group of letters at the beginning; e.g. ADAM yields ANT → ADAMANT.",
        fields: ["Prefix"],
        type: searchTypes.PAIRS,
        func: str => (x => str + x)
    },
    {
        id: "suffix",
        name: "Suffix",
        desc: "Pairs of words formed by inserting a group of letters at the end; e.g. NUT yields DOUGH → DOUGHNUT.",
        fields: ["Suffix"],
        type: searchTypes.PAIRS,
        func: str => (x => x + str)
    },
    {
        id: "beheadments",
        name: "Beheadments",
        desc: "Pairs of words formed by removing the first letter; e.g. EQUALITY → QUALITY.",
        fields: [],
        type: searchTypes.PAIRS,
        func: () => (x => x.slice(1))
    },
    {
        id: "curtailments",
        name: "Curtailments",
        desc: "Pairs of words formed by removing the last letter, not including removing the S from regular plurals; e.g. MAGNETON → MAGNETO.",
        fields: [],
        type: searchTypes.PAIRS,
        func: () => (x => (x.endsWith('S') && !x.endsWith('SS') ? '' : x.slice(0, x.length - 1)))
    },
    {
        id: "palindromes",
        name: "Palindromes",
        desc: "Words spelled the same forward and backward; e.g. RACECAR.",
        fields: [],
        type: searchTypes.SINGLE,
        func: () => (x => Wordplay.isPalindrome(x))
    },
    {
        id: "semordnilaps",
        name: "Semordnilaps",
        desc: "Pairs of words that reverse to each other; e.g. DESSERTS → STRESSED.",
        fields: [],
        type: searchTypes.PAIRS,
        func: () => (x => Wordplay.getSemordnilap(x))
    },
    {
        id: "isograms",
        name: "Isograms",
        desc: "Words containing no repeating letters; e.g. UNCOPYRIGHTABLE.",
        fields: [],
        type: searchTypes.SINGLE,
        func: () => (x => Wordplay.isIsogram(x))
    },
    {
        id: "supervocalics",
        name: "Supervocalics",
        desc: "Words containing all five vowels exactly once; e.g. EDUCATION.",
        fields: [],
        type: searchTypes.SINGLE,
        func: () => (x => Wordplay.isSupervocalic(x))
    },
    {
        id: "spellingbee",
        name: "Spelling Bee solver",
        desc: "Words that can be spelled in the New York Times Spelling Bee game, i.e. must contain the center letter, must use only the given letters, and must be at least four letters.",
        fields: ["Center letter", "Outer letters"],
        type: searchTypes.SINGLE,
        func: (center, outer) => (x => Wordplay.spellingBee(x, center, outer))
    },
    {
        id: "everything",
        name: "Everything",
        desc: "Literally all the words. Helpful for sorting or combining lists.",
        fields: [],
        type: searchTypes.SINGLE,
        func: () => (x => true)
    }
]

export default searchModes;