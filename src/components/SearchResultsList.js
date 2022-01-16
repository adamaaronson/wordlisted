import React, { Component } from 'react'
import '../css/SearchResultsList.scss'
import sorts from '../js/resultsorts.js';

export default class SearchResultsList extends Component {
    constructor(props) {
        super(props);
        
        this.getSortArrowClasses = this.getSortArrowClasses.bind(this);
        this.updateSort = this.updateSort.bind(this);
        this.getBackgroundColorStyle = this.getBackgroundColorStyle.bind(this);
    }

    getSortArrowClasses(sortOrder) {
        let classes = "";

        if (sortOrder === this.props.sortOrder) {
            classes += "active-sort";

            if (this.props.sortReverse) {
                classes += " reverse-sort";
            }
        } else {
            classes += "inactive-sort";
        }

        return classes;
    }

    updateSort(sortOrder) {
        this.props.setSortOrder((this.props.sortOrder === sortOrder) ? sorts.REVERSE : sortOrder)
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
            <div className="results-list" style={resultsStyle}>
                <div className="results-list-header results-number-header">
                    {/* nothing */}
                </div>

                <div className="results-list-header results-word-header">
                    <button
                        className="sort-results-button sort-by-word linky-button"
                        onClick={() => this.updateSort(sorts.ABC)}>
                        <span>Word</span>
                        <i className={"fas fa-caret-down sort-results-arrow " + this.getSortArrowClasses(sorts.ABC)}></i>
                    </button>
                </div>

                <div className={"results-list-header results-length-header" + (!showScores ? " last-results-column" : "")}>
                    <button
                        className="sort-results-button sort-by-length linky-button"
                        onClick={() => this.updateSort(sorts.LENGTH)}>
                        <span>Length</span>
                        <i className={"fas fa-caret-down sort-results-arrow " + this.getSortArrowClasses(sorts.LENGTH)}></i>
                    </button>
                </div>

                { showScores && <div className={"results-list-header results-score-header" + (showScores ? " last-results-column" : "")}>
                    <button 
                        className="sort-results-button sort-by-score linky-button"
                        onClick={() => this.updateSort(sorts.SCORE)}>
                        <span>Score</span>
                        <i className={"fas fa-caret-down sort-results-arrow " + this.getSortArrowClasses(sorts.SCORE)}></i>
                    </button>
                </div> }

                {this.props.results.slice(this.props.firstIndex, this.props.firstIndex + this.props.maxResults).map((x, index) =>
                    <React.Fragment key={index}>
                        <div className={"results-number" + (index % 2 ? " even-result" : "")} key={index + "num"}>
                            {index + this.props.firstIndex + 1}
                        </div>

                        <div className={"results-word" + (index % 2 ? " even-result" : "")} key={index}>
                            {x.length === 1 ?
                                <span>{x[0]}</span>
                            :
                                <span>{x[0]} <span className="pair-divider">{'\u2192'}</span> {x[1]}</span>
                            }
                        </div>

                        <div className={"results-length" + (index % 2 ? " even-result" : "") + (!showScores ? " last-results-column" : "")} key={index + "len"}>
                            <span className="results-length-text">
                                ({x.map(word => word.length).join('/')})
                            </span>
                        </div>

                        { showScores &&
                            <div className={"results-score" + (index % 2 ? " even-result" : "") + (showScores ? " last-results-column" : "")} key={index + "score"}>
                                <div className="results-score-text" style={this.getBackgroundColorStyle(x)}>
                                    {x.map(word => (this.props.wordlist.scores[word] === undefined ? "—" : this.props.wordlist.scores[word])).join('/')}
                                </div>
                            </div>
                        }
                    </React.Fragment>
                )}
            </div>
        )
    }
}