import React, { Component } from 'react'
import searchModes from '../js/searchmodes.js'

export default class SearchModeMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onSearchModeChange(e.target.value);
    }
    
    render() {
        return (
            <div className="search-option-wrapper">
                <div className="instruction select-instruction" >
                    Select a <span className="bold-accent">search mode:</span>
                </div>
                <div className="select-wrapper">
                    <label htmlFor="search-option-menu" className="arrow-wrapper">
                        <i className="fas fa-angle-down select-arrow"></i>
                    </label>
                    <select name="search-option-menu" id="search-option-menu" onChange={this.handleChange}>
                        {searchModes.map(option =>
                            <option value={option.id} key={"option-" + option.id}>{option.name}</option>
                        )}
                    </select>
                </div>

                <p className="option-description">
                    {this.props.searchMode.desc}
                </p>
            </div>
        )
    }
}
