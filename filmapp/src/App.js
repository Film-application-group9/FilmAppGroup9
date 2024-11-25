import React from 'react';
import './App.css';
import MovieSearch from './components/MovieSearch.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FavoritesList from './screens/FavoritesList.js';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<MovieSearch />} />
          <Route path="/favorites" element={<FavoritesList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;