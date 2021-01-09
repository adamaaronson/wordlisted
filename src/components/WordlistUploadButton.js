import React, { Component } from 'react'

export default class WordlistUploadButton extends Component {
    render() {
        return (
            <div>
                <div className="wordlist-choices">
                    <div className="upload-list-wrapper">
                        <label htmlFor="file-upload" className="wordlist-box upload-list">
                            <i className="fas fa-file-upload wordlist-icon"></i>
                            <div className="wordlist-label wordlist-label-upload">Upload your own wordlist</div>
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
                                <i className="fas fa-info-circle info-icon"></i>
                                &nbsp;<div className="link-border">About uploading</div>
                            </button>
                        </div>
                    </div>
                    <span className="or"> or </span>
                    <button className="wordlist-box dictionary" onClick={this.props.onDictionaryClick}>
                        <div className="wordlist-label wordlist-label-dictionary">Use the English dictionary</div>
                        <i className="fas fa-book wordlist-icon"></i>
                    </button>
                </div>
            </div>
            
        )
    }
}
