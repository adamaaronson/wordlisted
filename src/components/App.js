import '../css/App.scss';
import SearchArea from './SearchArea';
import Header from './Header';

function App() {
  return (
    <div className="content">
      <Header />

      <SearchArea />

      {/* <footer className="footer-wrapper">
        <p className="copyright-line">
          © {new Date().getFullYear()} Adam Aaronson • <a href="https://aaronson.org" rel="noreferrer noopener" target="_blank">Aaronson.org</a> • <a href="https://twitter.com/aaaronson" rel="noreferrer noopener" target="_blank"><i className="fab fa-twitter"></i></a> • <a href="https://github.com/adamaaronson/wordlisted" rel="noreferrer noopener" target="_blank"><i className="fab fa-github"></i></a>
        </p>
        <p>
          Feedback or suggestions? Feel free to <a href="https://twitter.com/aaaronson" rel="noreferrer noopener" target="_blank" className="link-border">message</a> or <a href="mailto:adamaaronson@gmail.com" className="link-border">email</a> me!
        </p>
      </footer> */}
    </div>
  );
}

export default App;
