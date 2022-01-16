import React, { Component } from 'react'
import searchModes from '../js/searchmodes.js'
import Select from 'react-select'
import '../css/SearchModeMenu.scss'

const SingleValue = (props) => {
    return (
        <div className="search-single-value">
            <div className="search-mode-name">{props.data.label}</div>
            <div className="search-mode-description" dangerouslySetInnerHTML={{__html: props.data.desc}}></div>
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
            </div>
        )
    }
}
