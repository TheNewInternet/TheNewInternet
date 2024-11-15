import React, { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { SearchBar } from '../components/SearchBar';



export default function App() {
  const [url, setUrl] = useState('');

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', url);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <SearchBar
              url={url}
              onUrlChange={handleUrlChange}
              onSearch={handleSearch}
            />
          }
        />
      </Routes>
    </Router>
  );
}
