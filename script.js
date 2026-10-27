'use strict';
// Zentrale Preiskonfiguration: Eurobeträge und Laufzeiten ausschließlich hier ändern.
const PRICING = Object.freeze({
  basic: Object.freeze({ call: 99, video: 129 }),
  standard: Object.freeze({ 3: 149, 6: 129 }),
  premium: Object.freeze({ 3: 299, 6: 269 })
});
const euro = value => new Intl.NumberFormat('de-DE', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0
}).format(value);
let selectedMonths = 3;
let selectedPackage = '';
const interest = document.querySelector('#interest');
function showInterest() {
  if (!selectedPackage) return;
  const term = selectedPackage === 'Basic' ? 'einmalig' : `${selectedMonths} Monate`;
  interest.textContent = `Deine unverbindliche Auswahl: ${selectedPackage} · ${term}. Diese Auswahl wird nicht versendet und ist keine Buchung.`;
}
function updatePrices(months) {
  if (![3, 6].includes(months)) return;
  selectedMonths = months;
  for (const plan of ['standard', 'premium']) {
    const monthly = PRICING[plan][months];
    document.querySelector(`#${plan}-price`).textContent = euro(monthly);
    document.querySelector(`#${plan}-total`).textContent = `${months} Monate · Gesamtpreis ${euro(monthly * months)}`;
  }
  document.querySelectorAll('[data-months]').forEach(button => {
    button.setAttribute('aria-pressed', String(Number(button.dataset.months) === months));
  });
  document.querySelector('#price-status').textContent = `${months} Monate ausgewählt. Standard: ${euro(PRICING.standard[months])} pro Monat, insgesamt ${euro(PRICING.standard[months] * months)}. Premium: ${euro(PRICING.premium[months])} pro Monat, insgesamt ${euro(PRICING.premium[months] * months)}.`;
  showInterest();
}
document.querySelector('[data-price="basicCall"]').textContent = euro(PRICING.basic.call);
document.querySelector('[data-price="basicVideo"]').textContent = euro(PRICING.basic.video);
document.querySelector('#all-rates').textContent = ['standard', 'premium'].map(plan => {
  const name = plan[0].toUpperCase() + plan.slice(1);
  return `${name}: ` + [3, 6].map(months => `${months} × ${euro(PRICING[plan][months])} = ${euro(months * PRICING[plan][months])}`).join(' oder ') + '.';
}).join(' ');
document.querySelectorAll('[data-months]').forEach(button => {
  button.addEventListener('click', () => updatePrices(Number(button.dataset.months)));
});
document.querySelectorAll('[data-package]').forEach(link => {
  link.addEventListener('click', () => { selectedPackage = link.dataset.package; showInterest(); });
});
const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
navigation.dataset.enhanced = 'true';
navigation.dataset.open = 'false';
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.dataset.open = String(open);
  menu.textContent = open ? 'Schließen' : 'Menü';
});
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.dataset.open = 'false';
  menu.textContent = 'Menü';
}
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
});
// Sprünge zu den Rechtshinweisen öffnen den jeweiligen Hinweis auch automatisch.
function openLegalNotice() {
  if (['#impressum', '#datenschutz'].includes(location.hash)) {
    document.querySelector(location.hash).open = true;
  }
}
window.addEventListener('hashchange', openLegalNotice);
openLegalNotice();
updatePrices(3);
