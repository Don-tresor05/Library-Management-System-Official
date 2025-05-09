import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Library Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;