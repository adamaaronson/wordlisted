import React, { Component } from 'react'

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
        let showScores = !this.props.results.every(result => result.every(word => this.props.wordlist.scores[word] === undefined))
        let resultsStyle = {
            gridTemplateColumns: (showScores ? "auto 1fr auto auto" : "auto 1fr auto")
        }

        return (
            <div className="search-results">
                <div className="results-count-label">Results:</div>
                <div className="results-counter">
                    { this.props.results.length > 0 ?
                        <div className="results-count">
                            <span className="results-count-number">{this.props.results.length}</span>
                            {this.props.results.length > MAX_RESULTS && 
                                <div className="results-count-specifier">
                                    ({this.state.firstIndex + 1}-{Math.min(this.state.firstIndex + MAX_RESULTS, this.props.results.length)})
                                </div>
                            }
                            
                        </div>
                    :
                        <div className="results-count no-results">
                            <div className="no-results-message">I have no words...</div>
                            <i className="far fa-sad-cry no-results-icon"></i>
                        </div>
                    }

                    <div>
                        { (this.props.results.length > MAX_RESULTS && this.state.firstIndex >= MAX_RESULTS) &&
                            <button
                                className="more-results-button prev-results-button normal-button"
                                onClick={this.showPrevResults}>
                                {/* Prev<br/>{MAX_RESULTS} */}
                                <i className="fas fa-arrow-left"></i>
                            </button>
                        }

                        { (this.props.results.length > MAX_RESULTS && this.state.firstIndex < this.props.results.length - MAX_RESULTS) &&
                            <button
                                className="more-results-button next-results-button normal-button"
                                onClick={this.showNextResults}>
                                {/* Next<br/>{MAX_RESULTS} */}
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        }
                    </div>
                </div>
                
                { this.props.results.length > 0 &&
                    <div className="download-results-button-wrapper">
                        <button
                            className="download-results-button linky-button link-border"
                            onClick={this.downloadAsTxt}>
                            Download as .txt
                        </button>
                    </div>
                }

                { this.props.results.length > 0 &&
                    <div className="results-list" style={resultsStyle}>
                        {this.props.results.slice(this.state.firstIndex, this.state.firstIndex + MAX_RESULTS).map((x, index) =>
                            <React.Fragment key={index}>
                                <div className="results-number" key={index + "num"}>
                                    {index + this.state.firstIndex + 1}
                                </div>
                                <div className="results-item" key={index}>
                                    <div className="results-item-text">
                                        {x.length === 1 ?
                                            <div className="results-item-inner-text">
                                                <span>{x[0]} </span>
                                                {/* <span className="results-item-length">({x[0].length})</span> */}
                                            </div>
                                        :
                                            <div className="results-item-inner-text">
                                                <span>{x[0]} <span className="pair-divider">{'\u2192'}</span> {x[1]}</span>
                                                {/* <span className="results-item-length">({x[1].length})</span> */}
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="results-length" key={index + "len"}>
                                    <span className="results-item-length">
                                        ({x.map(word => word.length).join('/')})
                                    </span>
                                </div>
                                { showScores &&
                                    <div className="results-score" key={index + "score"} style={this.getBackgroundColorStyle(x)}>
                                        <span className="results-item-score">
                                            {x.map(word => (this.props.wordlist.scores[word] === undefined ? "—" : this.props.wordlist.scores[word])).join('/')}
                                        </span>
                                    </div>
                                }
                            </React.Fragment>
                        )}
                    </div>
                }   
            </div>
        )
    }
}
