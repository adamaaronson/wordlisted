import React, { Component } from 'react'

import WordlistUploadButton from './WordlistUploadButton.js';
import SearchOptionMenu from './SearchOptionMenu.js';
import SearchInputArea from './SearchInputArea.js';
import SearchResults from './SearchResults.js';
import ResultsSorter from './ResultsSorter.js';
import ResultsCounter from './ResultsCounter.js';
import InfoModal from './InfoModal.js';

import Wordlist from '../js/wordlist.js';
import { enable1 } from '../json/enable1.json';
import SEARCH_OPTIONS from '../js/searchoptions.js';

export default class SearchArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: SEARCH_OPTIONS[0],
            inputValues: {},
            results: [],
            gotResults: false,
            wordlist: new Wordlist(enable1),
            selectingWordlist: true,
            usingDictionary: true,
            filename: 'English dictionary',
            sortOrder: 'abc',
            submitError: false,
            showingModal: false
        }
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleDictionaryClick = this.handleDictionaryClick.bind(this);
        this.handleWordlistChange = this.handleWordlistChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    handleOptionChange(optionName) {
        var searchOption = SEARCH_OPTIONS.find(x => x.id === optionName)
        this.setState({
            option: searchOption,
            inputValues: {},
            submitError: false
        });
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
        for (const field of this.state.option.fields) {
            var inputValue = this.state.inputValues[field]
            if (inputValue === '' || inputValue === undefined) {
                // blank input, raise error!
                this.setState({
                    submitError: true
                })
                return;
            }
            inputValue = inputValue.toUpperCase().replaceAll(' ', '');
            functionInputs.push(inputValue);
        }

        var results = []

        try {
            if (this.state.option.isPairs) {
                results = this.state.wordlist.getPairs(this.state.option.func(...functionInputs)).map(pair => [pair.word1, pair.word2])
            } else {
                results = this.state.wordlist.getWords(this.state.option.func(...functionInputs)).map(x => [x])
            }
        } catch (err) {
            // erroneous input, raise error!
            this.setState({
                submitError: true
            })
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
            
            this.setState({
                filename: file.name,
                usingDictionary: false
            })
            
            reader.onload = function() {
                // change the acting wordlist
                let newWordlist = new Wordlist(reader.result.split('\n'))
                this.setState({
                    wordlist: newWordlist,
                    selectingWordlist: false
                })
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
        this.setState({
            filename: 'English dictionary',
            wordlist: new Wordlist(enable1),
            usingDictionary: true,
            selectingWordlist: false
        })
    }

    handleWordlistChange() {
        this.setState({
            selectingWordlist: true
        })
    }

    handleSortChange(event) {
        this.setState({
            sortOrder: event.target.value
        })
        this.sortResults(event.target.value)
    }

    sortResults(sortOrder) {
        if (sortOrder === 'abc') {
            this.setState(oldState => {
                oldState.results.sort((a, b) => a[0].localeCompare(b[0]))
                return oldState;
            })
        } else if (sortOrder === 'length') {
            this.setState(oldState => {
                oldState.results.sort((a, b) => (b[0].length - a[0].length))
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
                                Current wordlist:
                            </div>
                            <div className={"wordlist-name" + (this.state.usingDictionary ? " dictionary-name" : "")}>
                                {this.state.filename}
                            </div>
                            (<button className="change-wordlist-button linky-button link-border" onClick={this.handleWordlistChange}>
                                change
                            </button>)
                        </div>
                    }
                </div>

                <div className="search-body-box content-box">
                    <div className={"search-curtain" + (this.state.selectingWordlist ? "" : " search-curtain-off")}></div>
                    
                    <SearchOptionMenu
                        onOptionChange={this.handleOptionChange}
                        option={this.state.option}
                    />

                    <SearchInputArea
                        option={this.state.option}
                        onInputChange={this.handleInputChange}
                        onSubmit={this.handleSubmit}
                        submitError={this.state.submitError}
                    />
                </div>
                
                <div className="search-results-wrapper">
                    <div className="search-results-box">
                        <div className={"search-curtain" + (this.state.selectingWordlist ? "" : " search-curtain-off")}></div>

                        <ResultsSorter onSortChange={this.handleSortChange}/>

                        { this.state.gotResults &&
                            <ResultsCounter 
                                results={this.state.results}
                            />
                        }

                        { this.state.gotResults &&
                            <SearchResults
                                results={this.state.results}
                                sortOrder={this.state.sortOrder}
                            /> 
                        }
                    </div>
                </div>
            </div>
        )
    }
}
