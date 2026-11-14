import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const LOGO_URL = 'https://b-mosgrp-parts-vsr.vercel.app/img/bnp-alone.png';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

function formatDate() {
  const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const d = new Date();
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatCurrency(n) {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 }).format(n);
}

function formatTransDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['Jan','Fév','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
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

// SVG icons for RIB (no emojis)
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

// ── Blocked Account Bottom Sheet ──
function BlockedSheet({ user, onDismiss }) {
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
        <h2 className="bs-title">Compte temporairement bloqué</h2>
        <p className="bs-reason">{user.blockReason}</p>
        <div className="bs-amount-card">
          <div className="bs-amount-label">Montant bloqué</div>
          <div className="bs-amount-value">{formatCurrency(user.blockedAmount)}</div>
          <div className="bs-amount-ref">Réf: {user.blockRef}</div>
        </div>
        <div className="bs-advisor-card">
          <div className="bs-advisor-label">Votre conseiller</div>
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
              Appeler
            </a>
            <a href={`mailto:${user.advisor.email}`} className="bs-action-btn bs-action-email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Écrire
            </a>
          </div>
        </div>
        <button className="bs-dismiss" onClick={onDismiss}>J'ai compris</button>
      </div>
    </div>
  );
}

// ── Transfer Blocked Sheet ──
function TransferBlockedSheet({ user, benef, amount, onClose }) {
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
        <h3 className="bs-mini-title">Virement refusé</h3>
        <p className="bs-mini-text">
          Votre virement de <strong>{formatCurrency(parseFloat(amount))}</strong> vers <strong>{benef.name}</strong> n'a pas pu être exécuté.
        </p>
        <p className="bs-mini-text">
          Votre compte fait l'objet d'une restriction temporaire. Toutes les opérations sortantes sont suspendues jusqu'à nouvel ordre.
        </p>
        <div className="bs-transfer-blocked-detail">
          <div className="bs-tbd-row">
            <span className="bs-tbd-label">Bénéficiaire</span>
            <span className="bs-tbd-value">{benef.name}</span>
          </div>
          <div className="bs-tbd-row">
            <span className="bs-tbd-label">Montant</span>
            <span className="bs-tbd-value bs-tbd-amount">{formatCurrency(parseFloat(amount))}</span>
          </div>
          <div className="bs-tbd-row">
            <span className="bs-tbd-label">Statut</span>
            <span className="bs-tbd-status">Refusé</span>
          </div>
          <div className="bs-tbd-row">
            <span className="bs-tbd-label">Réf.</span>
            <span className="bs-tbd-value">{user.blockRef}</span>
          </div>
        </div>
        <div className="bs-email-notif">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0075be" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span>Un email de notification a été envoyé à <strong>{benef.email}</strong></span>
        </div>
        <div className="bs-mini-contact">
          <span>Pour débloquer votre compte, contactez :</span>
          <div className="bs-mini-advisor-name">{user.advisor.name}</div>
          <a href={`tel:${user.advisor.phone}`} className="bs-mini-phone">{user.advisor.phone}</a>
        </div>
        <button className="bs-dismiss" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

// ── Status Banner ──
function BlockedBanner({ onClick }) {
  return (
    <button className="db-blocked-banner" onClick={onClick}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>Compte bloqué — Opérations suspendues</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  );
}

// ── Loading ──
function LoadingScreen({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1600); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="db-loading">
      <div className="db-loading-inner">
        <img src={LOGO_URL} alt="BMO" className="db-loading-logo" />
        <div className="db-loading-bar"><div className="db-loading-bar-fill" /></div>
        <div className="db-loading-text">Connexion sécurisée...</div>
      </div>
    </div>
  );
}

