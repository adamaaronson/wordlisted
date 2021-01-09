import React, { Component } from 'react'

export default class SearchInputArea extends Component {
    render() {
        return (
            <div>
                <form onSubmit={this.props.onSubmit}>
                    <div className="input-area">
                        {this.props.option.fields.map(field =>
                            <div className="input-row" key={"row-" + field}>
                                <label className="field-label" htmlFor={"search-inputs-" + field} key={"label-" + field}>
                                    {field}:
                                </label>
                                <input 
                                    name={field}
                                    id={"search-inputs-" + field}
                                    type="text"
                                    className="search-input-field"
                                    key={"input-" + field}
                                    onChange={this.props.onInputChange}
                                ></input>
                                <br/>
                            </div>
                        )}
                    </div>
                    {this.props.submitError &&
                        <div class="error-message">
                            <i className="fas fa-exclamation-triangle error-icon"></i> It seems there was an error in your input!
                        </div>
                    }
                    <button className="search-button" type="submit">
                        Search<i className="fas fa-search search-icon"></i>
                    </button>
                    
                </form>
            </div>
        )
    }
}
