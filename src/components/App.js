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
            <span className="author">by <a href="https://aaronson.org" rel="noreferrer noopener" target="_blank" className="link-border">Adam Aaronson</a></span>
            <span className="accent"> • </span>
            <a href="https://twitter.com/aaaronson" rel="noreferrer noopener" target="_blank"><i className="fab fa-twitter"></i></a>
            <span className="accent"> • </span>
            <a href="https://www.buymeacoffee.com/aaronson" rel="noreferrer noopener" target="_blank" className="link-border">Buy me a coffee!</a>
          </div>
        </header>
        <br/>
        <div className="sub-header">
            <i className="fas fa-fire-alt announcement-icon"></i>
            <span className="announcement">Loads of search modes!</span>
        </div>
      </div>

      <SearchArea />

      <footer className="footer-wrapper">
        <p className="copyright-line">
          © {new Date().getFullYear()} Adam Aaronson • <a href="https://aaronson.org" rel="noreferrer noopener" target="_blank">Aaronson.org</a> • <a href="https://twitter.com/aaaronson" rel="noreferrer noopener" target="_blank"><i className="fab fa-twitter"></i></a> • <a href="https://github.com/adamaaronson/wordlisted" rel="noreferrer noopener" target="_blank"><i className="fab fa-github"></i></a>
        </p>
        <p>
          Feedback or suggestions? Feel free to <a href="https://twitter.com/aaaronson" rel="noreferrer noopener" target="_blank" className="link-border">message</a> or <a href="mailto:adamaaronson@gmail.com" className="link-border">email</a> me!
        </p>
      </footer>
      
    </div>
  );
}

export default App;
