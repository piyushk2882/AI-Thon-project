import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 w-full py-12 px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-bold text-slate-900 dark:text-white text-xl font-headline">The Ethereal Voyager</span>
          <p className="text-sm text-slate-500 font-light font-body">© 2024 The Ethereal Voyager. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link to="#" className="text-sm text-slate-500 font-light hover:text-indigo-400 underline underline-offset-4 transition-opacity duration-200 opacity-80 hover:opacity-100">Privacy Policy</Link>
          <Link to="#" className="text-sm text-slate-500 font-light hover:text-indigo-400 underline underline-offset-4 transition-opacity duration-200 opacity-80 hover:opacity-100">Terms of Service</Link>
          <Link to="#" className="text-sm text-slate-500 font-light hover:text-indigo-400 underline underline-offset-4 transition-opacity duration-200 opacity-80 hover:opacity-100">Cookie Settings</Link>
          <Link to="#" className="text-sm text-slate-500 font-light hover:text-indigo-400 underline underline-offset-4 transition-opacity duration-200 opacity-80 hover:opacity-100">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
