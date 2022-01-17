import '../css/App.scss';
import SearchArea from './SearchArea';
import Header from './Header';
import Footer from './Footer';

function App() {
  return (
    <div className="content">
      <Header />

      <SearchArea />

      <Footer />
    </div>
  );
}

export default App;
