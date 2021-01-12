import React, { Component } from 'react'

export default class SearchResults extends Component {
    shouldComponentUpdate(nextProps){
        return (
            this.props.results !== nextProps.results ||
            this.props.sortOrder !== nextProps.sortOrder
        )
    }

    render() {
        return (
            <div className="search-results">
                { this.props.results.length > 0 &&
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
                }   
            </div>
        )
    }
}
