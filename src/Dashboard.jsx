import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import './Dashboard.css';

const LOGO_URL = 'https://b-mosgrp-parts-vsr.vercel.app/img/bnp-alone.png';

// ── i18n ──
const translations = {
  fr: {
    greeting_morning: 'Bonjour', greeting_afternoon: 'Bon après-midi', greeting_evening: 'Bonsoir',
    days: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
    months: ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
    monthsShort: ['Jan','Fév','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc'],
    today: "Aujourd'hui", yesterday: 'Hier',
    lastLogin: 'Dernière connexion',
    secureConnection: 'Connexion sécurisée...',
    // Tabs
    tabSolde: 'Solde', tabHistorique: 'Historique', tabVirement: 'Virement', tabCartes: 'Cartes', tabRib: 'RIB',
    // Solde
    totalBalance: 'Solde total', blocked: 'Bloqué', available: 'Disponible',
    payBills: 'Payer\nfactures', transfer: 'Virement', globalView: 'Vue\nglobale',
    accountSummary: 'Résumé des comptes', deposits: 'Dépôts', investments: 'Investissements',
    accountBlocked: 'Compte bloqué — Opérations suspendues',
    // Historique
    search: 'Rechercher...', allAccounts: 'Tous les comptes', noTransaction: 'Aucune transaction trouvée',
    // Transaction detail
    date: 'Date', account: 'Compte', type: 'Type', reference: 'Référence', status: 'Statut',
    credit: 'Crédit', debit: 'Débit', executed: 'Exécutée', close: 'Fermer',
    // Virement
    beneficiaries: 'Bénéficiaires', add: 'Ajouter', noBeneficiary: 'Aucun bénéficiaire',
    addBeneficiaryHint: 'Ajoutez un bénéficiaire pour effectuer un virement',
    newBeneficiary: 'Nouveau bénéficiaire', back: 'Retour',
    fullName: 'Nom complet', email: 'Adresse email', iban: 'IBAN', bic: 'BIC / SWIFT', bank: 'Banque',
    addBeneficiaryBtn: 'Ajouter le bénéficiaire',
    newTransfer: 'Nouveau virement', sourceAccount: 'Compte source',
    amount: 'Montant', balance: 'Solde', reason: 'Motif (optionnel)',
    confirmTransfer: 'Confirmer le virement',
    // Cards
    debitVisa: 'Débit Visa', cardHolder: 'Titulaire', expires: 'Expire',
    cardNumber: 'Numéro de carte', expiryDate: "Date d'expiration", cardStatus: 'Statut',
    active: 'Active', frozen: 'Gelée', frozenCard: 'Carte gelée',
    showNumber: 'Afficher n°', hideNumber: 'Masquer n°',
    freezeCard: 'Geler carte', unfreezeCard: 'Dégeler carte',
    lostStolen: 'Perte / Vol', pinCode: 'Code PIN',
    contactless: 'Paiement sans contact', onlinePayments: 'Paiements en ligne', atmWithdrawals: 'Retraits DAB',
    cardLimits: 'Plafonds de la carte',
    monthlyPayment: 'Paiement mensuel', weeklyWithdrawal: 'Retrait hebdomadaire', onlinePayment: 'Paiement en ligne',
    reportLostTitle: 'Déclarer une perte ou un vol',
    reportLostText1: 'Si votre carte a été perdue ou volée, vous devez faire opposition immédiatement pour bloquer toute utilisation frauduleuse.',
    reportLostText2ending: 'sera bloquée définitivement et une nouvelle carte vous sera envoyée sous 5 à 7 jours ouvrés.',
    oppositionService: "Service d'opposition 24h/24 :",
    opposeNow: 'Faire opposition maintenant', cancel: 'Annuler',
    // Toasts
    numberHidden: 'Numéro masqué', numberShown: 'Numéro affiché',
    cardFrozen: 'Carte gelée', cardUnfrozen: 'Carte dégelée',
    contactlessOn: 'Sans contact activé', contactlessOff: 'Sans contact désactivé',
    onlineOn: 'Paiements en ligne activés', onlineOff: 'Paiements en ligne désactivés',
    dabOn: 'Retraits DAB activés', dabOff: 'Retraits DAB désactivés',
    // Profile / Settings
    myProfile: 'Mon profil', settings: 'Paramètres', logout: 'Déconnexion',
    notifications: 'Notifications',
    // Blocked
    accountTempBlocked: 'Compte temporairement bloqué', blockedAmount: 'Montant bloqué',
    ref: 'Réf', yourAdvisor: 'Votre conseiller', call: 'Appeler', write: 'Écrire',
    understood: "J'ai compris",
    transferDenied: 'Virement refusé',
    transferDeniedText1: "n'a pas pu être exécuté.",
    transferDeniedText2: 'Votre compte fait l\'objet d\'une restriction temporaire. Toutes les opérations sortantes sont suspendues jusqu\'à nouvel ordre.',
    beneficiary: 'Bénéficiaire', statusLabel: 'Statut', denied: 'Refusé',
    emailNotifSent: 'Un email de notification a été envoyé à',
    unblockContact: 'Pour débloquer votre compte, contactez :',
    // Account detail
    accountBalance: 'Solde du compte', fundsBlocked: 'Fonds bloqués',
    lastOperations: 'Dernières opérations', noOperation: 'Aucune opération',
    checking: 'Chèque', savings: 'Épargne', investment: 'Investissement',
    number: 'Numéro',
    // Notifs
    accountBlockedNotif: 'Compte bloqué', connectionDetected: 'Connexion détectée',
    transferBlockedNotif: 'Virement bloqué', securityUpdate: 'Mise à jour de sécurité',
    statementReady: 'Relevé disponible',
    // RIB
    ribTitle: "Relevé d'Identité Bancaire",
    holder: 'Titulaire', bankName: 'Banque', accountNumber: 'N° de compte',
    ribKey: 'Clé RIB', bankCode: 'Code banque', branchCode: 'Code guichet',
    branchAddress: 'Adresse agence',
    // Vue globale
    totalWealth: 'Patrimoine total', distribution: 'Répartition',
    // Settings page
    settingsTitle: 'Paramètres', language: 'Langue', french: 'Français', english: 'English',
    security: 'Sécurité', changePassword: 'Changer le mot de passe',
    biometric: 'Authentification biométrique', twoFactor: 'Vérification en 2 étapes',
    notifPrefs: 'Préférences de notifications', pushNotifs: 'Notifications push',
    emailNotifs: 'Notifications email', about: 'À propos',
    version: 'Version', terms: 'Conditions générales', privacy: 'Politique de confidentialité',
    deleteConfirm: 'Supprimer ?', yes: 'Oui', no: 'Non',
    cardEndingWith: 'Votre carte se terminant par',
  },
  en: {
    greeting_morning: 'Good morning', greeting_afternoon: 'Good afternoon', greeting_evening: 'Good evening',
    days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    today: 'Today', yesterday: 'Yesterday',
    lastLogin: 'Last login',
    secureConnection: 'Secure connection...',
    tabSolde: 'Balance', tabHistorique: 'History', tabVirement: 'Transfer', tabCartes: 'Cards', tabRib: 'RIB',
    totalBalance: 'Total balance', blocked: 'Blocked', available: 'Available',
    payBills: 'Pay\nbills', transfer: 'Transfer', globalView: 'Global\nview',
    accountSummary: 'Account summary', deposits: 'Deposits', investments: 'Investments',
    accountBlocked: 'Account blocked — Operations suspended',
    search: 'Search...', allAccounts: 'All accounts', noTransaction: 'No transactions found',
    date: 'Date', account: 'Account', type: 'Type', reference: 'Reference', status: 'Status',
    credit: 'Credit', debit: 'Debit', executed: 'Executed', close: 'Close',
    beneficiaries: 'Beneficiaries', add: 'Add', noBeneficiary: 'No beneficiary',
    addBeneficiaryHint: 'Add a beneficiary to make a transfer',
    newBeneficiary: 'New beneficiary', back: 'Back',
    fullName: 'Full name', email: 'Email address', iban: 'IBAN', bic: 'BIC / SWIFT', bank: 'Bank',
    addBeneficiaryBtn: 'Add beneficiary',
    newTransfer: 'New transfer', sourceAccount: 'Source account',
    amount: 'Amount', balance: 'Balance', reason: 'Reason (optional)',
    confirmTransfer: 'Confirm transfer',
    debitVisa: 'Visa Debit', cardHolder: 'Holder', expires: 'Expires',
    cardNumber: 'Card number', expiryDate: 'Expiry date', cardStatus: 'Status',
    active: 'Active', frozen: 'Frozen', frozenCard: 'Card frozen',
    showNumber: 'Show n°', hideNumber: 'Hide n°',
    freezeCard: 'Freeze card', unfreezeCard: 'Unfreeze card',
    lostStolen: 'Lost / Stolen', pinCode: 'PIN Code',
    contactless: 'Contactless payment', onlinePayments: 'Online payments', atmWithdrawals: 'ATM withdrawals',
    cardLimits: 'Card limits',
    monthlyPayment: 'Monthly payment', weeklyWithdrawal: 'Weekly withdrawal', onlinePayment: 'Online payment',
    reportLostTitle: 'Report lost or stolen card',
    reportLostText1: 'If your card has been lost or stolen, you must block it immediately to prevent fraudulent use.',
    reportLostText2ending: 'will be permanently blocked and a new card will be sent within 5 to 7 business days.',
    oppositionService: '24/7 Opposition service:',
    opposeNow: 'Block card now', cancel: 'Cancel',
    numberHidden: 'Number hidden', numberShown: 'Number shown',
    cardFrozen: 'Card frozen', cardUnfrozen: 'Card unfrozen',
    contactlessOn: 'Contactless enabled', contactlessOff: 'Contactless disabled',
    onlineOn: 'Online payments enabled', onlineOff: 'Online payments disabled',
    dabOn: 'ATM withdrawals enabled', dabOff: 'ATM withdrawals disabled',
    myProfile: 'My profile', settings: 'Settings', logout: 'Log out',
    notifications: 'Notifications',
    accountTempBlocked: 'Account temporarily blocked', blockedAmount: 'Blocked amount',
    ref: 'Ref', yourAdvisor: 'Your advisor', call: 'Call', write: 'Write',
    understood: 'I understand',
    transferDenied: 'Transfer denied',
    transferDeniedText1: 'could not be executed.',
    transferDeniedText2: 'Your account is temporarily restricted. All outgoing operations are suspended until further notice.',
    beneficiary: 'Beneficiary', statusLabel: 'Status', denied: 'Denied',
    emailNotifSent: 'A notification email has been sent to',
    unblockContact: 'To unblock your account, contact:',
    accountBalance: 'Account balance', fundsBlocked: 'Funds blocked',
    lastOperations: 'Last operations', noOperation: 'No operations',
    checking: 'Checking', savings: 'Savings', investment: 'Investment',
    number: 'Number',
    accountBlockedNotif: 'Account blocked', connectionDetected: 'Connection detected',
    transferBlockedNotif: 'Transfer blocked', securityUpdate: 'Security update',
    statementReady: 'Statement available',
    ribTitle: 'Bank Account Details',
    holder: 'Holder', bankName: 'Bank', accountNumber: 'Account n°',
    ribKey: 'RIB key', bankCode: 'Bank code', branchCode: 'Branch code',
    branchAddress: 'Branch address',
    totalWealth: 'Total wealth', distribution: 'Distribution',
    settingsTitle: 'Settings', language: 'Language', french: 'Français', english: 'English',
    security: 'Security', changePassword: 'Change password',
    biometric: 'Biometric authentication', twoFactor: '2-step verification',
    notifPrefs: 'Notification preferences', pushNotifs: 'Push notifications',
    emailNotifs: 'Email notifications', about: 'About',
    version: 'Version', terms: 'Terms of service', privacy: 'Privacy policy',
    deleteConfirm: 'Delete?', yes: 'Yes', no: 'No',
    cardEndingWith: 'Your card ending in',
  },
};

