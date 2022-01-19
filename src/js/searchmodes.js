import Wordplay from './wordplay.js';
import searchTypes from './searchtypes.js';

const searchModes = [
    {
        label: "Wildcards",
        options: [
            {
                value: "simple-search",
                label: "Simple search",
                desc: "Words matching the given letter pattern, where <code>?</code> is one wildcard letter and <code>*</code> is any number of wildcard letters; e.g. <code>A?E*E</code> yields AWESOME.",
                fields: ["Pattern"],
                type: searchTypes.SINGLE,
                func: pattern => (x => Wordplay.matchesPattern(x, pattern))
            },
            {
                value: "regex",
                label: "Regex",
                desc: "Words matching the given regex pattern; e.g. <code>^S.*[AEIOU]{4}</code> yields SEQUOIA. If you're new to regex, regexone.com has a great tutorial.",
                fields: ["Regex"],
                type: searchTypes.SINGLE,
                func: regex => (x => Wordplay.matchesRegex(x, regex))
            },
        ]
    },
    {
        label: "Anagrams and letter banks",
        options: [
            {
                value: "anagram",
                label: "Anagram",
                desc: "Words formed by rearranging the letters of the given word; e.g. LINDSEY yields SNIDELY.",
                fields: ["Word"],
                type: searchTypes.SINGLE,
                func: word => (x => Wordplay.areAnagrams(x, word) && x !== word)
            },
            {
                value: "made-from-letters",
                label: "Made from letters",
                desc: "Words that can be made from the letters in the given word; e.g. PARENTING yields PREGNANT.",
                fields: ["Word"],
                type: searchTypes.SINGLE,
                func: tiles => (x => Wordplay.isScrabbleWord(x, tiles))
            },
            {
                value: "hidden-anagram",
                label: "Hidden anagram",
                desc: "Words containing an anagram of the given word; e.g. HOLLY yields TALLYHO.",
                fields: ["Word"],
                type: searchTypes.SINGLE,
                func: word => (x => Wordplay.containsAnagram(x, word))
            },
            {
                value: "almost-anagram",
                label: "Almost anagram",
                desc: "Words that become an anagram of the given word if you change a certain number of letters; e.g. ANAGRAM with 1 yields GRANDMA.",
                fields: ["Word", "Number of changes"],
                type: searchTypes.SINGLE,
                func: (word, num) => (x => Wordplay.areAlmostAnagrams(x, word, parseInt(num)))
            },
            {
                value: "letter-bank",
                label: "Letter bank",
                desc: "Words with the same set of letters as the given word, ignoring repeated letters; e.g. TIME MACHINE yields MATHEMATICIAN.",
                fields: ["Word"],
                type: searchTypes.SINGLE,
                func: word => (x => Wordplay.isLetterBank(x, word))
            },
            {
                value: "required-letters",
                label: "Required letters",
                desc: "Words that contain all of the given letters, regardless of order; e.g. RSTUVW yields LIVERWURST.",
                fields: ["Letters"],
                type: searchTypes.SINGLE,
                func: letters => (x => Wordplay.isScrabbleWord(letters, x))
            },
            {
                value: "limited-alphabet",
                label: "Limited alphabet",
                desc: "Words that can be written using only the given letters, any number of times; e.g. ABCDEFG yields CABBAGE.",
                fields: ["Letters"],
                type: searchTypes.SINGLE,
                func: alphabet => (x => Wordplay.usesLettersFrom(x, alphabet))
            }
        ]
    },
    {
        label: "Letter patterns",
        options: [
            {
                value: "camouflage-word",
                label: "Camouflage word",
                desc: "Words that contain the letters of the given word in order, but not necessarily consecutively; e.g. RAUCOUS yields RAMBUNCTIOUS.",
                fields: ["Word"],
                type: searchTypes.SINGLE,
                func: word => (x => Wordplay.isSpread(word, x))
            },
            {
                value: "sandwich-word",
                label: "Sandwich word",
                desc: "Words formed by slicing the given word in two and adding letters inside; e.g. CRUST yields CRUMBLIEST.",
                fields: ["Word"],
                type: searchTypes.SINGLE,
                func: word => (x => Wordplay.isSandwichWord(x, word))
            },
            {
                value: "dead-center",
                label: "Dead center",
                desc: "Words that contain the given word in the exact center; e.g. ABE yields ALPHABETIZE.",
                fields: ["Center"],
                type: searchTypes.SINGLE,
                func: center => (x => Wordplay.isDeadCenter(x, center))
            },
            {
                value: "letter-changes",
                label: "Letter changes",
                desc: "Words that result from changing a certain number of letters in the given word; e.g. PERPETRATE with 1 yields PERPETUATE.",
                fields: ["Word", "Number of changes"],
                type: searchTypes.SINGLE,
                func: (word, num) => (x => Wordplay.isDistance(x, word, parseInt(num)))
            },
            {
                value: "consonantcy",
                label: "Consonantcy",
                desc: "Words with the same consonants in the same order as the given word; e.g. AMONG US yields MONGOOSE.",
                fields: ["Word"],
                type: searchTypes.SINGLE,
                func: word => (x => Wordplay.isConsonantcy(x, word))
            },
            {
                value: "vowelcy",
                label: "Vowelcy",
                desc: "Words with the same vowels in the same order as the given word; e.g. SEQUOIA yields EUPHORIA.",
                fields: ["Word"],
                type: searchTypes.SINGLE,
                func: word => (x => Wordplay.isVowelcy(x, word))
            }
        ]
    },
    {
        label: "Pairs",
        options: [
            {
                value: "replace-one",
                label: "Replace one",
                desc: "Pairs of words formed by replacing one occurrence of one group of letters with another; e.g. replacing S with GR yields SOUNDS → GROUNDS.",
                fields: ["Replace one", "With"],
                type: searchTypes.MULTIPAIRS,
                func: (replace, with_) => (x => Wordplay.replaceOne(x, replace, with_))
            },
            {
                value: "replace-all",
                label: "Replace all",
                desc: "Pairs of words formed by replacing all occurrences of one group of letters with another; e.g. replacing S with SS yields POSES → POSSESS.",
                fields: ["Replace all", "With"],
                type: searchTypes.PAIRS,
                func: (replace, with_) => (x => x.replaceAll(replace, with_))
            },
            {
                value: "delete-one",
                label: "Delete one",
                desc: "Pairs of words formed by removing one instance of a group of letters; e.g. removing T yields MEDITATE → MEDIATE.",
                fields: ["Delete one"],
                type: searchTypes.MULTIPAIRS,
                func: str => (x => Wordplay.replaceOne(x, str, ""))
            },
            {
                value: "delete-all",
                label: "Delete all",
                desc: "Pairs of words formed by removing all instances of a group of letters; e.g. removing ER yields DERRIERES → DRIES.",
                fields: ["Delete all"],
                type: searchTypes.PAIRS,
                func: str => (x => x.replaceAll(str, ''))
            },
            {
                value: "prefix",
                label: "Add prefix",
                desc: "Pairs of words formed by inserting a group of letters at the beginning; e.g. ADAM yields ANT → ADAMANT.",
                fields: ["Prefix"],
                type: searchTypes.PAIRS,
                func: str => (x => str + x)
            },
            {
                value: "suffix",
                label: "Add suffix",
                desc: "Pairs of words formed by inserting a group of letters at the end; e.g. NUT yields DOUGH → DOUGHNUT.",
                fields: ["Suffix"],
                type: searchTypes.PAIRS,
                func: str => (x => x + str)
            },
            {
                value: "beheadments",
                label: "Beheadments",
                desc: "Pairs of words formed by removing the first letter; e.g. EQUALITY → QUALITY.",
                fields: [],
                type: searchTypes.PAIRS,
                func: () => (x => x.slice(1))
            },
            {
                value: "curtailments",
                label: "Curtailments",
                desc: "Pairs of words formed by removing the last letter, not including removing the S from regular plurals; e.g. MAGNETON → MAGNETO.",
                fields: [],
                type: searchTypes.PAIRS,
                func: () => (x => (x.endsWith('S') && !x.endsWith('SS') ? '' : x.slice(0, x.length - 1)))
            },
            {
                value: "letter-swap",
                label: "Letter swap",
                desc: "Pairs of words formed by replacing all occurrences of one string with another and vice versa, e.g. A and O yields ARGON → ORGAN.",
                fields: ["Swap", "With"],
                type: searchTypes.PAIRS,
                func: (swap, with_) => (x => Wordplay.letterSwap(x, swap, with_))
            },
        ]
    },
    {
        label: "Huh, neat",
        options: [
            {
                value: "palindromes",
                label: "Palindromes",
                desc: "Words spelled the same forward and backward; e.g. RACECAR.",
                fields: [],
                type: searchTypes.SINGLE,
                func: () => (x => Wordplay.isPalindrome(x))
            },
            {
                value: "semordnilaps",
                label: "Semordnilaps",
                desc: "Pairs of words that reverse to each other; e.g. DESSERTS → STRESSED.",
                fields: [],
                type: searchTypes.PAIRS,
                func: () => (x => Wordplay.getSemordnilap(x))
            },
            {
                value: "isograms",
                label: "Isograms",
                desc: "Words containing no repeating letters; e.g. UNCOPYRIGHTABLE.",
                fields: [],
                type: searchTypes.SINGLE,
                func: () => (x => Wordplay.isIsogram(x))
            },
            {
                value: "supervocalics",
                label: "Supervocalics",
                desc: "Words containing all five vowels exactly once; e.g. EDUCATION.",
                fields: [],
                type: searchTypes.SINGLE,
                func: () => (x => Wordplay.isSupervocalic(x))
            }
        ]
    },
    {
        label: "Miscellaneous",
        options: [
            {
                value: "spelling-bee",
                label: "Spelling Bee solver",
                desc: "Words that can be spelled in the New York Times Spelling Bee game, i.e. must contain the center letter, must use only the given letters, and must be at least four letters.",
                fields: ["Center letter", "Outer letters"],
                type: searchTypes.SINGLE,
                func: (center, outer) => (x => Wordplay.spellingBee(x, center, outer))
            },
            {
                value: "everything",
                label: "Everything",
                desc: "Literally all the words. Helpful for sorting or combining lists.",
                fields: [],
                type: searchTypes.SINGLE,
                func: () => (x => true)
            }
        ]
    }
    
]

export default searchModes;