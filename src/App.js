import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './Header';
import Main from "./views/Main";
import CurrentGeoLocation from './views/CurrentGeoLocation';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={ <Main /> } exact={true} />
        <Route path="/currentplace" element={ <CurrentGeoLocation /> } />
      </Routes>
    </div>
  );
}

export default App;


