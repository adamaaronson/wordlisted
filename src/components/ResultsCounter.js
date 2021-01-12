import React, { Component } from 'react'

export default class ResultsCounter extends Component {

    render() {
        return (
            <div>
                { this.props.results.length > 0 ?
                    <div className="results-count">
                        <span className="results-count-label">Results:</span>
                        <span className="results-count-number">{this.props.results.length}</span>
                        {this.props.results.length > 5000 && 
                            <span className="results-count-label">(showing first 5000)</span>
                        }
                    </div>
                :
                    <div className="results-count no-results">
                        <span className="results-count-label">Results:</span>
                        <div className="no-results-message">I have no words...</div>
                        <i className="far fa-sad-cry no-results-icon"></i>
                    </div>
                }
            </div>
        )
    }
}
