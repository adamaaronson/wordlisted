import React, { Component } from 'react';
import '../css/SearchArea.scss';

import WordlistSelector from './WordlistSelector.js';
import SearchModeMenu from './SearchModeMenu.js';
import SearchInputArea from './SearchInputArea.js';
import SearchResults from './SearchResults.js';
import InfoModal from './InfoModal.js';
import db from './db.js';

import Wordlist from '../js/wordlist.js';
import englishDictionary from '../json/enable1.json';
import searchModes from '../js/searchmodes.js';
import searchTypes from '../js/searchtypes.js';
import sorts from '../js/resultsorts.js';
import WordlistList from './WordlistList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const DICTIONARY_NAME = 'English dictionary';
const DEBUG = true;

export default class SearchArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchMode: searchModes[0].options[0],
      resultsSearchMode: searchModes[0].options[0],
      inputValues: {},
      results: [],
      gotResults: false,
      wordlist: new Wordlist(englishDictionary),
      selectingWordlist: true,
      addingWordlist: false,
      filenames: [DICTIONARY_NAME],
      sortOrder: sorts.ABC,
      sortReverse: false,
      submitError: false,
      showingModal: false,
      isLoadingResults: false,
    };
    this.hasAnyInputs = this.hasAnyInputs.bind(this);
    this.handleSearchModeChange = this.handleSearchModeChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleDictionaryClick = this.handleDictionaryClick.bind(this);
    this.handleWordlistChange = this.handleWordlistChange.bind(this);
    this.handleNewWordlist = this.handleNewWordlist.bind(this);
    this.handleWordlistAdd = this.handleWordlistAdd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sortResults = this.sortResults.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  async componentDidMount() {
    const wordlists = await db.wordlists.toArray();
    console.log(wordlists);
    if (wordlists.length > 0) {
      this.setState({
        filenames: wordlists.map((wordlist) => wordlist.name),
      });
      const firstList = wordlists[0];
      this.handleNewWordlist(firstList.contents, firstList.name, false, false);
      for (const wordlist of wordlists.slice(1)) {
        this.handleNewWordlist(wordlist.contents, wordlist.name, false, true);
      }
    }
    console.log(this.state.filenames);
  }

  hasAnyInputs() {
    if (this.state.searchMode.fields.length === 0) {
      return true;
    }
    let inputValues = Object.values(this.state.inputValues);
    return (
      inputValues.some((x) => x !== null && x !== '') &&
      inputValues.every((x) => x !== null && x !== '')
    );
  }

  handleSearchModeChange(searchMode) {
    let newInputValues = {};
    for (let field of searchMode.fields) {
      newInputValues[field] = '';
    }
    this.setState({
      searchMode: searchMode,
      inputValues: newInputValues,
      submitError: false,
    });

    document.getElementById('input-form').reset();
  }

  handleInputChange(event) {
    this.setState((prevState) => {
      prevState.inputValues[event.target.name] = event.target.value;
      return prevState;
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      submitError: false,
    });

    var functionInputs = [];
    for (const field of this.state.searchMode.fields) {
      var inputValue = this.state.inputValues[field];
      if (inputValue === '' || inputValue === undefined) {
        // blank input, raise error!
        this.setState({
          submitError: true,
        });
        if (DEBUG) {
          console.log(this.state.searchMode.fields);
          console.log(this.state.inputValues);
        }
        return;
      }
      inputValue = inputValue.toUpperCase().replaceAll(' ', '');
      functionInputs.push(inputValue);
    }

    this.generateResults(functionInputs);
  }

  generateResults(functionInputs) {
    var results = [];
    var searchMode = this.state.searchMode;
    try {
      switch (searchMode.type) {
        case searchTypes.SINGLE:
          results = this.state.wordlist
            .getWords(searchMode.func(...functionInputs))
            .map((x) => [x]);
          break;
        case searchTypes.PAIRS:
          results = this.state.wordlist
            .getPairs(searchMode.func(...functionInputs))
            .map((pair) => [pair.word1, pair.word2]);
          break;
        case searchTypes.MULTIPAIRS:
          results = this.state.wordlist
            .getMultipairs(searchMode.func(...functionInputs))
            .map((pair) => [pair.word1, pair.word2]);
          break;
        case searchTypes.MAPPAIRS:
          results = this.state.wordlist
            .getMappairs(searchMode.func(...functionInputs), searchMode.mapFunc)
            .map((pair) => [pair.word1, pair.word2]);
          break;
        default:
          break;
      }
    } catch (err) {
      // erroneous input, raise error!
      this.setState({
        submitError: true,
      });
      if (DEBUG) {
        console.log(err);
      }
      return;
    }

    this.setState({
      results: results,
      resultsSearchMode: this.state.searchMode,
      gotResults: true,
    });

    this.sortResults(this.state.sortOrder);

    if (this.state.sortReverse) {
      this.sortResults(sorts.REVERSE);
    }
  }

  handleFileChange(event) {
    let file = event.target.files[0];

    this.setState({
      wordlistError: false,
    });

    if (file) {
      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = function () {
        // change the acting wordlist
        let newWords = reader.result.split('\n');
        this.handleNewWordlist(newWords, file.name, true);
      }.bind(this);

      reader.onerror = function () {
        // handle file error
        this.throwWordlistError();
      }.bind(this);
    }
  }

  throwWordlistError() {
    this.setState({
      selectingWordlist: true,
      wordlistError: true,
    });
  }

  handleDictionaryClick() {
    this.handleNewWordlist(englishDictionary, DICTIONARY_NAME, true);
  }

  async handleNewWordlist(
    newWords,
    fileName,
    shouldUpdateDB,
    isAdditional = this.state.addingWordlist
  ) {
    if (shouldUpdateDB) {
      await db.wordlists.add({
        name: fileName,
        contents: newWords,
      });
    }

    let newFilenames = this.state.filenames;
    if (isAdditional) {
      if (!newFilenames.includes(fileName)) {
        newFilenames.push(fileName);
      }
    } else {
      newFilenames = [fileName];
    }
    this.setState({
      filenames: newFilenames,
    });

    if (isAdditional) {
      this.state.wordlist.addWords(newWords);
    } else {
      let newWordlist = new Wordlist(newWords);
      this.setState({
        wordlist: newWordlist,
      });
    }
    this.setState({
      selectingWordlist: false,
      addingWordlist: false,
    });
  }

  handleWordlistChange() {
    db.wordlists.clear();
    this.setState({
      selectingWordlist: true,
      addingWordlist: false,
    });
  }

  handleWordlistAdd() {
    this.setState({
      selectingWordlist: true,
      addingWordlist: true,
    });
  }

  sortResults(sortOrder) {
    this.setState((oldState) => {
      if (oldState.results.length === 0) {
        return oldState;
      }
      let newResults = [...oldState.results];
      let newSortReverse = false;

      if (sortOrder === sorts.REVERSE) {
        newResults = newResults.reverse();
        newSortReverse = !oldState.sortReverse;
        sortOrder = oldState.sortOrder;
      } else if (sortOrder === sorts.ABC) {
        newResults.sort((a, b) => a[0].localeCompare(b[0]));
      } else if (sortOrder === sorts.LENGTH) {
        for (let i = newResults[0].length - 1; i >= 0; i--) {
          newResults.sort((a, b) => b[i].length - a[i].length);
        }
      } else if (sortOrder === sorts.SCORE) {
        newResults.sort(
          (a, b) =>
            b.reduce(
              (c, d) =>
                c +
                (oldState.wordlist.scores[d] === undefined
                  ? 0
                  : oldState.wordlist.scores[d]),
              0
            ) -
            a.reduce(
              (c, d) =>
                c +
                (oldState.wordlist.scores[d] === undefined
                  ? 0
                  : oldState.wordlist.scores[d]),
              0
            )
        );
      }

      return {
        results: newResults,
        sortOrder: sortOrder,
        sortReverse: newSortReverse,
      };
    });
  }

  openModal() {
    this.setState({
      showingModal: true,
    });
  }

  closeModal(event) {
    if (event.target.className.includes('modal-closer')) {
      this.setState({
        showingModal: false,
      });
    }
  }

  render() {
    return (
      <div className="search-area">
        <div className="search-head">
          <InfoModal
            visible={this.state.showingModal}
            onCloseModal={this.closeModal}
          />

          {this.state.wordlistError && (
            <div class="error-message">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="error-icon"
              />{' '}
              It seems there was an error uploading your wordlist!
            </div>
          )}
          <div className="content-box top-box">
            {this.state.selectingWordlist ? (
              <WordlistSelector
                onFileChange={this.handleFileChange}
                onDictionaryClick={this.handleDictionaryClick}
                onOpenModal={this.openModal}
              />
            ) : (
              <WordlistList
                filenames={this.state.filenames}
                onWordlistAdd={this.handleWordlistAdd}
                onWordlistChange={this.handleWordlistChange}
              />
            )}
          </div>
        </div>

        <div className="search-body-box content-box">
          <div
            className={
              'search-curtain' +
              (this.state.selectingWordlist ? '' : ' search-curtain-off')
            }
          ></div>

          <SearchModeMenu
            onSearchModeChange={this.handleSearchModeChange}
            searchMode={this.state.searchMode}
          />

          <SearchInputArea
            searchMode={this.state.searchMode}
            inputValues={this.state.inputValues}
            onInputChange={this.handleInputChange}
            onSubmit={this.handleSubmit}
            submitError={this.state.submitError}
            hasAnyInputs={this.hasAnyInputs()}
          />
        </div>

        {(this.state.gotResults || this.state.isLoadingResults) && (
          <div
            className="search-results-box content-box"
            id="search-results-box"
          >
            <div
              className={
                'search-curtain' +
                (this.state.selectingWordlist ? '' : ' search-curtain-off')
              }
            ></div>

            <SearchResults
              isLoading={this.state.isLoadingResults}
              results={this.state.results}
              wordlist={this.state.wordlist}
              sortOrder={this.state.sortOrder}
              sortReverse={this.state.sortReverse}
              setSortOrder={this.sortResults}
              searchMode={this.state.resultsSearchMode}
            />
          </div>
        )}
      </div>
    );
  }
}
