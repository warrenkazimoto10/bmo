import React, { useState } from 'react';
import './BmoLogin.css';
import db from './data/db.json';

const LOGO_URL = 'https://b-mosgrp-parts-vsr.vercel.app/img/bnp-alone.png';

export default function BmoLogin({ onLogin }) {
  const [cardNumber, setCardNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberCard, setRememberCard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const user = db.users.find(
      u => (u.cardNumber === cardNumber || u.username === cardNumber) && u.password === password
    );
    if (user) {
      onLogin(user);
    } else {
      setError('Numéro de carte ou mot de passe incorrect.');
    }
  };

  return (
    <div className="bmo-container">
      {/* Top Header */}
      <header className="bmo-header">
        <div className="bmo-header-content">
          <div className="bmo-logo">
            <span className="bmo-logo-text">BMO</span>
            <img src={LOGO_URL} alt="BMO" className="bmo-logo-img" />
          </div>
          <div className="bmo-header-actions">
            <button className="bmo-header-icon" title="Localisateur" aria-label="Localisateur">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </button>
            <button className="bmo-header-icon" title="Aide" aria-label="Aide">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
            <button 
              className="bmo-lang-btn" 
              onClick={() => setLanguage(language === 'EN' ? 'FR' : 'EN')}
            >
              {language}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="bmo-main">
        {/* Page Title */}
        <h1 className="bmo-title">
          <svg className="bmo-lock-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0075BE" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Ouverture de session
        </h1>

        <div className="bmo-grid">
          {/* Left Column: Form Card */}
          <div className="bmo-card bmo-form-card">
            <form onSubmit={handleSubmit}>
              {error && <div className="bmo-error">{error}</div>}
              <div className="bmo-field">
                <label htmlFor="cardNumber" className="bmo-label">
                  Numéro de carte ou code d'utilisateur
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  className="bmo-input"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>

              <div className="bmo-checkbox-field">
                <label className="bmo-checkbox-label">
                  <input
                    type="checkbox"
                    className="bmo-checkbox"
                    checked={rememberCard}
                    onChange={(e) => setRememberCard(e.target.checked)}
                  />
                  <span>Enregistrer mon numéro de carte ou mon code d'utilisateur</span>
                </label>
                <button type="button" className="bmo-info-btn" title="Plus d'informations">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0075BE" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </button>
              </div>

              <div className="bmo-field">
                <label htmlFor="password" className="bmo-label">
                  Mot de passe
                </label>
                <div className="bmo-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="bmo-input bmo-input-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="bmo-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Afficher ou masquer le mot de passe"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0075BE" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                      {!showPassword && (
                        <line x1="1" y1="1" x2="23" y2="23" stroke="#0075BE" strokeWidth="2" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bmo-forgot-link-wrapper">
                <a href="#forgot" className="bmo-forgot-link">
                  Vous avez oublié votre mot de passe ou votre code d'utilisateur?
                </a>
              </div>

              <div className="bmo-submit-wrapper">
                <button type="submit" className="bmo-btn-primary">
                  OUVERTURE DE SESSION
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Info Cards */}
          <div className="bmo-sidebar">
            {/* Register Card */}
            <div className="bmo-card bmo-info-card">
              <h2 className="bmo-card-title">
                Enregistrer une nouvelle carte pour les Services bancaires en ligne
              </h2>
              <p className="bmo-card-links">
                <a href="#debit" className="bmo-link-bold">CARTE DE DÉBIT</a>
                <span className="bmo-link-separator">ou</span>
                <a href="#credit" className="bmo-link-bold">CARTE DE CRÉDIT</a>
              </p>
            </div>

            {/* Security Card */}
            <div className="bmo-card bmo-info-card">
              <div className="bmo-security-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#002B49" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <h2 className="bmo-security-title">Votre sécurité passe avant tout.</h2>
              </div>
              <p className="bmo-security-text">
                Nous avons rendu les Services bancaires en ligne plus pratiques, tout en conservant l'utilisation de technologies de sécurité de pointe qui protègent votre argent et vos renseignements.
              </p>
              <a href="#security" className="bmo-external-link">
                Apprenez-en plus sur la façon dont nous vous protégeons.
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bmo-footer">
        <div className="bmo-footer-content">
          <nav className="bmo-footer-links">
            <a href="#legal">
              Mentions légales
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <a href="#privacy">
              Confidentialité
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <a href="#security">
              Sécurité
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <a href="#accessibility">
              Accessibilité
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </nav>

          <div className="bmo-footer-right">
            <a href="#sadc" className="bmo-sadc-link">
              Information SADC
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <div className="bmo-sadc-badge">
              <span>sadc</span>
              <span className="bmo-sadc-dot">•</span>
              <span>cdic</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
