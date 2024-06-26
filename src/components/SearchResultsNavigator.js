import React, { Component } from 'react';
import '../css/SearchResultsNavigator.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

export default class SearchResultsNavigator extends Component {
  render() {
    return (
      <div className="results-count-navigator">
        <button
          disabled={
            !(
              this.props.numResults > this.props.maxResults &&
              this.props.firstIndex >= this.props.maxResults
            )
          }
          className="more-results-button prev-results-button nice-button blue-button"
          onClick={() => this.props.showPrevResults(this.props.jumpToTop)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        {this.props.numResults > this.props.maxResults && (
          <span className="results-count-specifier">
            {this.props.firstIndex + 1}–
            {Math.min(
              this.props.firstIndex + this.props.maxResults,
              this.props.numResults
            )}
          </span>
        )}

        <button
          disabled={
            !(
              this.props.numResults > this.props.maxResults &&
              this.props.firstIndex <
                this.props.numResults - this.props.maxResults
            )
          }
          className="more-results-button next-results-button nice-button blue-button"
          onClick={() => this.props.showNextResults(this.props.jumpToTop)}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    );
  }
}
