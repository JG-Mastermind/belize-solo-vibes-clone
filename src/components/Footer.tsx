
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">BV</span>
              </div>
              <span className="font-playfair font-bold text-xl">BelizeVibes</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Your trusted partner for unforgettable Belize adventures. Specializing in solo-friendly, sustainable travel experiences that connect you with nature and culture.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-playfair font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/adventures" className="text-slate-300 hover:text-green-400 transition-colors">Adventures</a></li>
              <li><a href="#about" className="text-slate-300 hover:text-green-400 transition-colors">About Us</a></li>
              <li><a href="/adventures#testimonials" className="text-slate-300 hover:text-green-400 transition-colors">Reviews</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">Solo Travel Guide</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">Safety Information</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Popular Adventures */}
          <div className="space-y-4">
            <h3 className="font-playfair font-semibold text-lg">Popular Adventures</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">Cave Tubing</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">Blue Hole Diving</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">Maya Ruins Tours</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">Snorkeling Tours</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">Jungle Zip-lining</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">Wildlife Watching</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-playfair font-semibold text-lg">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-slate-300">
                  <div>San Pedro, Ambergris Caye</div>
                  <div>Belize, Central America</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">+501-XXX-XXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">hello@belizevibes.com</span>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-sm font-semibold mb-3">We're Certified</h4>
              <div className="flex space-x-2">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-slate-800">ATOL</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-slate-800">ABTOT</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-slate-800">ECO</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-slate-400">
            © 2024 BelizeVibes. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
