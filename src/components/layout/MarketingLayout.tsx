import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const MarketingLayout: React.FC = () => {
  const { isAuthenticated, signOut } = useAuth();
  const { language, setLanguage, translate } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/solution', label: 'Solution' },
    { path: '/pricing', label: 'Tarifs' },
    { path: '/about', label: 'À Propos' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <div id="marketing-container" className="min-h-screen bg-gray-950 text-white flex flex-col font-sans">
      {/* Navbar Top header */}
      <header id="marketing-header" className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo with Teranga Lion */}
          <Link to="/" id="logo-brand" className="flex items-center gap-2.5 active:scale-98 transition-all">
            <span className="text-3xl">🦁</span>
            <div>
              <span className="text-lg font-black tracking-tight bg-linear-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                MENU AFRICA
              </span>
              <span className="block text-[10px] text-gray-400 font-mono font-bold tracking-widest leading-none">
                PLATFORM V2
              </span>
            </div>
          </Link>

          {/* Regular Desktop Links navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-${link.path}`}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-orange-500 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop utility controls */}
          <div id="utility-block" className="hidden md:flex items-center gap-4">
            {/* Lang Button switcher */}
            <button
              id="lang-switch-btn"
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="h-10 px-3 bg-gray-900 border border-gray-800 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all active:scale-95"
            >
              🌐 {language.toUpperCase()}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  id="go-admin-btn"
                  onClick={() => navigate('/admin')}
                  className="h-10 px-4 rounded-xl bg-orange-600 font-medium hover:bg-orange-500 active:scale-95 transition-all text-sm"
                >
                  Dashboard Admin
                </button>
                <button
                  id="signout-marketing-btn"
                  onClick={() => signOut()}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white active:scale-95 transition-all text-xs"
                  title="Déconnexion"
                >
                  👋
                </button>
              </div>
            ) : (
              <button
                id="login-landing-btn"
                onClick={() => navigate('/auth')}
                className="h-10 px-5 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 active:scale-95 transition-all text-sm font-medium"
              >
                Espace Propriétaire
              </button>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <button
            id="mobile-hamb-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-gray-900 border border-gray-800 text-gray-400 active:scale-95 transition-all"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu container sliding */}
        {mobileMenuOpen && (
          <div id="mobile-menu-pane" className="md:hidden border-t border-gray-900 bg-gray-950 px-4 py-4 space-y-3 shadow-2xl animate-fade-in">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                id={`mob-nav-${link.path}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-gray-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-900 flex flex-col gap-3">
              <button
                id="mob-lang-btn"
                onClick={() => {
                  setLanguage(language === 'fr' ? 'en' : 'fr');
                  setMobileMenuOpen(false);
                }}
                className="h-12 w-full text-left px-4 rounded-xl bg-gray-900 border border-gray-800 text-sm font-bold flex items-center justify-between"
              >
                <span>Changer la langue</span>
                <span className="text-orange-500">🌐 {language.toUpperCase()}</span>
              </button>
              {isAuthenticated ? (
                <>
                  <button
                    id="mob-admin-btn"
                    onClick={() => {
                      navigate('/admin');
                      setMobileMenuOpen(false);
                    }}
                    className="h-12 w-full rounded-xl bg-orange-600 hover:bg-orange-500 font-bold"
                  >
                    Espace Admin
                  </button>
                  <button
                    id="mob-signout-btn"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="h-12 w-full rounded-xl bg-gray-900 border border-gray-800 text-red-400 hover:bg-red-500/10"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  id="mob-login-btn"
                  onClick={() => {
                    navigate('/auth');
                    setMobileMenuOpen(false);
                  }}
                  className="h-12 w-full rounded-xl bg-gray-900 border border-gray-800 font-bold"
                >
                  Se Connecter
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main output wrapper viewport */}
      <main id="marketing-viewport" className="flex-1">
        <Outlet />
      </main>

      {/* Fine Footer banner section */}
      <footer id="marketing-footer" className="border-t border-gray-900 bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>🦁</span>
            <span className="font-bold text-gray-300">Menu Africa V2</span>
            <span>— © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link to="/terms" id="foot-terms" className="hover:text-gray-300 transition-colors">CGU & Conditions</Link>
            <Link to="/privacy" id="foot-privacy" className="hover:text-gray-300 transition-colors">Politique de Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
