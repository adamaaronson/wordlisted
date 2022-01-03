import React, { Component } from 'react'
import '../css/WordlistSelector.scss'
import iconUpload from '../images/icon-upload.png';
import iconDictionary from '../images/icon-dictionary.png';

export default class WordlistSelector extends Component {
    render() {
        return (
            <div className="wordlist-selector">
                <div className="upload-list-wrapper">
                    <label htmlFor="file-upload" className="nice-button wordlist-box upload-list">
                        <img src={iconUpload} alt="Upload your own wordlist" className="wordlist-icon"></img>
                        <div className="wordlist-label wordlist-label-upload">Upload<br/>your own<br/>wordlist</div>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".txt,.dict"
                        name="myFile"
                        text="Upload Wordlist"
                        onChange={this.props.onFileChange}
                    />
                    <div className="upload-info-wrapper">
                        <button className="linky-button upload-info" onClick={this.props.onOpenModal}>
                            <span className="hover-orange"><i className="fas fa-info-circle info-icon"></i>About uploading</span>
                        </button>
                    </div>
                </div>
                <span className="or">or</span>
                <button className="nice-button blue-button wordlist-box dictionary" onClick={this.props.onDictionaryClick}>
                    <div className="wordlist-label wordlist-label-dictionary">Use the<br/>English<br/>dictionary</div>
                    <img src={iconDictionary} alt="Use the English dictionary" className="wordlist-icon"></img>
                </button>
            </div>
            
        )
    }
}
