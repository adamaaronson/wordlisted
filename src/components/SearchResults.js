import React, { Component } from 'react'
import '../css/SearchResults.scss'
import SearchResultsList from './SearchResultsList';
import SearchResultsNavigator from './SearchResultsNavigator';

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

    jumpToTop() {
        document.getElementById("search-results-box").scrollIntoView();
    }

    showPrevResults(shouldJump) {
        this.setState({
            firstIndex: this.state.firstIndex - MAX_RESULTS
        })

        if (shouldJump) {
            this.jumpToTop();
        }
    }

    showNextResults(shouldJump) {
        this.setState({
            firstIndex: this.state.firstIndex + MAX_RESULTS
        })

        if (shouldJump) {
            this.jumpToTop();
        }
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
        element.download = `${this.props.searchMode.value}-results.txt`;
        document.body.appendChild(element);
        element.click();
    }

    render() {
        return (
            <div className="search-results">
                <div className="results-counter">
                    <div className="results-count-label">Results</div>
                    { (this.props.results.length > 0 && !this.props.isLoading) ? (
                        <div className="results-count">
                            <div className="results-count-number">{this.props.results.length}</div>
                            {this.props.results.length > MAX_RESULTS && 
                                <SearchResultsNavigator
                                    numResults={this.props.results.length}
                                    maxResults={MAX_RESULTS}
                                    firstIndex={this.state.firstIndex}
                                    showPrevResults={this.showPrevResults}
                                    showNextResults={this.showNextResults}
                                    jumpToTop={false}
                                />
                            }
                            <div className="download-results-button-wrapper">
                                <button
                                    className="nice-button small-button blue-button download-results-button"
                                    onClick={this.downloadAsTxt}>
                                    Download
                                </button>
                            </div>
                        </div>
                    ) : (
                        this.props.isLoading ? (
                            <div className="results-count no-results">
                                <div className="loading-icon">
                                    <i className="fas fa-circle-notch fa-spin"></i>
                                </div>
                            </div>
                        ) : (
                            <div className="results-count no-results">
                                <div className="no-results-message">I have no words...</div>
                                <div className="no-results-icon">😭</div>
                            </div>
                        )
                    )}
                </div>

                { this.props.results.length > 0 &&
                    <>
                        <SearchResultsList
                            sortOrder={this.props.sortOrder}
                            sortReverse={this.props.sortReverse}
                            setSortOrder={this.props.setSortOrder}
                            results={this.props.results}
                            firstIndex={this.state.firstIndex}
                            maxResults={MAX_RESULTS}
                            wordlist={this.props.wordlist}
                        />

                        <div className="below-results">
                            {this.props.results.length > MAX_RESULTS && 
                                <SearchResultsNavigator
                                    numResults={this.props.results.length}
                                    maxResults={MAX_RESULTS}
                                    firstIndex={this.state.firstIndex}
                                    showPrevResults={this.showPrevResults}
                                    showNextResults={this.showNextResults}
                                    jumpToTop={true}
                                />
                            }
                        </div>
                    </>
                }
            </div>
        )
    }
}
