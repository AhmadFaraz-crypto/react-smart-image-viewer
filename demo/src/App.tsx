import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { HomePage } from './pages/HomePage';
import { DocumentationPage } from './pages/DocumentationPage';
import { DemosPage } from './pages/DemosPage';
import 'react-smart-image-viewer/styles.css';

export const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/demos" element={<DemosPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