// ── Account Detail Modal ──
function AccountDetail({ account, transactions, blocked, onClose }) {
  const acctTrans = transactions.filter(t => t.accountId === account.id);
  return (
    <div className="bs-overlay" onClick={onClose}>
      <div className="bs-sheet" onClick={e => e.stopPropagation()}>
        <div className="bs-handle" />
        <div className="db-modal-header">
          <h3>{account.name}</h3>
          <button className="db-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="db-detail-balance-card">
          <div className="db-detail-balance-label">Solde du compte</div>
          <div className="db-detail-balance-amount">{formatCurrency(account.balance)}</div>
          {blocked && (
            <div className="db-detail-blocked-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Fonds bloqués — Disponible: {formatCurrency(account.availableBalance)}
            </div>
          )}
        </div>
        <div className="db-detail-grid">
          <div className="db-detail-item">
            <span className="db-detail-item-label">Type</span>
            <span className="db-detail-item-value">{account.type === 'checking' ? 'Chèque' : account.type === 'savings' ? 'Épargne' : 'Investissement'}</span>
          </div>
          <div className="db-detail-item">
            <span className="db-detail-item-label">Numéro</span>
            <span className="db-detail-item-value">{account.number}</span>
          </div>
        </div>
        <div className="db-detail-section-title">Dernières opérations</div>
        {acctTrans.length === 0 ? (
          <div className="db-empty"><div className="db-empty-text">Aucune opération</div></div>
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
  const [openCat, setOpenCat] = useState({ deposits: true, investments: false });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const totalBalance = user.accounts.reduce((s, a) => s + a.balance, 0);
  const deposits = user.accounts.filter(a => a.category === 'deposits');
  const investments = user.accounts.filter(a => a.category === 'investments');

  const quickActions = [
    { id: 'pay', label: 'Payer\nfactures', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20"/><path d="M10 15h4"/></svg> },
    { id: 'transfer', label: 'Virement', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
    { id: 'look', label: 'Vue\nglobale', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg> },
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
              {user.blocked && <div className="db-acct-frozen">Bloqué</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="db-tab-content">
      {user.blocked && <BlockedBanner onClick={onShowBlock} />}
      <div className="db-total-card">
        <div className="db-total-top">
          <div className="db-total-label">Solde total</div>
          {user.blocked && <span className="db-total-badge">Bloqué</span>}
        </div>
        <div className="db-total-amount">{formatCurrency(totalBalance)}</div>
        {user.blocked && <div className="db-total-avail">Disponible: {formatCurrency(0)}</div>}
      </div>
      <div className="db-quick-actions">
        {quickActions.map(qa => (
          <button key={qa.id} className="db-quick-btn" onClick={() => onQuickAction(qa.id)}>
            <div className="db-quick-icon">{qa.icon}</div>
            <span className="db-quick-label">{qa.label}</span>
          </button>
        ))}
      </div>
      <div className="db-section-title">Résumé des comptes</div>
      {deposits.length > 0 && renderCategory('Dépôts', deposits, 'deposits')}
      {investments.length > 0 && renderCategory('Investissements', investments, 'investments')}
      {selectedAccount && <AccountDetail account={selectedAccount} transactions={user.transactions} blocked={user.blocked} onClose={() => setSelectedAccount(null)} />}
    </div>
  );
}

// ── Tab: Historique ──
function HistoriqueTab({ user }) {
  const [filterAccount, setFilterAccount] = useState('all');
  const [search, setSearch] = useState('');
  let transactions = filterAccount === 'all' ? user.transactions : user.transactions.filter(t => t.accountId === filterAccount);
  if (search.trim()) { const q = search.toLowerCase(); transactions = transactions.filter(t => t.description.toLowerCase().includes(q)); }
  const grouped = {};
  transactions.forEach(t => { if (!grouped[t.date]) grouped[t.date] = []; grouped[t.date].push(t); });
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="db-tab-content">
      <div className="db-search-bar">
        <svg className="db-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input className="db-search-input" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button className="db-search-clear" onClick={() => setSearch('')}>✕</button>}
      </div>
      <div className="db-filter-bar">
        <select className="db-select" value={filterAccount} onChange={e => setFilterAccount(e.target.value)}>
          <option value="all">Tous les comptes</option>
          {user.accounts.map(a => <option key={a.id} value={a.id}>{a.name} {a.number}</option>)}
        </select>
      </div>
      {sortedDates.length === 0 && (
        <div className="db-empty"><div className="db-empty-text">Aucune transaction trouvée</div></div>
      )}
      {sortedDates.map(date => (
        <div key={date} className="db-trans-group">
          <div className="db-trans-date-header">{formatTransDate(date)}</div>
          {grouped[date].map(t => {
            const ic = getTransIcon(t.description);
            return (
              <div key={t.id} className="db-trans-row">
                <div className="db-trans-emoji" style={{ background: ic.bg }}>{ic.emoji}</div>
                <div className="db-trans-info"><div className="db-trans-desc">{t.description}</div><div className="db-trans-account">{user.accounts.find(a => a.id === t.accountId)?.name}</div></div>
                <div className={`db-trans-amount ${t.amount > 0 ? 'credit' : 'debit'}`}>{t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Tab: Virement (full process, blocks at confirmation) ──
function VirementTab({ user, setUser, onShowBlock }) {
  const [view, setView] = useState('main');
  const [selectedBenef, setSelectedBenef] = useState(null);
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState(user.accounts[0]?.id || '');
  const [motif, setMotif] = useState('');
  const [newBenef, setNewBenef] = useState({ name: '', iban: '', bic: '', bank: '', email: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [showBlocked, setShowBlocked] = useState(false);

  const handleConfirmTransfer = () => {
    if (user.blocked) {
      setShowBlocked(true);
      return;
    }
  };

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

  // ── Add beneficiary view
  if (view === 'addBenef') {
    return (
      <div className="db-tab-content db-slide-in">
        <div className="db-form-header">
          <button className="db-back-btn" onClick={() => setView('main')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <h3>Nouveau bénéficiaire</h3>
        </div>
        <div className="db-form-card">
          {[
            { key: 'name', label: 'Nom complet', placeholder: 'Ex: Jean Dupont' },
            { key: 'email', label: 'Adresse email', placeholder: 'Ex: jean.dupont@email.com' },
            { key: 'iban', label: 'IBAN', placeholder: 'CA76 0006 ...' },
            { key: 'bic', label: 'BIC / SWIFT', placeholder: 'BOFMCAM2XXX' },
            { key: 'bank', label: 'Banque', placeholder: 'BMO, RBC, TD...' },
          ].map(f => (
            <div key={f.key} className="db-form-field">
              <label>{f.label} {(f.key === 'name' || f.key === 'iban' || f.key === 'email') && <span className="db-required">*</span>}</label>
              <input type={f.key === 'email' ? 'email' : 'text'} value={newBenef[f.key]} onChange={e => setNewBenef({ ...newBenef, [f.key]: e.target.value })} placeholder={f.placeholder} />
            </div>
          ))}
          <button className="db-btn-primary" onClick={handleAddBenef} disabled={!newBenef.name || !newBenef.iban || !newBenef.email}>Ajouter le bénéficiaire</button>
        </div>
      </div>
    );
  }

  // ── Transfer form view
  if (view === 'transfer' && selectedBenef) {
    const currentAcc = user.accounts.find(a => a.id === fromAccount);
    return (
      <div className="db-tab-content db-slide-in">
        <div className="db-form-header">
          <button className="db-back-btn" onClick={() => { setView('main'); setAmount(''); setMotif(''); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <h3>Nouveau virement</h3>
        </div>
        <div className="db-form-card">
          <div className="db-benef-selected">
            <div className="db-benef-avatar">{selectedBenef.name.charAt(0)}</div>
            <div>
              <div className="db-benef-name">{selectedBenef.name}</div>
              <div className="db-benef-sub">{selectedBenef.bank} — {selectedBenef.email}</div>
            </div>
          </div>
          <div className="db-form-field">
            <label>Compte source</label>
            <select value={fromAccount} onChange={e => setFromAccount(e.target.value)}>
              {user.accounts.filter(a => a.type !== 'investment').map(a => (
                <option key={a.id} value={a.id}>{a.name} ({formatCurrency(a.balance)})</option>
              ))}
            </select>
          </div>
          <div className="db-form-field">
            <label>Montant</label>
            <div className="db-amount-wrap">
              <span className="db-amount-prefix">$</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" className="db-amount-input" />
            </div>
            {currentAcc && <div className="db-field-hint">Solde: {formatCurrency(currentAcc.balance)}</div>}
          </div>
          <div className="db-form-field">
            <label>Motif (optionnel)</label>
            <input type="text" value={motif} onChange={e => setMotif(e.target.value)} placeholder="Ex: Loyer novembre" />
          </div>
          <button className="db-btn-primary" onClick={handleConfirmTransfer} disabled={!amount || parseFloat(amount) <= 0}>
            Confirmer le virement
          </button>
        </div>
        {showBlocked && (
          <TransferBlockedSheet
            user={user}
            benef={selectedBenef}
            amount={amount}
            onClose={() => { setShowBlocked(false); setView('main'); setAmount(''); setMotif(''); }}
          />
        )}
      </div>
    );
  }

  // ── Confirm view (recap before sending)
  if (view === 'confirm' && selectedBenef) {
    const currentAcc = user.accounts.find(a => a.id === fromAccount);
    return (
      <div className="db-tab-content db-slide-in">
        <div className="db-form-header">
          <button className="db-back-btn" onClick={() => setView('transfer')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <h3>Confirmation</h3>
        </div>
        <div className="db-form-card">
          <div className="db-confirm-rows">
            <div className="db-confirm-row"><span>Bénéficiaire</span><strong>{selectedBenef.name}</strong></div>
            <div className="db-confirm-row"><span>Compte</span><strong>{currentAcc?.name}</strong></div>
            <div className="db-confirm-row"><span>Montant</span><strong className="db-confirm-amount">{formatCurrency(parseFloat(amount))}</strong></div>
            {motif && <div className="db-confirm-row"><span>Motif</span><strong>{motif}</strong></div>}
          </div>
          <button className="db-btn-primary" onClick={handleConfirmTransfer}>Envoyer le virement</button>
        </div>
        {showBlocked && (
          <TransferBlockedSheet
            user={user}
            benef={selectedBenef}
            amount={amount}
            onClose={() => { setShowBlocked(false); setView('main'); setAmount(''); setMotif(''); }}
          />
        )}
      </div>
    );
  }

  // ── Main beneficiary list
  return (
    <div className="db-tab-content">
      {user.blocked && <BlockedBanner onClick={onShowBlock} />}
      <div className="db-section-row">
        <span className="db-section-title">Bénéficiaires</span>
        <button className="db-add-btn" onClick={() => setView('addBenef')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter
        </button>
      </div>
      {user.beneficiaries.length === 0 ? (
        <div className="db-empty"><div className="db-empty-text">Aucun bénéficiaire</div><div className="db-empty-sub">Ajoutez un bénéficiaire pour effectuer un virement</div></div>
      ) : (
        <div className="db-benef-list">
          {user.beneficiaries.map(b => (
            <div key={b.id} className="db-benef-wrap">
              <button className="db-benef-card" onClick={() => { setSelectedBenef(b); setView('transfer'); }}>
                <div className="db-benef-avatar">{b.name.charAt(0)}</div>
                <div className="db-benef-details">
                  <div className="db-benef-name">{b.name}</div>
                  <div className="db-benef-sub">{b.bank}{b.email ? ` — ${b.email}` : ''}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              {deletingId === b.id ? (
                <div className="db-benef-del-confirm">
                  <span>Supprimer ?</span>
                  <button className="db-del-yes" onClick={() => handleDeleteBenef(b.id)}>Oui</button>
                  <button className="db-del-no" onClick={() => setDeletingId(null)}>Non</button>
                </div>
              ) : (
                <button className="db-benef-del" onClick={() => setDeletingId(b.id)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab: RIB (no emojis, SVG icons) ──
function RibTab({ user }) {
  const { rib } = user;
  const [copied, setCopied] = useState('');
  const copy = (text, label) => { navigator.clipboard.writeText(text.replace(/\s/g, '')); setCopied(label); setTimeout(() => setCopied(''), 1500); };
  const fields = [
    { label: 'Titulaire', value: rib.accountHolder, icon: RibIcons.user },
    { label: 'Banque', value: rib.bankName, icon: RibIcons.bank },
    { label: 'N° de compte', value: rib.accountNumber, copy: true, icon: RibIcons.hash },
    { label: 'Clé RIB', value: rib.ribKey, icon: RibIcons.key },
    { label: 'Code banque', value: rib.bankCode, icon: RibIcons.building },
    { label: 'Code guichet', value: rib.branchCode, icon: RibIcons.pin },
    { label: 'IBAN', value: rib.iban, copy: true, icon: RibIcons.globe },
    { label: 'BIC / SWIFT', value: rib.bic, copy: true, icon: RibIcons.link },
    { label: 'Adresse agence', value: rib.branchAddress, icon: RibIcons.mail },
  ];

  return (
    <div className="db-tab-content">
      <div className="db-rib-card">
        <div className="db-rib-header">
          <img src={LOGO_URL} alt="BMO" className="db-rib-logo" />
          <div>
            <div className="db-rib-title">Relevé d'Identité Bancaire</div>
            <div className="db-rib-sub">{rib.accountHolder}</div>
          </div>
        </div>
        <div className="db-rib-fields">
          {fields.map((f, i) => (
            <div key={i} className="db-rib-row">
              <div className="db-rib-left">
                <div className="db-rib-icon">{f.icon}</div>
                <div><div className="db-rib-label">{f.label}</div><div className="db-rib-value">{f.value}</div></div>
              </div>
              {f.copy && (
                <button className={`db-copy-btn ${copied === f.label ? 'ok' : ''}`} onClick={() => copy(f.value, f.label)}>
                  {copied === f.label
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  }
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
  const totalBalance = user.accounts.reduce((s, a) => s + a.balance, 0);
  const colors = ['#0075be', '#2e7d32', '#f57c00'];
  return (
    <div className="db-tab-content">
      {user.blocked && <BlockedBanner onClick={onShowBlock} />}
      <div className="db-vue-total">
        <div className="db-vue-total-label">Patrimoine total</div>
        <div className="db-vue-total-amount">{formatCurrency(totalBalance)}</div>
      </div>
      <div className="db-vue-chart">
        {user.accounts.map((acc, i) => {
          const pct = (acc.balance / totalBalance) * 100;
          return (
            <div key={acc.id} className="db-vue-bar-row">
              <div className="db-vue-bar-label">
                <div className="db-vue-bar-dot" style={{ background: colors[i % colors.length] }} />
                <span>{acc.name}</span>
              </div>
              <div className="db-vue-bar-track">
                <div className="db-vue-bar-fill" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
              </div>
              <div className="db-vue-bar-value">{formatCurrency(acc.balance)}</div>
              <div className="db-vue-bar-pct">{pct.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>
      <div className="db-section-title">Répartition</div>
      <div className="db-vue-cards">
        {user.accounts.map((acc, i) => (
          <div key={acc.id} className="db-vue-card">
            <div className="db-vue-card-bar" style={{ background: colors[i % colors.length] }} />
            <div className="db-vue-card-info">
              <div className="db-vue-card-name">{acc.name}</div>
              <div className="db-vue-card-num">{acc.number}</div>
            </div>
            <div className="db-vue-card-right">
              <div className="db-vue-card-amount">{formatCurrency(acc.balance)}</div>
              {user.blocked && <div className="db-acct-frozen">Bloqué</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ──
export default function Dashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState('solde');
  const [loading, setLoading] = useState(true);
  const [showBlockSheet, setShowBlockSheet] = useState(false);
  const [initialBlockShown, setInitialBlockShown] = useState(false);

  useEffect(() => {
    if (!loading && user.blocked && !initialBlockShown) {
      const t = setTimeout(() => { setShowBlockSheet(true); setInitialBlockShown(true); }, 600);
      return () => clearTimeout(t);
    }
  }, [loading, user.blocked, initialBlockShown]);

  const handleQuickAction = (id) => {
    if (id === 'transfer') setActiveTab('virement');
    else if (id === 'look') setActiveTab('vue');
    else if (id === 'pay') { if (user.blocked) setShowBlockSheet(true); }
  };

  const tabs = [
    { id: 'solde', label: 'Solde', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
    { id: 'historique', label: 'Historique', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { id: 'virement', label: 'Virement', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
    { id: 'rib', label: 'RIB', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  ];

  if (loading) return <LoadingScreen onDone={() => setLoading(false)} />;

  return (
    <div className="db-container">
      <header className="db-header">
        <div className="db-header-bg">
          <div className="db-header-top">
            <div className="db-header-logo">
              <span className="db-logo-text">BMO</span>
              <img src={LOGO_URL} alt="BMO" className="db-logo-img" />
            </div>
            <div className="db-header-right">
              <button className="db-notif-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span className="db-notif-dot" />
              </button>
              <div className="db-avatar" onClick={onLogout} title="Déconnexion">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            </div>
          </div>
          <div className="db-greeting">
            <span className="db-greeting-text">{getGreeting()},</span>
            <span className="db-greeting-name"> {user.firstName}.</span>
          </div>
          <div className="db-date">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {formatDate()}
          </div>
        </div>
      </header>

      <main className="db-main">
        {activeTab === 'solde' && <SoldeTab user={user} onQuickAction={handleQuickAction} onShowBlock={() => setShowBlockSheet(true)} />}
        {activeTab === 'historique' && <HistoriqueTab user={user} />}
        {activeTab === 'virement' && <VirementTab user={user} setUser={setUser} onShowBlock={() => setShowBlockSheet(true)} />}
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
    </div>
  );
}
