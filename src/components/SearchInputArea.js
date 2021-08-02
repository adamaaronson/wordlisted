import React, { Component } from 'react'

export default class SearchInputArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValues: {}
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState(prevState => {
            prevState.inputValues[event.target.name] = event.target.value
        })
        this.props.onInputChange(event);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.props.onSubmit} id="input-form">
                    <div className="input-area">
                        {this.props.searchMode.fields.map(field =>
                            <div className="input-row" key={"row-" + field}>
                                <label className="field-label" htmlFor={"search-inputs-" + this.props.searchMode.id + "-" + field} key={"label-" + field}>
                                    {field}:
                                </label>
                                <input 
                                    name={field}
                                    id={"search-inputs-" + this.props.searchMode.id + "-" + field}
                                    type="text"
                                    className="search-input-field"
                                    key={"input-" + this.props.searchMode.id + "-" + field}
                                    onChange={this.handleInputChange}
                                ></input>
                                <br/>
                            </div>
                        )}
                    </div>
                    {this.props.submitError &&
                        <div className="error-message">
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
