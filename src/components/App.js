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
            <a href="https://aaronson.org" className="link-border">Aaronson.org</a>
            <span className="accent"> • </span>
            <a href="https://twitter.com/aaaronson"><i className="fab fa-twitter"></i></a>
          </div>
        </header>
        {/* <div className="sub-header">
          <i className="fas fa-fire-alt announcement-icon"></i>
          <span className="announcement">New stuff!</span>
        </div> */}
      </div>

      <SearchArea />

      <footer className="footer">
        © {new Date().getFullYear()} Adam Aaronson • <a href="https://aaronson.org">Aaronson.org</a>
      </footer>
      
    </div>
  );
}

export default App;
