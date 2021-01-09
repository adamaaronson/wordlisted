import React, { Component } from 'react'

export default class InfoModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible
        }
    }

    render() {
        return (
            this.props.visible && (
                <div className="modal-wrapper test-wrapper modal-closer" value="modal-closer" onClick={this.props.onCloseModal}>
                    <div className="modal">
                        <div className="modal-text">
                            <h2 className="modal-header">
                                <i className="fas fa-info-circle info-icon"></i> About uploading
                            </h2>
                            <p>
                                A wordlist is simply a <span className="accent">.txt</span> or <span className="accent">.dict</span> file with one word on each line.
                                Any spaces, numbers, or punctuation will be filtered out automatically, so there's no need to remove them yourself.
                            </p>
                            <p>
                                This app uses the JavaScript File API and doesn't save your wordlist anywhere, so rest assured that no one can steal your words!
                            </p>
                        </div>
                        <button className="modal-close-button modal-closer" value="modal-closer" onClick={this.props.onCloseModal}>
                            Cool beans!
                        </button>
                    </div>
                </div>
            )
        )
    }
}
