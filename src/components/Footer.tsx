
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation(['footer', 'common']);
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
              {t('footer:company.description')}
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
            <h3 className="font-playfair font-semibold text-lg">{t('footer:sections.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/adventures" className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:quickLinks.adventures')}</a></li>
              <li><a href="#about" className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:quickLinks.aboutUs')}</a></li>
              <li><a href="/adventures#testimonials" className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:quickLinks.reviews')}</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:quickLinks.soloTravelGuide')}</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:quickLinks.safetyInformation')}</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:quickLinks.faq')}</a></li>
            </ul>
          </div>

          {/* Popular Adventures */}
          <div className="space-y-4">
            <h3 className="font-playfair font-semibold text-lg">{t('footer:sections.popularAdventures')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:adventures.caveTubing')}</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:adventures.blueHoleDiving')}</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:adventures.mayaRuinsTours')}</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:adventures.snorkelingTours')}</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:adventures.jungleZiplining')}</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:adventures.wildlifeWatching')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-playfair font-semibold text-lg">{t('footer:sections.contactUs')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-slate-300">
                  <div>{t('footer:contact.address1')}</div>
                  <div>{t('footer:contact.address2')}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">{t('footer:contact.phone')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">{t('footer:contact.email')}</span>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-sm font-semibold mb-3">{t('footer:sections.certified')}</h4>
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
{t('footer:legal.copyright')}
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">{t('footer:legal.privacyPolicy')}</a>
            <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">{t('footer:legal.termsOfService')}</a>
            <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">{t('footer:legal.cookiePolicy')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