const LangContext = createContext('fr');
function useLang() {
  const lang = useContext(LangContext);
  const t = translations[lang] || translations.fr;
  return { lang, t };
}

function getGreeting(lang) {
  const t = translations[lang] || translations.fr;
  const h = new Date().getHours();
  if (h < 12) return t.greeting_morning;
  if (h < 18) return t.greeting_afternoon;
  return t.greeting_evening;
}

function formatDate(lang) {
  const t = translations[lang] || translations.fr;
  const d = new Date();
  return `${t.days[d.getDay()]} ${d.getDate()} ${t.months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatCurrency(n) {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 }).format(n);
}

function formatSmartDate(dateStr, lang) {
  const t = translations[lang] || translations.fr;
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((today - target) / 86400000);
  if (diff === 0) return t.today;
  if (diff === 1) return t.yesterday;
  if (diff < 7) return t.days[d.getDay()];
  return `${d.getDate()} ${t.monthsShort[d.getMonth()]}`;
}

function formatTransDate(dateStr, lang) {
  const t = translations[lang] || translations.fr;
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${t.monthsShort[d.getMonth()]}`;
}

function formatFullDate(dateStr, lang) {
  const t = translations[lang] || translations.fr;
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${t.months[d.getMonth()]} ${d.getFullYear()}`;
}

function getTransIcon(desc) {
  const d = desc.toLowerCase();
  if (d.includes('salaire') || d.includes('dépôt') || d.includes('virement entrant')) return { emoji: '💰', bg: '#e8f5e9' };
  if (d.includes('épicerie') || d.includes('metro') || d.includes('iga')) return { emoji: '🛒', bg: '#fff3e0' };
  if (d.includes('hydro') || d.includes('bell') || d.includes('électri')) return { emoji: '⚡', bg: '#fff8e1' };
  if (d.includes('amazon')) return { emoji: '📦', bg: '#e3f2fd' };
  if (d.includes('tim hortons') || d.includes('café')) return { emoji: '☕', bg: '#efebe9' };
  if (d.includes('netflix') || d.includes('spotify')) return { emoji: '🎬', bg: '#fce4ec' };
  if (d.includes('pétro') || d.includes('essence')) return { emoji: '⛽', bg: '#f3e5f5' };
  if (d.includes('pharmaprix')) return { emoji: '💊', bg: '#e8eaf6' };
  if (d.includes('virement')) return { emoji: '🔄', bg: '#e0f2f1' };
  if (d.includes('hypothèque') || d.includes('loyer') || d.includes('crédit hypo')) return { emoji: '🏠', bg: '#e8f5e9' };
  if (d.includes('assurance')) return { emoji: '🛡️', bg: '#e8eaf6' };
  if (d.includes('placement') || d.includes('investissement') || d.includes('fonds')) return { emoji: '📈', bg: '#e8f5e9' };
  if (d.includes('rendement') || d.includes('dividende') || d.includes('intérêt')) return { emoji: '💹', bg: '#e8f5e9' };
  if (d.includes('frais')) return { emoji: '🏦', bg: '#fafafa' };
  return { emoji: '📄', bg: '#f5f5f5' };
}

const RibIcons = {
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0075be" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  bank: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0075be" strokeWidth="2"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M12 3l9 7H3l9-7z"/><path d="M5 10v11"/><path d="M19 10v11"/><path d="M9 10v11"/><path d="M14 10v11"/></svg>,
  hash: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0075be" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
  key: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0075be" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zM15.5 7.5l2 2L21 6l-3-3"/></svg>,
  building: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0075be" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
  pin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0075be" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  globe: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0075be" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  link: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0075be" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  mail: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0075be" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

// ── Notification Center ──
function NotificationCenter({ user, onClose, onShowBlock }) {
  const { lang, t } = useLang();
  const notifications = [
    { id: 1, type: 'alert', title: t.accountBlockedNotif, desc: lang === 'fr' ? `Restriction active depuis le ${formatFullDate(user.blockDate, lang)}. Contactez votre conseiller.` : `Active restriction since ${formatFullDate(user.blockDate, lang)}. Contact your advisor.`, time: '2h', unread: true },
    { id: 2, type: 'security', title: t.connectionDetected, desc: lang === 'fr' ? `Nouvelle connexion depuis Montréal, QC — ${new Date().toLocaleDateString('fr-CA')}` : `New connection from Montréal, QC — ${new Date().toLocaleDateString('en-CA')}`, time: '3h', unread: true },
    { id: 3, type: 'transfer', title: t.transferBlockedNotif, desc: lang === 'fr' ? 'Tentative de virement sortant refusée. Opérations suspendues.' : 'Outgoing transfer attempt denied. Operations suspended.', time: '1j', unread: false },
    { id: 4, type: 'info', title: t.securityUpdate, desc: lang === 'fr' ? 'Votre mot de passe a été modifié avec succès.' : 'Your password has been changed successfully.', time: '3j', unread: false },
    { id: 5, type: 'info', title: t.statementReady, desc: lang === 'fr' ? 'Votre relevé mensuel de octobre 2026 est prêt.' : 'Your October 2026 monthly statement is ready.', time: '5j', unread: false },
  ];
  const getIcon = (type) => {
    if (type === 'alert') return <div className="notif-icon notif-icon-alert"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>;
    if (type === 'security') return <div className="notif-icon notif-icon-security"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>;
    if (type === 'transfer') return <div className="notif-icon notif-icon-transfer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></div>;
    return <div className="notif-icon notif-icon-info"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div>;
  };
  return (
    <div className="bs-overlay" onClick={onClose}>
      <div className="bs-sheet" onClick={e => e.stopPropagation()}>
        <div className="bs-handle" />
        <div className="db-modal-header">
          <h3>{t.notifications}</h3>
          <button className="db-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="notif-list">
          {notifications.map(n => (
            <div key={n.id} className={`notif-row ${n.unread ? 'unread' : ''}`} onClick={() => { if (n.type === 'alert') { onClose(); onShowBlock(); } }}>
              {getIcon(n.type)}
              <div className="notif-content">
                <div className="notif-title">{n.title}{n.unread && <span className="notif-badge" />}</div>
                <div className="notif-desc">{n.desc}</div>
              </div>
              <span className="notif-time">{n.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Transaction Detail Sheet ──
function TransactionDetail({ transaction, account, onClose }) {
  const { lang, t } = useLang();
  const ic = getTransIcon(transaction.description);
  return (
    <div className="bs-overlay" onClick={onClose}>
      <div className="bs-sheet" onClick={e => e.stopPropagation()}>
        <div className="bs-handle" />
        <div className="td-header">
          <div className="td-icon" style={{ background: ic.bg }}>{ic.emoji}</div>
          <div className="td-title">{transaction.description}</div>
          <div className={`td-amount ${transaction.amount > 0 ? 'credit' : 'debit'}`}>
            {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
          </div>
        </div>
        <div className="td-rows">
          <div className="td-row"><span>{t.date}</span><strong>{formatFullDate(transaction.date, lang)}</strong></div>
          <div className="td-row"><span>{t.account}</span><strong>{account}</strong></div>
          <div className="td-row"><span>{t.type}</span><strong>{transaction.amount > 0 ? t.credit : t.debit}</strong></div>
          <div className="td-row"><span>{t.reference}</span><strong>TXN-{String(transaction.id).padStart(6, '0')}</strong></div>
          <div className="td-row"><span>{t.status}</span><span className="td-status-done">{t.executed}</span></div>
        </div>
        <button className="bs-dismiss" onClick={onClose}>{t.close}</button>
      </div>
    </div>
  );
}

// ── Logout Confirmation ──
function LogoutConfirm({ user, onConfirm, onCancel, onOpenSettings }) {
  const { t } = useLang();
  return (
    <div className="bs-overlay" onClick={onCancel}>
      <div className="bs-sheet bs-sheet-mini" onClick={e => e.stopPropagation()}>
        <div className="bs-handle" />
        <div className="logout-profile">
          <div className="logout-avatar">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</div>
          <div className="logout-name">{user.firstName} {user.lastName}</div>
          <div className="logout-email">{user.email}</div>
        </div>
        <div className="logout-menu">
          <button className="logout-menu-item" onClick={onCancel}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {t.myProfile}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" style={{marginLeft:'auto'}}><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <button className="logout-menu-item" onClick={onOpenSettings}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            {t.settings}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" style={{marginLeft:'auto'}}><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <button className="logout-menu-item logout-menu-danger" onClick={onConfirm}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {t.logout}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Virtual Bank Card ──
function BankCard({ user }) {
  const { t } = useLang();
  return (
    <div className="vcard">
      <div className="vcard-bg">
        <div className="vcard-top">
          <img src={LOGO_URL} alt="BMO" className="vcard-logo" />
          <span className="vcard-type">{t.debitVisa}</span>
        </div>
        <div className="vcard-chip">
          <svg width="32" height="24" viewBox="0 0 32 24"><rect x="1" y="1" width="30" height="22" rx="3" fill="#c9a84c" stroke="#b8972e" strokeWidth="1"/><line x1="1" y1="8" x2="31" y2="8" stroke="#b8972e" strokeWidth=".7"/><line x1="1" y1="16" x2="31" y2="16" stroke="#b8972e" strokeWidth=".7"/><line x1="11" y1="1" x2="11" y2="23" stroke="#b8972e" strokeWidth=".7"/><line x1="21" y1="1" x2="21" y2="23" stroke="#b8972e" strokeWidth=".7"/></svg>
        </div>
        <div className="vcard-number">•••• •••• •••• {user.cardNumber.slice(-4)}</div>
        <div className="vcard-bottom">
          <div>
            <div className="vcard-label">{t.cardHolder}</div>
            <div className="vcard-holder">{user.firstName} {user.lastName}</div>
          </div>
          <div>
            <div className="vcard-label">{t.expires}</div>
            <div className="vcard-expiry">12/28</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Blocked Account Bottom Sheet ──
function BlockedSheet({ user, onDismiss }) {
  const { t } = useLang();
  return (
    <div className="bs-overlay" onClick={onDismiss}>
      <div className="bs-sheet" onClick={e => e.stopPropagation()}>
        <div className="bs-handle" />
        <div className="bs-icon-wrap">
          <div className="bs-icon-circle">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
        </div>
        <h2 className="bs-title">{t.accountTempBlocked}</h2>
        <p className="bs-reason">{user.blockReason}</p>
        <div className="bs-amount-card">
          <div className="bs-amount-label">{t.blockedAmount}</div>
          <div className="bs-amount-value">{formatCurrency(user.blockedAmount)}</div>
          <div className="bs-amount-ref">{t.ref}: {user.blockRef}</div>
        </div>
        <div className="bs-advisor-card">
          <div className="bs-advisor-label">{t.yourAdvisor}</div>
          <div className="bs-advisor-row">
            <div className="bs-advisor-avatar">{user.advisor.name.split(' ').map(n => n[0]).join('')}</div>
            <div className="bs-advisor-info">
              <div className="bs-advisor-name">{user.advisor.name}</div>
              <div className="bs-advisor-title">{user.advisor.title}</div>
              <div className="bs-advisor-branch">{user.advisor.branch}</div>
            </div>
          </div>
          <div className="bs-advisor-actions">
            <a href={`tel:${user.advisor.phone}`} className="bs-action-btn bs-action-call">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {t.call}
            </a>
            <a href={`mailto:${user.advisor.email}`} className="bs-action-btn bs-action-email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {t.write}
            </a>
          </div>
        </div>
        <button className="bs-dismiss" onClick={onDismiss}>{t.understood}</button>
      </div>
    </div>
  );
}

// ── Transfer Blocked Sheet ──
function TransferBlockedSheet({ user, benef, amount, onClose }) {
  const { t } = useLang();
  return (
    <div className="bs-overlay" onClick={onClose}>
      <div className="bs-sheet" onClick={e => e.stopPropagation()}>
        <div className="bs-handle" />
        <div className="bs-icon-wrap">
          <div className="bs-icon-circle bs-icon-lock">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>
        <h3 className="bs-mini-title">{t.transferDenied}</h3>
        <p className="bs-mini-text">
          {t.lang === 'en' ? 'Your' : 'Votre'} {t.transfer.toLowerCase()} {t.lang === 'en' ? 'of' : 'de'} <strong>{formatCurrency(parseFloat(amount))}</strong> {t.lang === 'en' ? 'to' : 'vers'} <strong>{benef.name}</strong> {t.transferDeniedText1}
        </p>
        <p className="bs-mini-text">{t.transferDeniedText2}</p>
        <div className="bs-transfer-blocked-detail">
          <div className="bs-tbd-row"><span className="bs-tbd-label">{t.beneficiary}</span><span className="bs-tbd-value">{benef.name}</span></div>
          <div className="bs-tbd-row"><span className="bs-tbd-label">{t.amount}</span><span className="bs-tbd-value bs-tbd-amount">{formatCurrency(parseFloat(amount))}</span></div>
          <div className="bs-tbd-row"><span className="bs-tbd-label">{t.statusLabel}</span><span className="bs-tbd-status">{t.denied}</span></div>
          <div className="bs-tbd-row"><span className="bs-tbd-label">{t.ref}.</span><span className="bs-tbd-value">{user.blockRef}</span></div>
        </div>
        <div className="bs-email-notif">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0075be" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span>{t.emailNotifSent} <strong>{benef.email}</strong></span>
        </div>
        <div className="bs-mini-contact">
          <span>{t.unblockContact}</span>
          <div className="bs-mini-advisor-name">{user.advisor.name}</div>
          <a href={`tel:${user.advisor.phone}`} className="bs-mini-phone">{user.advisor.phone}</a>
        </div>
        <button className="bs-dismiss" onClick={onClose}>{t.close}</button>
      </div>
    </div>
  );
}

function BlockedBanner({ onClick }) {
  const { t } = useLang();
  return (
    <button className="db-blocked-banner" onClick={onClick}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>{t.accountBlocked}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  );
}

function LoadingScreen({ onDone }) {
  const { t } = useLang();
  useEffect(() => { const tm = setTimeout(onDone, 1600); return () => clearTimeout(tm); }, [onDone]);
  return (
    <div className="db-loading">
      <div className="db-loading-inner">
        <img src={LOGO_URL} alt="BMO" className="db-loading-logo" />
        <div className="db-loading-spinner">
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeDasharray="70 30" className="db-spinner-circle" />
          </svg>
        </div>
        <div className="db-loading-text">{t.secureConnection}</div>
      </div>
    </div>
  );
}

function AccountDetail({ account, transactions, blocked, onClose }) {
  const { lang, t } = useLang();
  const acctTrans = transactions.filter(tr => tr.accountId === account.id);
  return (
    <div className="bs-overlay" onClick={onClose}>
      <div className="bs-sheet" onClick={e => e.stopPropagation()}>
        <div className="bs-handle" />
        <div className="db-modal-header">
          <h3>{account.name}</h3>
          <button className="db-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="db-detail-balance-card">
          <div className="db-detail-balance-label">{t.accountBalance}</div>
          <div className="db-detail-balance-amount">{formatCurrency(account.balance)}</div>
          {blocked && (
            <div className="db-detail-blocked-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              {t.fundsBlocked} — {t.available}: {formatCurrency(account.availableBalance)}
            </div>
          )}
        </div>
        <div className="db-detail-grid">
          <div className="db-detail-item"><span className="db-detail-item-label">{t.type}</span><span className="db-detail-item-value">{account.type === 'checking' ? t.checking : account.type === 'savings' ? t.savings : t.investment}</span></div>
          <div className="db-detail-item"><span className="db-detail-item-label">{t.number}</span><span className="db-detail-item-value">{account.number}</span></div>
        </div>
        <div className="db-detail-section-title">{t.lastOperations}</div>
        {acctTrans.length === 0 ? (
          <div className="db-empty"><div className="db-empty-text">{t.noOperation}</div></div>
        ) : acctTrans.slice(0, 5).map(t => {
          const ic = getTransIcon(t.description);
          return (
            <div key={t.id} className="db-detail-trans-row">
              <div className="db-trans-emoji" style={{ background: ic.bg }}>{ic.emoji}</div>
              <div className="db-trans-info"><div className="db-trans-desc">{t.description}</div><div className="db-trans-account">{formatTransDate(t.date)}</div></div>
              <div className={`db-trans-amount ${t.amount > 0 ? 'credit' : 'debit'}`}>{t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab: Solde ──
function SoldeTab({ user, onQuickAction, onShowBlock }) {
  const { t } = useLang();
  const [openCat, setOpenCat] = useState({ deposits: true, investments: false });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const totalBalance = user.accounts.reduce((s, a) => s + a.balance, 0);
  const deposits = user.accounts.filter(a => a.category === 'deposits');
  const investments = user.accounts.filter(a => a.category === 'investments');

  const quickActions = [
    { id: 'pay', label: t.payBills, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20"/><path d="M10 15h4"/></svg> },
    { id: 'transfer', label: t.transfer, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
    { id: 'look', label: t.globalView, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg> },
  ];

  const renderCategory = (label, accounts, key) => (
    <div className="db-cat">
      <button className="db-cat-header" onClick={() => setOpenCat(p => ({ ...p, [key]: !p[key] }))}>
        <svg className={`db-cat-chevron ${openCat[key] ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        <span>{label}</span>
        <span className="db-cat-count">{accounts.length}</span>
      </button>
      <div className={`db-cat-body ${openCat[key] ? 'open' : ''}`}>
        {accounts.map(acc => (
          <div key={acc.id} className="db-acct-row" onClick={() => setSelectedAccount(acc)}>
            <div className="db-acct-left">
              <div className={`db-acct-bar ${acc.type}`} />
              <div>
                <div className="db-acct-name">{acc.name}</div>
                <div className="db-acct-num">{acc.number}</div>
              </div>
            </div>
            <div className="db-acct-right">
              <div className="db-acct-balance">{formatCurrency(acc.balance)}</div>
              {user.blocked && <div className="db-acct-frozen">{t.blocked}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="db-tab-content">
      {user.blocked && <BlockedBanner onClick={onShowBlock} />}
      <BankCard user={user} />
      <div className="db-total-card">
        <div className="db-total-top">
          <div className="db-total-label">{t.totalBalance}</div>
          {user.blocked && <span className="db-total-badge">{t.blocked}</span>}
        </div>
        <div className="db-total-amount">{formatCurrency(totalBalance)}</div>
        {user.blocked && <div className="db-total-avail">{t.available}: {formatCurrency(0)}</div>}
      </div>
      <div className="db-quick-actions">
        {quickActions.map(qa => (
          <button key={qa.id} className="db-quick-btn" onClick={() => onQuickAction(qa.id)}>
            <div className="db-quick-icon">{qa.icon}</div>
            <span className="db-quick-label">{qa.label}</span>
          </button>
        ))}
      </div>
      <div className="db-section-title">{t.accountSummary}</div>
      {deposits.length > 0 && renderCategory(t.deposits, deposits, 'deposits')}
      {investments.length > 0 && renderCategory(t.investments, investments, 'investments')}
      {selectedAccount && <AccountDetail account={selectedAccount} transactions={user.transactions} blocked={user.blocked} onClose={() => setSelectedAccount(null)} />}
    </div>
  );
}

// ── Tab: Historique ──
function HistoriqueTab({ user }) {
  const { lang, t } = useLang();
  const [filterAccount, setFilterAccount] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTrans, setSelectedTrans] = useState(null);
  let txns = filterAccount === 'all' ? user.transactions : user.transactions.filter(tr => tr.accountId === filterAccount);
  if (search.trim()) { const q = search.toLowerCase(); txns = txns.filter(tr => tr.description.toLowerCase().includes(q)); }
  const grouped = {};
  txns.forEach(tr => { if (!grouped[tr.date]) grouped[tr.date] = []; grouped[tr.date].push(tr); });
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="db-tab-content">
      <div className="db-search-bar">
        <svg className="db-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input className="db-search-input" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button className="db-search-clear" onClick={() => setSearch('')}>✕</button>}
      </div>
      <div className="db-filter-bar">
        <select className="db-select" value={filterAccount} onChange={e => setFilterAccount(e.target.value)}>
          <option value="all">{t.allAccounts}</option>
          {user.accounts.map(a => <option key={a.id} value={a.id}>{a.name} {a.number}</option>)}
        </select>
      </div>
      {sortedDates.length === 0 && (
        <div className="db-empty"><div className="db-empty-text">{t.noTransaction}</div></div>
      )}
      {sortedDates.map(date => (
        <div key={date} className="db-trans-group">
          <div className="db-trans-date-header">{formatSmartDate(date, lang)}</div>
          {grouped[date].map(tr => {
            const ic = getTransIcon(tr.description);
            return (
              <div key={tr.id} className="db-trans-row" onClick={() => setSelectedTrans(tr)}>
                <div className="db-trans-emoji" style={{ background: ic.bg }}>{ic.emoji}</div>
                <div className="db-trans-info"><div className="db-trans-desc">{tr.description}</div><div className="db-trans-account">{user.accounts.find(a => a.id === tr.accountId)?.name}</div></div>
                <div className={`db-trans-amount ${tr.amount > 0 ? 'credit' : 'debit'}`}>{tr.amount > 0 ? '+' : ''}{formatCurrency(tr.amount)}</div>
              </div>
            );
          })}
        </div>
      ))}
      {selectedTrans && <TransactionDetail transaction={selectedTrans} account={user.accounts.find(a => a.id === selectedTrans.accountId)?.name || ''} onClose={() => setSelectedTrans(null)} />}
    </div>
  );
}

// ── Tab: Virement ──
function VirementTab({ user, setUser, onShowBlock }) {
  const { t } = useLang();
  const [view, setView] = useState('main');
  const [selectedBenef, setSelectedBenef] = useState(null);
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState(user.accounts[0]?.id || '');
  const [motif, setMotif] = useState('');
  const [newBenef, setNewBenef] = useState({ name: '', iban: '', bic: '', bank: '', email: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [showBlocked, setShowBlocked] = useState(false);

  const handleConfirmTransfer = () => { if (user.blocked) { setShowBlocked(true); } };

  const handleAddBenef = () => {
    if (!newBenef.name || !newBenef.iban || !newBenef.email) return;
    const updated = { ...user, beneficiaries: [...user.beneficiaries, { ...newBenef, id: Date.now() }] };
    setUser(updated);
    setNewBenef({ name: '', iban: '', bic: '', bank: '', email: '' });
    setView('main');
  };

  const handleDeleteBenef = (id) => {
    setUser({ ...user, beneficiaries: user.beneficiaries.filter(b => b.id !== id) });
    setDeletingId(null);
  };

  if (view === 'addBenef') {
    return (
      <div className="db-tab-content db-slide-in">
        <div className="db-form-header">
          <button className="db-back-btn" onClick={() => setView('main')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>{t.back}</button>
          <h3>{t.newBeneficiary}</h3>
        </div>
        <div className="db-form-card">
          {[
            { key: 'name', label: t.fullName, placeholder: 'Ex: Jean Dupont' },
            { key: 'email', label: t.email, placeholder: 'Ex: jean.dupont@email.com' },
            { key: 'iban', label: t.iban, placeholder: 'CA76 0006 ...' },
            { key: 'bic', label: t.bic, placeholder: 'BOFMCAM2XXX' },
            { key: 'bank', label: t.bank, placeholder: 'BMO, RBC, TD...' },
          ].map(f => (
            <div key={f.key} className="db-form-field">
              <label>{f.label} {(f.key === 'name' || f.key === 'iban' || f.key === 'email') && <span className="db-required">*</span>}</label>
              <input type={f.key === 'email' ? 'email' : 'text'} value={newBenef[f.key]} onChange={e => setNewBenef({ ...newBenef, [f.key]: e.target.value })} placeholder={f.placeholder} />
            </div>
          ))}
          <button className="db-btn-primary" onClick={handleAddBenef} disabled={!newBenef.name || !newBenef.iban || !newBenef.email}>{t.addBeneficiaryBtn}</button>
        </div>
      </div>
    );
  }

  if (view === 'transfer' && selectedBenef) {
    const currentAcc = user.accounts.find(a => a.id === fromAccount);
    return (
      <div className="db-tab-content db-slide-in">
        <div className="db-form-header">
          <button className="db-back-btn" onClick={() => { setView('main'); setAmount(''); setMotif(''); }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>{t.back}</button>
          <h3>{t.newTransfer}</h3>
        </div>
        <div className="db-form-card">
          <div className="db-benef-selected">
            <div className="db-benef-avatar">{selectedBenef.name.charAt(0)}</div>
            <div><div className="db-benef-name">{selectedBenef.name}</div><div className="db-benef-sub">{selectedBenef.bank} — {selectedBenef.email}</div></div>
          </div>
          <div className="db-form-field">
            <label>{t.sourceAccount}</label>
            <select value={fromAccount} onChange={e => setFromAccount(e.target.value)}>
              {user.accounts.filter(a => a.type !== 'investment').map(a => (<option key={a.id} value={a.id}>{a.name} ({formatCurrency(a.balance)})</option>))}
            </select>
          </div>
          <div className="db-form-field">
            <label>{t.amount}</label>
            <div className="db-amount-wrap"><span className="db-amount-prefix">$</span><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" className="db-amount-input" /></div>
            {currentAcc && <div className="db-field-hint">{t.balance}: {formatCurrency(currentAcc.balance)}</div>}
          </div>
          <div className="db-form-field"><label>{t.reason}</label><input type="text" value={motif} onChange={e => setMotif(e.target.value)} placeholder="Ex: Loyer novembre" /></div>
          <button className="db-btn-primary" onClick={handleConfirmTransfer} disabled={!amount || parseFloat(amount) <= 0}>{t.confirmTransfer}</button>
        </div>
        {showBlocked && <TransferBlockedSheet user={user} benef={selectedBenef} amount={amount} onClose={() => { setShowBlocked(false); setView('main'); setAmount(''); setMotif(''); }} />}
      </div>
    );
  }

  return (
    <div className="db-tab-content">
      {user.blocked && <BlockedBanner onClick={onShowBlock} />}
      <div className="db-section-row">
        <span className="db-section-title">{t.beneficiaries}</span>
        <button className="db-add-btn" onClick={() => setView('addBenef')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {t.add}
        </button>
      </div>
      {user.beneficiaries.length === 0 ? (
        <div className="db-empty"><div className="db-empty-text">{t.noBeneficiary}</div><div className="db-empty-sub">{t.addBeneficiaryHint}</div></div>
      ) : (
        <div className="db-benef-list">
          {user.beneficiaries.map(b => (
            <div key={b.id} className="db-benef-wrap">
              <button className="db-benef-card" onClick={() => { setSelectedBenef(b); setView('transfer'); }}>
                <div className="db-benef-avatar">{b.name.charAt(0)}</div>
                <div className="db-benef-details"><div className="db-benef-name">{b.name}</div><div className="db-benef-sub">{b.bank}{b.email ? ` — ${b.email}` : ''}</div></div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              {deletingId === b.id ? (
                <div className="db-benef-del-confirm"><span>{t.deleteConfirm}</span><button className="db-del-yes" onClick={() => handleDeleteBenef(b.id)}>{t.yes}</button><button className="db-del-no" onClick={() => setDeletingId(null)}>{t.no}</button></div>
              ) : (
                <button className="db-benef-del" onClick={() => setDeletingId(b.id)}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab: RIB ──
function RibTab({ user }) {
  const { t } = useLang();
  const { rib } = user;
  const [copied, setCopied] = useState('');
  const copy = (text, label) => { navigator.clipboard.writeText(text.replace(/\s/g, '')); setCopied(label); setTimeout(() => setCopied(''), 1500); };
  const fields = [
    { label: t.holder, value: rib.accountHolder, icon: RibIcons.user },
    { label: t.bankName, value: rib.bankName, icon: RibIcons.bank },
    { label: t.accountNumber, value: rib.accountNumber, copy: true, icon: RibIcons.hash },
    { label: t.ribKey, value: rib.ribKey, icon: RibIcons.key },
    { label: t.bankCode, value: rib.bankCode, icon: RibIcons.building },
    { label: t.branchCode, value: rib.branchCode, icon: RibIcons.pin },
    { label: t.iban, value: rib.iban, copy: true, icon: RibIcons.globe },
    { label: t.bic, value: rib.bic, copy: true, icon: RibIcons.link },
    { label: t.branchAddress, value: rib.branchAddress, icon: RibIcons.mail },
  ];
  return (
    <div className="db-tab-content">
      <div className="db-rib-card">
        <div className="db-rib-header">
          <img src={LOGO_URL} alt="BMO" className="db-rib-logo" />
          <div><div className="db-rib-title">{t.ribTitle}</div><div className="db-rib-sub">{rib.accountHolder}</div></div>
        </div>
        <div className="db-rib-fields">
          {fields.map((f, i) => (
            <div key={i} className="db-rib-row">
              <div className="db-rib-left"><div className="db-rib-icon">{f.icon}</div><div><div className="db-rib-label">{f.label}</div><div className="db-rib-value">{f.value}</div></div></div>
              {f.copy && (
                <button className={`db-copy-btn ${copied === f.label ? 'ok' : ''}`} onClick={() => copy(f.value, f.label)}>
                  {copied === f.label ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Vue Globale Tab ──
function VueGlobaleTab({ user, onShowBlock }) {
  const { t } = useLang();
  const totalBalance = user.accounts.reduce((s, a) => s + a.balance, 0);
  const colors = ['#0075be', '#2e7d32', '#f57c00'];
  return (
    <div className="db-tab-content">
      {user.blocked && <BlockedBanner onClick={onShowBlock} />}
      <div className="db-vue-total"><div className="db-vue-total-label">{t.totalWealth}</div><div className="db-vue-total-amount">{formatCurrency(totalBalance)}</div></div>
      <div className="db-vue-chart">
        {user.accounts.map((acc, i) => {
          const pct = (acc.balance / totalBalance) * 100;
          return (
            <div key={acc.id} className="db-vue-bar-row">
              <div className="db-vue-bar-label"><div className="db-vue-bar-dot" style={{ background: colors[i % colors.length] }} /><span>{acc.name}</span></div>
              <div className="db-vue-bar-track"><div className="db-vue-bar-fill" style={{ width: `${pct}%`, background: colors[i % colors.length] }} /></div>
              <div className="db-vue-bar-value">{formatCurrency(acc.balance)}</div>
              <div className="db-vue-bar-pct">{pct.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>
      <div className="db-section-title">{t.distribution}</div>
      <div className="db-vue-cards">
        {user.accounts.map((acc, i) => (
          <div key={acc.id} className="db-vue-card">
            <div className="db-vue-card-bar" style={{ background: colors[i % colors.length] }} />
            <div className="db-vue-card-info"><div className="db-vue-card-name">{acc.name}</div><div className="db-vue-card-num">{acc.number}</div></div>
            <div className="db-vue-card-right"><div className="db-vue-card-amount">{formatCurrency(acc.balance)}</div>{user.blocked && <div className="db-acct-frozen">{t.blocked}</div>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Toast Notification ──
function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div className="toast-notification">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>{message}</span>
    </div>
  );
}

// ── Tab: Cartes ──
function CartesTab({ user }) {
  const { t } = useLang();
  const [showNumber, setShowNumber] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [contactless, setContactless] = useState(true);
  const [onlinePayments, setOnlinePayments] = useState(true);
  const [dabWithdrawals, setDabWithdrawals] = useState(true);
  const [showLost, setShowLost] = useState(false);
  const [toast, setToast] = useState({ msg: '', show: false });

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: '', show: false }), 2000);
  };

  const cardNum = user.cardNumber;
  const displayNum = showNumber
    ? `${cardNum.slice(0,4)} ${cardNum.slice(4,8)} ${cardNum.slice(8,12)} ${cardNum.slice(12)}`
    : `•••• •••• •••• ${cardNum.slice(-4)}`;

  const toggleCardNumber = () => {
    setShowNumber(v => !v);
    showToast(showNumber ? t.numberHidden : t.numberShown);
  };

  const Toggle = ({ on, onToggle }) => (
    <button onClick={onToggle} style={{
      width: 44, height: 24, borderRadius: 12, border: 'none', padding: 2, cursor: 'pointer',
      background: on ? '#0075be' : '#ddd', transition: 'background .2s', display: 'flex', alignItems: 'center',
      justifyContent: on ? 'flex-end' : 'flex-start',
    }}>
      <div style={{ width: 20, height: 20, borderRadius: 10, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'all .2s' }} />
    </button>
  );

  return (
    <div className="db-tab-content">
      <Toast message={toast.msg} visible={toast.show} />
      <div className="cards-tab-card" onClick={toggleCardNumber} style={{ cursor: 'pointer' }}>
        <div className="vcard-bg">
          <div className="vcard-top">
            <img src={LOGO_URL} alt="BMO" className="vcard-logo" />
            <span className="vcard-type">{t.debitVisa}</span>
          </div>
          <div className="vcard-chip">
            <svg width="36" height="28" viewBox="0 0 32 24"><rect x="1" y="1" width="30" height="22" rx="3" fill="#c9a84c" stroke="#b8972e" strokeWidth="1"/><line x1="1" y1="8" x2="31" y2="8" stroke="#b8972e" strokeWidth=".7"/><line x1="1" y1="16" x2="31" y2="16" stroke="#b8972e" strokeWidth=".7"/><line x1="11" y1="1" x2="11" y2="23" stroke="#b8972e" strokeWidth=".7"/><line x1="21" y1="1" x2="21" y2="23" stroke="#b8972e" strokeWidth=".7"/></svg>
          </div>
          <div className="vcard-number">{displayNum}</div>
          <div className="vcard-bottom">
            <div>
              <div className="vcard-label">{t.cardHolder}</div>
              <div className="vcard-holder">{user.firstName} {user.lastName}</div>
            </div>
            <div>
              <div className="vcard-label">{t.expires}</div>
              <div className="vcard-expiry">12/28</div>
            </div>
          </div>
          {frozen && (
            <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.55)', borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', zIndex:5 }}>
              <div style={{ color:'#fff', textAlign:'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <div style={{ marginTop:6, fontWeight:700, fontSize:13 }}>{t.frozenCard}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="cards-info">
        <div className="cards-info-row">
          <span className="cards-info-label">{t.cardNumber}</span>
          <span className="cards-info-value">{showNumber ? cardNum : `•••• ${cardNum.slice(-4)}`}</span>
        </div>
        <div className="cards-info-row">
          <span className="cards-info-label">{t.expiryDate}</span>
          <span className="cards-info-value">12/2028</span>
        </div>
        <div className="cards-info-row">
          <span className="cards-info-label">CVV</span>
          <span className="cards-info-value">{showNumber ? '847' : '•••'}</span>
        </div>
        <div className="cards-info-row">
          <span className="cards-info-label">{t.cardStatus}</span>
          <span className="cards-info-value" style={{ color: frozen ? '#c62828' : '#2e7d32' }}>
            {frozen ? t.frozen : t.active}
          </span>
        </div>
      </div>

      <div className="cards-actions">
        <button className="cards-action-btn" onClick={toggleCardNumber}>
          <div className="cards-action-icon blue">
            {showNumber
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </div>
          <span className="cards-action-label">{showNumber ? t.hideNumber : t.showNumber}</span>
        </button>
        <button className="cards-action-btn" onClick={() => { setFrozen(v => !v); showToast(frozen ? t.cardUnfrozen : t.cardFrozen); }}>
          <div className={`cards-action-icon ${frozen ? 'green' : 'red'}`}>
            {frozen
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            }
          </div>
          <span className="cards-action-label">{frozen ? t.unfreezeCard : t.freezeCard}</span>
        </button>
        <button className="cards-action-btn" onClick={() => setShowLost(true)}>
          <div className="cards-action-icon orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <span className="cards-action-label">{t.lostStolen}</span>
        </button>
        <button className="cards-action-btn">
          <div className="cards-action-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <span className="cards-action-label">{t.pinCode}</span>
        </button>
      </div>

      <div className="cards-info" style={{ marginBottom: 14 }}>
        <div className="cards-info-row">
          <span className="cards-info-label">{t.contactless}</span>
          <Toggle on={contactless} onToggle={() => { setContactless(v => !v); showToast(contactless ? t.contactlessOff : t.contactlessOn); }} />
        </div>
        <div className="cards-info-row">
          <span className="cards-info-label">{t.onlinePayments}</span>
          <Toggle on={onlinePayments} onToggle={() => { setOnlinePayments(v => !v); showToast(onlinePayments ? t.onlineOff : t.onlineOn); }} />
        </div>
        <div className="cards-info-row">
          <span className="cards-info-label">{t.atmWithdrawals}</span>
          <Toggle on={dabWithdrawals} onToggle={() => { setDabWithdrawals(v => !v); showToast(dabWithdrawals ? t.dabOff : t.dabOn); }} />
        </div>
      </div>

      <div className="cards-limit-card">
        <div className="cards-limit-title">{t.cardLimits}</div>
        <div className="cards-limit-row">
          <div className="cards-limit-header">
            <span className="cards-limit-name">{t.monthlyPayment}</span>
            <span className="cards-limit-val">2 450 $ / 5 000 $</span>
          </div>
          <div className="cards-limit-track"><div className="cards-limit-fill" style={{ width: '49%' }} /></div>
        </div>
        <div className="cards-limit-row">
          <div className="cards-limit-header">
            <span className="cards-limit-name">{t.weeklyWithdrawal}</span>
            <span className="cards-limit-val">800 $ / 2 000 $</span>
          </div>
          <div className="cards-limit-track"><div className="cards-limit-fill" style={{ width: '40%' }} /></div>
        </div>
        <div className="cards-limit-row">
          <div className="cards-limit-header">
            <span className="cards-limit-name">{t.onlinePayment}</span>
            <span className="cards-limit-val">1 200 $ / 3 000 $</span>
          </div>
          <div className="cards-limit-track"><div className="cards-limit-fill" style={{ width: '40%' }} /></div>
        </div>
      </div>

      {showLost && (
        <div className="bs-overlay" onClick={() => setShowLost(false)}>
          <div className="bs-sheet bs-sheet-mini" onClick={e => e.stopPropagation()}>
            <div className="bs-handle" />
            <div className="bs-icon-wrap">
              <div className="bs-icon-circle" style={{ background: '#fff3e0' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f57c00" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
            </div>
            <h3 className="bs-mini-title">{t.reportLostTitle}</h3>
            <p className="bs-mini-text">{t.reportLostText1}</p>
            <p className="bs-mini-text">
              {t.cardEndingWith} <strong>{cardNum.slice(-4)}</strong> {t.reportLostText2ending}
            </p>
            <div className="bs-mini-contact">
              <span>{t.oppositionService}</span>
              <a href="tel:1-800-363-9992" className="bs-mini-phone">1-800-363-9992</a>
            </div>
            <button className="db-btn-primary" style={{ background: '#f57c00' }} onClick={() => { setFrozen(true); setShowLost(false); }}>{t.opposeNow}</button>
            <button className="bs-dismiss" style={{ marginTop: 8 }} onClick={() => setShowLost(false)}>{t.cancel}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Settings Panel ──
function SettingsPanel({ onClose, lang, setLang }) {
  const { t } = useLang();
  const [biometric, setBiometric] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  const Toggle = ({ on, onToggle }) => (
    <button onClick={onToggle} style={{
      width: 44, height: 24, borderRadius: 12, border: 'none', padding: 2, cursor: 'pointer',
      background: on ? '#0075be' : '#ddd', transition: 'background .2s', display: 'flex', alignItems: 'center',
      justifyContent: on ? 'flex-end' : 'flex-start',
    }}>
      <div style={{ width: 20, height: 20, borderRadius: 10, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'all .2s' }} />
    </button>
  );

  return (
    <div className="bs-overlay" onClick={onClose}>
      <div className="bs-sheet" onClick={e => e.stopPropagation()}>
        <div className="bs-handle" />
        <div className="db-modal-header">
          <h3>{t.settingsTitle}</h3>
          <button className="db-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">{t.language}</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <span className="settings-row-label">{t.language}</span>
              </div>
              <div className="lang-selector">
                <button className={`lang-btn ${lang === 'fr' ? 'active' : ''}`} onClick={() => setLang('fr')}>FR</button>
                <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">{t.security}</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <span className="settings-row-label">{t.changePassword}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon purple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <span className="settings-row-label">{t.biometric}</span>
              </div>
              <Toggle on={biometric} onToggle={() => setBiometric(v => !v)} />
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon orange">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <span className="settings-row-label">{t.twoFactor}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">{t.notifPrefs}</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
                <span className="settings-row-label">{t.pushNotifs}</span>
              </div>
              <Toggle on={pushNotif} onToggle={() => setPushNotif(v => !v)} />
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <span className="settings-row-label">{t.emailNotifs}</span>
              </div>
              <Toggle on={emailNotif} onToggle={() => setEmailNotif(v => !v)} />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">{t.about}</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </div>
                <span className="settings-row-label">{t.version}</span>
              </div>
              <span className="settings-row-value">3.14.2</span>
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <span className="settings-row-label">{t.terms}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon purple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <span className="settings-row-label">{t.privacy}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ──
export default function Dashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState('solde');
  const [loading, setLoading] = useState(true);
  const [showBlockSheet, setShowBlockSheet] = useState(false);
  const [initialBlockShown, setInitialBlockShown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('bmo_lang') || 'fr'; } catch { return 'fr'; }
  });
  const [lastLogin] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() - 3);
    return d.toLocaleString('fr-CA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  });

  const t = translations[lang] || translations.fr;

  useEffect(() => {
    try { localStorage.setItem('bmo_lang', lang); } catch {}
  }, [lang]);

  useEffect(() => {
    if (!loading && user.blocked && !initialBlockShown) {
      const tm = setTimeout(() => { setShowBlockSheet(true); setInitialBlockShown(true); }, 600);
      return () => clearTimeout(tm);
    }
  }, [loading, user.blocked, initialBlockShown]);

  const handleQuickAction = (id) => {
    if (id === 'transfer') setActiveTab('virement');
    else if (id === 'look') setActiveTab('vue');
    else if (id === 'pay') { if (user.blocked) setShowBlockSheet(true); }
  };

  const handleOpenSettings = () => { setShowLogout(false); setShowSettings(true); };

  const tabs = [
    { id: 'solde', label: t.tabSolde, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
    { id: 'historique', label: t.tabHistorique, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { id: 'virement', label: t.tabVirement, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
    { id: 'cartes', label: t.tabCartes, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><rect x="4" y="14" width="4" height="2" rx="1"/></svg> },
    { id: 'rib', label: t.tabRib, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  ];

  if (loading) return (
    <LangContext.Provider value={lang}>
      <LoadingScreen onDone={() => setLoading(false)} />
    </LangContext.Provider>
  );

  return (
    <LangContext.Provider value={lang}>
      <div className="db-container">
        <header className="db-header">
          <div className="db-header-bg">
            <div className="db-header-top">
              <div className="db-header-logo"><img src={LOGO_URL} alt="BMO" className="db-logo-img" /></div>
              <div className="db-header-right">
                <button className="db-notif-btn" onClick={() => setShowNotifications(true)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  <span className="db-notif-dot" />
                </button>
                <div className="db-avatar" onClick={() => setShowLogout(true)} title="Profil">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              </div>
            </div>
            <div className="db-greeting"><span className="db-greeting-text">{getGreeting(lang)},</span><span className="db-greeting-name"> {user.firstName}.</span></div>
            <div className="db-date">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {formatDate(lang)}
            </div>
            <div className="db-last-login">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              {t.lastLogin}: {lastLogin}
            </div>
          </div>
        </header>

        <main className="db-main">
          {activeTab === 'solde' && <SoldeTab user={user} onQuickAction={handleQuickAction} onShowBlock={() => setShowBlockSheet(true)} />}
          {activeTab === 'historique' && <HistoriqueTab user={user} />}
          {activeTab === 'virement' && <VirementTab user={user} setUser={setUser} onShowBlock={() => setShowBlockSheet(true)} />}
          {activeTab === 'cartes' && <CartesTab user={user} />}
          {activeTab === 'rib' && <RibTab user={user} />}
          {activeTab === 'vue' && <VueGlobaleTab user={user} onShowBlock={() => setShowBlockSheet(true)} />}
        </main>

        <nav className="db-bottom-nav">
          {tabs.map(tab => (
            <button key={tab.id} className={`db-nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <div className="db-nav-icon">{tab.icon}</div>
              <span>{tab.label}</span>
              {activeTab === tab.id && <div className="db-nav-indicator" />}
            </button>
          ))}
        </nav>

        {showBlockSheet && <BlockedSheet user={user} onDismiss={() => setShowBlockSheet(false)} />}
        {showNotifications && <NotificationCenter user={user} onClose={() => setShowNotifications(false)} onShowBlock={() => { setShowNotifications(false); setShowBlockSheet(true); }} />}
        {showLogout && <LogoutConfirm user={user} onConfirm={onLogout} onCancel={() => setShowLogout(false)} onOpenSettings={handleOpenSettings} />}
        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} lang={lang} setLang={setLang} />}
      </div>
    </LangContext.Provider>
  );
}
