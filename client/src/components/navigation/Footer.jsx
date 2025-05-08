import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import Logo from '../common/Logo.jsx';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center">
              <Logo className="h-10 w-10" />
              <span className="ml-2 text-lg font-bold text-primary">DebateHub</span>
            </Link>
            <p className="mt-4 text-sm text-neutral-600">
              An interactive platform for hosting and participating in structured debates on various topics.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-neutral-500 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-neutral-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/debates" className="text-sm text-neutral-600 hover:text-primary">
                  Browse Debates
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-sm text-neutral-600 hover:text-primary">
                  Debate Schedule
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-sm text-neutral-600 hover:text-primary">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-neutral-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-neutral-600 hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-neutral-800 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-neutral-600 hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-neutral-600 hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-neutral-600 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-neutral-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-neutral-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-neutral-800 mb-4">Stay Updated</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Subscribe to our newsletter to get updates on new debates and features.
            </p>
            <form className="space-y-2">
              <div>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="input text-sm"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-neutral-200 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-neutral-500">
            &copy; {currentYear} DebateHub. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <Link to="/terms" className="text-xs text-neutral-500 hover:text-primary">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-xs text-neutral-500 hover:text-primary">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-xs text-neutral-500 hover:text-primary">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;