import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Femi Token DApp. Built for Web3Bridge 🌟.</p>
    </footer>
  );
};

export default Footer;
