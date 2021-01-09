import React, { Component } from 'react'

export default class SearchResults extends Component {
    shouldComponentUpdate(nextProps, nextState){
        return (
            this.props.results !== nextProps.results ||
            this.props.sortOrder !== nextProps.sortOrder
        )
    }

    render() {
        return (
            <div className="search-results">
                {this.props.results.length > 0 ?
                    <div className="nonzero-results">
                        <div className="results-count">
                            <span className="results-count-label">Results:</span>
                            <span className="results-count-number">{this.props.results.length}</span>
                            {this.props.results.length > 5000 && 
                                <span className="results-count-label">(showing first 5000)</span>
                            }
                        </div>
                    
                        <div className="results-list">
                            {this.props.results.slice(0, 5000).map((x, index) =>
                                <React.Fragment key={index}>
                                    <div className="results-number" key={index + "num"}>
                                        {index + 1}
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
                    </div>
                :
                    <div className="no-results">
                        <div className="no-results-message">I have no words...</div>
                        <i className="far fa-sad-cry no-results-icon"></i>
                    </div>
                }
            </div>
        )
    }
}
