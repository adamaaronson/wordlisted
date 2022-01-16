import React, { Component } from 'react'
import '../css/SearchResults.scss'
import SearchResultsList from './SearchResultsList';
import sorts from '../js/searchmodes.js'

const MAX_RESULTS = 1000;

export default class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstIndex: 0
        }

        this.showPrevResults = this.showPrevResults.bind(this)
        this.showNextResults = this.showNextResults.bind(this)
        this.downloadAsTxt = this.downloadAsTxt.bind(this)
        this.getBackgroundColorStyle = this.getBackgroundColorStyle.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState){
        if (this.props.results !== nextProps.results ||
            this.props.sortOrder !== nextProps.sortOrder ||
            this.props.sortReverse !== nextProps.sortReverse) {
                this.setState({
                    firstIndex: 0
                })
        }

        return (
            this.props.isLoading !== nextProps.isLoading ||
            this.props.results !== nextProps.results ||
            this.props.sortOrder !== nextProps.sortOrder ||
            this.props.sortReverse !== nextProps.sortReverse ||
            this.state.firstIndex !== nextState.firstIndex
        )
    }

    showPrevResults() {
        this.setState({
            firstIndex: this.state.firstIndex - MAX_RESULTS
        })
    }

    showNextResults() {
        this.setState({
            firstIndex: this.state.firstIndex + MAX_RESULTS
        })
    }

    // derived from https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
    downloadAsTxt() {
        const element = document.createElement("a");
        const file = new Blob(
            [this.props.results.map(result => 
                result.map( word =>
                    // word optionally followed by semicolon and score
                    word + (this.props.wordlist.scores[word] !== undefined ? ';' + (this.props.wordlist.scores[word]) : '')
                ).join(', ')
            ).join('\n')],
            {type: 'text/plain'}
        );

        element.href = URL.createObjectURL(file);
        element.download = "wordlisted-results.txt";
        document.body.appendChild(element);
        element.click();
    }

    getBackgroundColorStyle(resultItem) {
        let average = 0;
        for (const word of resultItem) {
            if (this.props.wordlist.scores[word] !== undefined) {
                average += this.props.wordlist.scores[word];
            }
        }
        average /= resultItem.length;

        if (average === 0 && resultItem.every(x => this.props.wordlist.scores[x] === undefined)) {
            return {
                backgroundColor: "hsla(0, 100%, 100%, 0.3)"
            }
        }
        return {
            backgroundColor: `hsl(${((196 + (50 - average)) % 256 + 256) % 256}, 77%, ${Math.max(51, 51 - 0.2 * (average - 50))}%)` //
        }
    }

    render() {
        return (
            <div className="search-results">
                { this.props.isLoading ?
                    <div className="loading-icon">
                        Loading!
                    </div>
                :
                    <>
                        <div className="results-counter">
                            <div className="results-count-label">Results</div>
                            { this.props.results.length > 0 ?
                                <div className="results-count">
                                    <div className="results-count-number">{this.props.results.length}</div>
                                    {this.props.results.length > MAX_RESULTS && 
                                        <div className="results-count-navigator">
                                            <button
                                                disabled={!(this.props.results.length > MAX_RESULTS && this.state.firstIndex >= MAX_RESULTS)}
                                                className="more-results-button prev-results-button nice-button blue-button"
                                                onClick={this.showPrevResults}>
                                                <i className="fas fa-chevron-left"></i>
                                            </button>

                                            {this.props.results.length > MAX_RESULTS && 
                                                <span className="results-count-specifier">
                                                    {this.state.firstIndex + 1}–{Math.min(this.state.firstIndex + MAX_RESULTS, this.props.results.length)}
                                                </span>
                                            }

                                            <button
                                                disabled={!(this.props.results.length > MAX_RESULTS && this.state.firstIndex < this.props.results.length - MAX_RESULTS)}
                                                className="more-results-button next-results-button nice-button blue-button"
                                                onClick={this.showNextResults}>
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </div>
                                    }
                                    <div className="download-results-button-wrapper">
                                        <button
                                            // className="nice-button small-button blue-button download-results-button"
                                            className="download-results-button linky-button hover-blue"
                                            onClick={this.downloadAsTxt}>
                                            Download list
                                        </button>
                                    </div>
                                </div>
                            :
                                <div className="results-count no-results">
                                    <div className="no-results-message">I have no words...</div>
                                    <i className="far fa-sad-cry no-results-icon"></i>
                                </div>
                            }
                        </div>

                        { this.props.results.length > 0 &&
                            <SearchResultsList
                                sortOrder={this.props.sortOrder}
                                sortReverse={this.props.sortReverse}
                                setSortOrder={this.props.setSortOrder}
                                results={this.props.results}
                                firstIndex={this.state.firstIndex}
                                maxResults={MAX_RESULTS}
                                wordlist={this.props.wordlist}
                            />
                        }
                    </>
                }
                   
            </div>
        )
    }
}
