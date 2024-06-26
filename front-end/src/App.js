
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './webPages/HomePage';
import UploadPage from './webPages/UploadPage';
import AwaitPage from './webPages/AwaitPage';
import PreviewPage from './webPages/PreviewPage';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/await" element={<AwaitPage />} />
          <Route path="/preview" element={<PreviewPage />} />
        </Routes>
    </Router>
  );
}

export default App;
