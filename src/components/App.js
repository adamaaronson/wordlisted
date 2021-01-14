import '../index.css';
import SearchArea from './SearchArea';

function App() {
  return (
    <div className="app">
      <div className="header-wrapper">
        <header className="header">
          <a href="/wordlisted" className="title">
            <i className="fas fa-file-alt title-logo"></i>
            <span className="title-text title-1">Word</span>
            <span className="title-text title-2">listed<sup>™</sup></span>
          </a>
          <div className="subtitle">Quick wordlist search tool</div>
          <div className="subsubtitle">
            <span className="author">by Adam Aaronson</span>
            <span className="accent"> • </span>
            <a href="https://aaronson.org" rel="noreferrer noopener" target="_blank" className="link-border">Aaronson.org</a>
            <span className="accent"> • </span>
            <a href="https://twitter.com/aaaronson" rel="noreferrer noopener" target="_blank"><i className="fab fa-twitter"></i></a>
          </div>
        </header>
        {/* <div className="sub-header">
          <i className="fas fa-fire-alt announcement-icon"></i>
          <span className="announcement">New stuff!</span>
        </div> */}
      </div>

      <SearchArea />

      <footer className="footer-wrapper">
        <p className="copyright-line">
          © {new Date().getFullYear()} Adam Aaronson • <a href="https://aaronson.org" rel="noreferrer noopener" target="_blank">Aaronson.org</a>
        </p>
        <p>
          Feedback or suggestions? Feel free to <a href="mailto:adamaaronson@gmail.com" className="link-border">email</a> or <a href="https://twitter.com/aaaronson" rel="noreferrer noopener" target="_blank" className="link-border">message</a> me!
        </p>
      </footer>
      
    </div>
  );
}

export default App;