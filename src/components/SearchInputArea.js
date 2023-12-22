import React, { Component } from 'react';
import '../css/SearchInputArea.scss';

export default class SearchInputArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValues: {},
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState((prevState) => {
      prevState.inputValues[event.target.name] = event.target.value;
    });
    this.props.onInputChange(event);
  }

  render() {
    return (
      <form onSubmit={this.props.onSubmit} id="input-form">
        <div className="search-input-area">
          {this.props.searchMode.fields.map((field) => (
            <label
              className="search-input-row"
              htmlFor={
                'search-inputs-' + this.props.searchMode.id + '-' + field
              }
              key={'row-' + field}
            >
              <label
                className="search-field-label"
                htmlFor={
                  'search-inputs-' + this.props.searchMode.id + '-' + field
                }
                key={'label-' + field}
              >
                {field}:
              </label>
              <input
                name={field}
                id={'search-inputs-' + this.props.searchMode.id + '-' + field}
                type="text"
                className="search-input-field"
                key={'input-' + this.props.searchMode.id + '-' + field}
                onChange={this.handleInputChange}
              ></input>
            </label>
          ))}

          {this.props.submitError && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle error-icon"></i>
              <span>It seems there was an error in your input!</span>
            </div>
          )}
        </div>

        <button
          className="search-button nice-button"
          disabled={!this.props.hasAnyInputs}
          type="submit"
        >
          <span className="search-button-text">Search</span>
          <i className="fas fa-search search-icon"></i>
        </button>
      </form>
    );
  }
}
