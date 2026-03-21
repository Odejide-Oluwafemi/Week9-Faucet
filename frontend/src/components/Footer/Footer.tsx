import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Femi Token Lab. Built for local testnet workflows.</p>
    </footer>
  );
};

export default Footer;
