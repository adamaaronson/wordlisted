import React from 'react'
import '../css/Footer.scss'

export default function Footer() {
    return (
        <footer>
            <div className="copyright-line">
                © {new Date().getFullYear()} <a href="https://aaronson.org" rel="noreferrer noopener" target="_blank" className="hover-blue">Adam Aaronson</a>
            </div>
            <div className="feedback">
                Feedback or suggestions?
                Feel free to <a href="https://twitter.com/aaaronson" rel="noreferrer noopener" target="_blank" className="link-border hover-blue">message</a> or <a href="mailto:adamaaronson@gmail.com" className="link-border hover-blue">email</a> me!
            </div>
        </footer>
    )
}
