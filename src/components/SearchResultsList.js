import React, { Component } from 'react';
import '../css/SearchResultsList.scss';
import sorts from '../js/resultsorts.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const rgb = function (r, g, b) {
  return { r: r, g: g, b: b };
};

export default class SearchResultsList extends Component {
  constructor(props) {
    super(props);

    this.getSortArrowClasses = this.getSortArrowClasses.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.interpolateColors = this.interpolateColors.bind(this);
    this.getScoreBackground = this.getScoreBackground.bind(this);
    this.getLengthBackground = this.getLengthBackground.bind(this);
  }

  getSortArrowClasses(sortOrder) {
    let classes = '';

    if (sortOrder === this.props.sortOrder) {
      classes += 'active-sort';

      if (this.props.sortReverse) {
        classes += ' reverse-sort';
      }
    } else {
      classes += 'inactive-sort';
    }

    return classes;
  }

  updateSort(sortOrder) {
    this.props.setSortOrder(
      this.props.sortOrder === sortOrder ? sorts.REVERSE : sortOrder
    );
  }

  interpolateTwoColors(n, low, high, lowColor, highColor) {
    let highness = (n - low) / (high - low);

    let newR = lowColor.r + highness * (highColor.r - lowColor.r);
    let newG = lowColor.g + highness * (highColor.g - lowColor.g);
    let newB = lowColor.b + highness * (highColor.b - lowColor.b);

    return { r: newR, g: newG, b: newB };
  }

  interpolateColors(n, low, high, lowColor, highColor, ...midColors) {
    let allColors = [lowColor, ...midColors, highColor];
    let numColors = allColors.length;
    let colorDistance = (high - low) / (numColors - 1);
    let lowIndex = Math.floor(((n - low) / (high - low)) * (numColors - 1));

    if (lowIndex >= numColors - 1) {
      lowIndex = numColors - 2;
    } else if (lowIndex < 0) {
      lowIndex = 0;
    }

    let lowValue = low + lowIndex * colorDistance;
    let highValue = lowValue + colorDistance;

    return this.interpolateTwoColors(
      n,
      lowValue,
      highValue,
      allColors[lowIndex],
      allColors[lowIndex + 1]
    );
  }

  getScoreBackground(resultItem) {
    let average = 0;
    for (const word of resultItem) {
      if (this.props.wordlist.scores[word] !== undefined) {
        average += this.props.wordlist.scores[word];
      }
    }
    average /= resultItem.length;

    if (
      average === 0 &&
      resultItem.every((x) => this.props.wordlist.scores[x] === undefined)
    ) {
      return {};
    }

    let color = this.interpolateColors(
      average,
      1,
      100,
      rgb(235, 84, 189),
      rgb(57, 175, 10),
      rgb(48, 155, 215)
    );

    return {
      backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`, //
    };
  }

  getLengthBackground(resultItem) {
    let lengths = resultItem.map((word) => word.length);
    let average = lengths.reduce((a, b) => a + b) / lengths.length;

    let color = this.interpolateColors(
      average,
      3,
      21,
      rgb(48, 155, 215),
      rgb(228, 163, 23),
      rgb(235, 84, 189)
    );

    return {
      backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`, //
    };
  }

  render() {
    let showScores = !this.props.results.every((result) =>
      result.every((word) => this.props.wordlist.scores[word] === undefined)
    );

    let resultsStyle = {
      gridTemplateColumns: showScores ? 'auto 1fr auto auto' : 'auto 1fr auto',
    };

    return (
      <div className="results-list" style={resultsStyle}>
        <div className="results-list-header results-number-header">
          {/* nothing */}
        </div>

        <div className="results-list-header results-word-header">
          <button
            className="sort-results-button sort-by-word linky-button"
            onClick={() => this.updateSort(sorts.ABC)}
          >
            <span className="sort-results-text">Word</span>
            <FontAwesomeIcon
              icon={faCaretDown}
              className={
                'sort-results-arrow ' + this.getSortArrowClasses(sorts.ABC)
              }
            />
          </button>
        </div>

        <div
          className={
            'results-list-header results-length-header' +
            (!showScores ? ' last-results-column' : '')
          }
        >
          <button
            className="sort-results-button sort-by-length linky-button"
            onClick={() => this.updateSort(sorts.LENGTH)}
          >
            <FontAwesomeIcon
              icon={faCaretDown}
              className={
                'sort-results-arrow left-arrow ' +
                this.getSortArrowClasses(sorts.LENGTH)
              }
            />
            <span className="sort-results-text">Length</span>
          </button>
        </div>

        {showScores && (
          <div
            className={
              'results-list-header results-score-header' +
              (showScores ? ' last-results-column' : '')
            }
          >
            <button
              className="sort-results-button sort-by-score linky-button"
              onClick={() => this.updateSort(sorts.SCORE)}
            >
              <FontAwesomeIcon
                icon={faCaretDown}
                className={
                  'sort-results-arrow left-arrow ' +
                  this.getSortArrowClasses(sorts.SCORE)
                }
              />
              <span className="sort-results-text">Score</span>
            </button>
          </div>
        )}

        {this.props.results
          .slice(
            this.props.firstIndex,
            this.props.firstIndex + this.props.maxResults
          )
          .map((x, index) => (
            <React.Fragment key={index}>
              <div
                className={'results-number' + (index % 2 ? ' even-result' : '')}
                key={index + 'num'}
              >
                {index + this.props.firstIndex + 1}
              </div>

              <div
                className={'results-word' + (index % 2 ? ' even-result' : '')}
                key={index}
              >
                {x.length === 1 ? (
                  <span>{x[0]}</span>
                ) : (
                  <span>
                    {x[0]} <span className="pair-divider">{'\u2192'}</span>{' '}
                    {x[1]}
                  </span>
                )}
              </div>

              <div
                className={
                  'results-length' +
                  (index % 2 ? ' even-result' : '') +
                  (!showScores ? ' last-results-column' : '')
                }
                key={index + 'len'}
              >
                <span className="results-length-text">
                  ({x.map((word) => word.length).join(' / ')})
                </span>
              </div>

              {showScores && (
                <div
                  className={
                    'results-score' +
                    (index % 2 ? ' even-result' : '') +
                    (showScores ? ' last-results-column' : '')
                  }
                  key={index + 'score'}
                >
                  <div
                    className="results-score-bubble"
                    style={this.getScoreBackground(x)}
                  >
                    <span className="results-score-text">
                      {x
                        .map((word) =>
                          this.props.wordlist.scores[word] === undefined
                            ? '—'
                            : this.props.wordlist.scores[word]
                        )
                        .join(' / ')}
                    </span>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
      </div>
    );
  }
}
