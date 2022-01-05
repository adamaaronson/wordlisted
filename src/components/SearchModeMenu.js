import React, { Component } from 'react'
import searchModes from '../js/searchmodes.js'
import Select from 'react-select'
import '../css/SearchModeMenu.scss'

const SingleValue = (props) => {
    return (
        <div className="search-single-value">
            <div className="search-mode-name">{props.data.label}</div>
            <div className="search-mode-description">{props.data.desc}</div>
        </div>
    )
}

export default class SearchModeMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(option) {
        console.log(option)
        this.props.onSearchModeChange(option);
    }

    render() {
        return (
            <div className="search-mode-wrapper">
                <Select
                    options={searchModes}
                    defaultValue={searchModes[0]}
                    className="react-select"
                    classNamePrefix="react-select"
                    onChange={this.handleChange}
                    isSearchable={false}
                    components={{SingleValue}}
                />
                {/* <label className="select-wrapper nice-button" htmlFor="search-option-menu">
                    <select name="search-option-menu" id="search-option-menu" onChange={this.handleChange}>
                        {searchModes.map(option =>
                            <option value={option.value} key={"option-" + option.value}>{option.label}</option>
                        )}
                    </select>
                    <div className="arrow-wrapper">
                        <i className="fas fa-angle-down select-arrow"></i>
                    </div>
                    
                    <div className="option-description">
                        <p className="option-description">
                            {this.props.searchMode.desc}
                        </p>
                    </div>
                </label> */}
            </div>
        )
    }
}
