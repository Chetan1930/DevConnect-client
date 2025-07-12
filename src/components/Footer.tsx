import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center py-4 text-sm text-gray-500 bg-gray-100">
      © {new Date().getFullYear()} All rights reserved —{' '}
      <a
        href="https://www.linkedin.com/in/chetan71/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Chetan Chauhan
      </a>
    </footer>
  );
};

export default Footer;
