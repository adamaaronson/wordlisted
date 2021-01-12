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
    }

    shouldComponentUpdate(nextProps, nextState){
        if (this.props.results !== nextProps.results ||
            this.props.sortOrder !== nextProps.sortOrder) {
                this.setState({
                    firstIndex: 0
                })
        }

        return (
            this.props.results !== nextProps.results ||
            this.props.sortOrder !== nextProps.sortOrder ||
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
            [this.props.results.map(x => x.join(', ')).join('\n')],
            {type: 'text/plain'}
        );

        element.href = URL.createObjectURL(file);
        element.download = this.props.optionId + "-wordlisted.txt";
        document.body.appendChild(element);
        element.click();
    }

    render() {
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
                    <div className="results-list">
                        {this.props.results.slice(this.state.firstIndex, this.state.firstIndex + MAX_RESULTS).map((x, index) =>
                            <React.Fragment key={index}>
                                <div className="results-number" key={index + "num"}>
                                    {index + this.state.firstIndex + 1}
                                </div>
                                <div className="results-item" key={index}>
                                    <div className="results-item-text">
                                        {x.length === 1 ?
                                            <span>
                                                {x[0]}
                                            </span>
                                        :
                                            <span>
                                                {x[0]} <span className="pair-divider">{'\u2192'}</span> {x[1]}
                                            </span>
                                        }
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                }   
            </div>
        )
    }
}
