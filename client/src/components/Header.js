import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">PDFSnip</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/merge">Merge PDFs</Link>
        <Link to="/split">Split PDF</Link>
      </nav>
    </header>
  );
}

export default Header;