import React from 'react';
import '../css/Header.scss';
import logo from '../images/icon-logo.png';

export default function Header() {
    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="Wordlisted" className="title-logo"></img>
            </div>
            <div className="title">
                <div className="main-title">
                    <a href="/wordlisted" className="title-text hover-fade">
                        <span className="title-1">Word</span>
                        <span className="title-2">listed</span>
                    </a>
                    <div className="subtitle">Find your words!</div>
                </div>
                <div className="credits">
                    <div className="author">
                        <span>Made by <a href="https://aaronson.org" rel="noreferrer noopener" target="_blank" className="link-border">Adam Aaronson</a></span>
                    </div>
                    <div className="social">
                        <a className="hover-fade" href="https://twitter.com/aaaronson" rel="noreferrer noopener" target="_blank"><i className="fab fa-twitter"></i></a>
                        <a className="hover-fade" href="https://github.com/adamaaronson/wordlisted" rel="noreferrer noopener" target="_blank"><i className="fab fa-github"></i></a>
                        <span className="coffee">Buy me a <a href="https://www.buymeacoffee.com/aaronson" rel="noreferrer noopener" target="_blank" className="link-border">coffee</a>!</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
