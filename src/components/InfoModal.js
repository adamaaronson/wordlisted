import React, { Component } from 'react'
import '../css/InfoModal.scss'

export default class InfoModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible
        }
    }

    render() {
        return (
            <div className={`modal-wrapper test-wrapper modal-closer ${this.props.visible ? "" : " hidden"}`} onClick={this.props.onCloseModal}>
                <div className="modal content-box">
                    <div className="modal-text">
                        <h1 className="modal-header">
                            <i className="fas fa-info-circle info-icon"></i> About uploading
                        </h1>
                        <p>
                            A wordlist is simply a <strong>.txt</strong> or <strong>.dict</strong> file with one word on each line.
                            Any spaces, numbers, or punctuation will be filtered out automatically, so there's no need to remove them yourself.
                        </p>
                        <p>
                            Wordlists can also be scored! If a word in a list is followed by a semicolon and a number, it will be assigned that score; e.g. <code>AWESOME;100</code> will be scored at 100.
                            If a word has different scores in multiple lists, the maximum score will apply.
                        </p>
                        <p>
                            This app uses the JavaScript File API and doesn't save your wordlist anywhere, so rest assured that no one can steal your words!
                        </p>
                    </div>
                    <button className="modal-close-button nice-button small-button modal-closer" onClick={this.props.onCloseModal}>
                        Cool beans!
                    </button>
                </div>
            </div>
        )
    }
}
