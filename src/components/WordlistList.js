import React, { Component } from 'react'
import '../css/WordlistList.scss'

export default class WordlistList extends Component {
    render() {
        return (
            <div className="wordlist-list">
                <div className="wordlist-list-label">
                    Wordlist{this.props.filenames.length > 1 ? "s" : ""}
                </div>
                {this.props.filenames.map(filename => 
                    <div key={filename} className="wordlist-name">
                        {filename}
                    </div>
                )}
                
                <div className="wordlist-buttons">
                    <button className="wordlist-button add-wordlist-button nice-button small-button" onClick={this.props.onWordlistAdd}>
                        Add list
                    </button>
                    <button className="wordlist-button change-wordlist-button nice-button small-button blue-button" onClick={this.props.onWordlistChange}>
                        Reset
                    </button>
                </div>
                    
            </div>
        )
    }
}