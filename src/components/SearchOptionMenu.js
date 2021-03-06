import React, { Component } from 'react'
import SEARCH_OPTIONS from '../js/searchoptions.js'

export default class SearchOptionMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onOptionChange(e.target.value);
    }
    
    render() {
        return (
            <div className="search-option-wrapper">
                <div className="instruction select-instruction" >
                    {/* <span className="circled-number">2</span> */}
                    Select a <span className="bold-accent">search option:</span>
                </div>
                <div className="select-wrapper">
                    <label htmlFor="search-option-menu" className="arrow-wrapper">
                        <i className="fas fa-angle-down select-arrow"></i>
                    </label>
                    <select name="search-option-menu" id="search-option-menu" onChange={this.handleChange}>
                        {SEARCH_OPTIONS.map(option =>
                            <option value={option.id} key={"option-" + option.id}>{option.name}</option>
                        )}
                    </select>
                </div>

                <p className="option-description">
                    {this.props.option.desc}
                </p>
            </div>
        )
    }
}
