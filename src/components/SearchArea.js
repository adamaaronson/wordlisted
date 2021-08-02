import React, { Component } from 'react'

import WordlistUploadButton from './WordlistUploadButton.js';
import SearchModeMenu from './SearchModeMenu.js';
import SearchInputArea from './SearchInputArea.js';
import SearchResults from './SearchResults.js';
import ResultsSorter from './ResultsSorter.js';
import InfoModal from './InfoModal.js';

import Wordlist from '../js/wordlist.js';
import { enable1 } from '../json/enable1.json';
import searchModes from '../js/searchmodes.js';
import searchTypes from '../js/searchtypes.js';

const DICTIONARY_NAME = "English dictionary";
const DEBUG = false;

export default class SearchArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchMode: searchModes[0],
            inputValues: {},
            results: [],
            gotResults: false,
            wordlist: new Wordlist(enable1),
            selectingWordlist: true,
            addingWordlist: false,
            filenames: [DICTIONARY_NAME],
            sortOrder: 'abc',
            sortReverse: false,
            submitError: false,
            showingModal: false
        }
        this.handleSearchModeChange = this.handleSearchModeChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleDictionaryClick = this.handleDictionaryClick.bind(this);
        this.handleWordlistChange = this.handleWordlistChange.bind(this);
        this.handleNewWordlist = this.handleNewWordlist.bind(this);
        this.handleWordlistAdd = this.handleWordlistAdd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handleSortClick = this.handleSortClick.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    handleSearchModeChange(searchModeName) {
        let newSearchMode = searchModes.find(x => x.id === searchModeName)
        let newInputValues = {};
        for (let field of newSearchMode.fields) {
            newInputValues[field] = "";
        }
        this.setState({
            searchMode: newSearchMode,
            inputValues: newInputValues,
            submitError: false
        });

        document.getElementById("input-form").reset();
    }

    handleInputChange(event) {
        this.setState(prevState => {
            prevState.inputValues[event.target.name] = event.target.value;
            return prevState;
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({
            submitError: false
        })

        var functionInputs = []
        for (const field of this.state.searchMode.fields) {
            var inputValue = this.state.inputValues[field]
            if (inputValue === '' || inputValue === undefined) {
                // blank input, raise error!
                this.setState({
                    submitError: true
                })
                if (DEBUG) {
                    console.log(this.state.searchMode.fields);
                    console.log(this.state.inputValues);
                }
                return;
            }
            inputValue = inputValue.toUpperCase().replaceAll(' ', '');
            functionInputs.push(inputValue);
        }

        var results = []

        try {
            switch (this.state.searchMode.type) {
                case searchTypes.SINGLE:
                    results = this.state.wordlist.getWords(this.state.searchMode.func(...functionInputs)).map(x => [x]);
                    break;
                case searchTypes.PAIRS:
                    results = this.state.wordlist.getPairs(this.state.searchMode.func(...functionInputs)).map(pair => [pair.word1, pair.word2]);
                    break;
                case searchTypes.MULTIPAIRS:
                    results = this.state.wordlist.getMultipairs(this.state.searchMode.func(...functionInputs)).map(pair => [pair.word1, pair.word2]);
                    break;
                default:
                    break;
            }
        } catch (err) {
            // erroneous input, raise error!
            this.setState({
                submitError: true
            })
            if (DEBUG) {
                console.log(err);
            }
            return;
        }

        this.setState({
            results: results,
            gotResults: true
        })
        
        this.sortResults(this.state.sortOrder)
    }

    handleFileChange(event) {
        let file = event.target.files[0];

        this.setState({
            wordlistError: false
        })

        if (file) {
            let reader = new FileReader();
            reader.readAsText(file);
            
            reader.onload = function() {
                // change the acting wordlist
                let newWords = reader.result.split('\n');
                this.handleNewWordlist(newWords, file.name);
            }.bind(this)

            reader.onerror = function() {
                // handle file error
                this.throwWordlistError();
            }.bind(this)
        }
    }

    throwWordlistError() {
        this.setState({
            selectingWordlist: true,
            wordlistError: true
        })
    }

    handleDictionaryClick() {
        this.handleNewWordlist(enable1, DICTIONARY_NAME);
    }

    handleNewWordlist(newWords, fileName) {
        let newFilenames = this.state.filenames;
        if (this.state.addingWordlist) {
            if (!newFilenames.includes(fileName)) {
                newFilenames.push(fileName);
            }
        } else {
            newFilenames = [fileName];
        }
        this.setState({
            filenames: newFilenames
        })

        if (this.state.addingWordlist) {
            this.state.wordlist.addWords(newWords);
        } else {
            let newWordlist = new Wordlist(newWords);
            this.setState({
                wordlist: newWordlist
            })
        }
        this.setState({
            selectingWordlist: false,
            addingWordlist: false
        })
    }

    handleWordlistChange() {
        this.setState({
            selectingWordlist: true,
            addingWordlist: false
        })
    }

    handleWordlistAdd() {
        this.setState({
            selectingWordlist: true,
            addingWordlist: true
        })
    }

    handleSortChange(event) {
        this.setState({
            sortOrder: event.target.value,
            sortReverse: false
        })
        this.sortResults(event.target.value)
    }

    handleSortClick(event) {
        let sortClicked = event.target.value
        if (this.state.sortOrder === sortClicked) {
            this.setState({
                sortReverse: !this.state.sortReverse,
                results: this.state.results.reverse()
            })
        }
    }

    sortResults(sortOrder) {
        if (sortOrder === 'abc') {
            this.setState(oldState => {
                // sort by abc
                oldState.results.sort((a, b) => a[0].localeCompare(b[0]))
                if (oldState.sortReverse) {
                    oldState.results.reverse();
                }
                return oldState;
            })
        } else if (sortOrder === 'length') {
            this.setState(oldState => {
                // sort by length
                for (let i = oldState.results[0].length - 1; i >= 0; i--) {
                    oldState.results.sort((a, b) => (b[i].length - a[i].length))
                }
                
                if (oldState.sortReverse) {
                    oldState.results.reverse();
                }
                return oldState;
            })
        } else if (sortOrder === 'score') {
            this.setState(oldState => {
                // sort by sum of scores in result
                oldState.results.sort((a, b) => 
                    b.reduce((c, d) => (
                        c + (this.state.wordlist.scores[d] === undefined ? 0 : this.state.wordlist.scores[d])
                    ), 0) - a.reduce((c, d) => (
                        c + (this.state.wordlist.scores[d] === undefined ? 0 : this.state.wordlist.scores[d])
                    ), 0)
                )
                if (oldState.sortReverse) {
                    oldState.results.reverse();
                }
                return oldState;
            })
        }
    }

    openModal() {
        this.setState({
            showingModal: true
        })
    }

    closeModal(event) {
        if (event.target.className.includes("modal-closer")) {
            this.setState({
                showingModal: false
            })
        }
    }

    render() {
        return (
            <div>
                <div className="search-head">
                    <InfoModal
                        visible={this.state.showingModal}
                        onCloseModal={this.closeModal}
                    />

                    {this.state.wordlistError &&
                        <div class="error-message">
                            <i className="fas fa-exclamation-triangle error-icon"></i> It seems there was an error uploading your wordlist!
                        </div>
                    }

                    {this.state.selectingWordlist
                    ?   <div>
                            <WordlistUploadButton
                                onFileChange={this.handleFileChange}
                                onDictionaryClick={this.handleDictionaryClick}
                                onOpenModal={this.openModal}
                            />
                        </div>

                    :   <div className="wordlist-name-box content-box">
                            <div className="wordlist-name-label">
                                Current wordlist{this.state.filenames.length > 1 ? "s" : ""}:
                            </div>
                            {this.state.filenames.map(filename => 
                                <div key={filename} className={"wordlist-name" + ((filename === DICTIONARY_NAME) ? " dictionary-name" : "")}>
                                    {filename}
                                </div>
                            )}
                            
                            (<button className="add-wordlist-button linky-button link-border" onClick={this.handleWordlistAdd}>
                                add a list
                            </button>)
                            (<button className="change-wordlist-button linky-button link-border" onClick={this.handleWordlistChange}>
                                reset
                            </button>)
                            
                        </div>
                    }
                </div>

                <div className="search-body-box content-box">
                    <div className={"search-curtain" + (this.state.selectingWordlist ? "" : " search-curtain-off")}></div>
                    
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
                    />
                </div>
                
                <div className="search-results-wrapper">
                    <div className="search-results-box">
                        <div className={"search-curtain" + (this.state.selectingWordlist ? "" : " search-curtain-off")}></div>

                        <ResultsSorter
                            onSortChange={this.handleSortChange}
                            onSortClick={this.handleSortClick}
                        />

                        { this.state.gotResults &&
                            <SearchResults
                                results={this.state.results}
                                sortOrder={this.state.sortOrder}
                                sortReverse={this.state.sortReverse}
                                wordlist={this.state.wordlist}
                            /> 
                        }
                    </div>
                </div>
            </div>
        )
    }
}
