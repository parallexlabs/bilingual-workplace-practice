import { translate } from './i18n.js';
import { scenarios, progressKey } from './scenarios.js';
import { checkAnswer } from './feedback.js';
import { createStorage, emptyProgress, exportProgress } from './storage.js';

const store = createStorage();
const state = { ui: 'en', language: 'fr', scenario: 'meeting', step: 0, progress: store.load(), drafts: {}, examples: {}, feedback: {} };
const root = document.getElementById('app');
const t = (key, values) => translate(state.ui, key, values);
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const currentScenario = () => scenarios.find(scenario => scenario.id === state.scenario);
const currentStep = () => currentScenario().steps[state.step];
const keyFor = (step = currentStep(), scenario = currentScenario()) => progressKey(scenario.id, state.language, step.id);
const button = (id, label, extra = '') => `<button type="button" id="${id}" ${extra}>${escape(label)}</button>`;
const translatedParagraph = key => `<p>${escape(t(key))}</p>`;

function announce(key) {
  const region = document.getElementById('announcements');
  region.textContent = '';
  window.setTimeout(() => { region.textContent = t(key); }, 20);
}

function feedbackMarkup(result) {
  const items = result.expressions.map(item => `<li class="${item.found ? 'found' : 'missing'}">${escape(t(item.accentOnly ? 'accent' : item.found ? 'found' : 'missing', { expression: item.expression }))}</li>`);
  items.push(`<li>${escape(result.informal.length ? t('informal', { words: result.informal.join(', ') }) : t('registerOk'))}</li>`);
  items.push(`<li>${escape(t({ short: 'lengthShort', long: 'lengthLong', ok: 'lengthOk' }[result.length], { count: result.words }))}</li>`);
  if (result.email?.greeting !== null && result.email?.greeting !== undefined) items.push(`<li>${escape(t(result.email.greeting ? 'greetingYes' : 'greetingNo'))}</li>`);
  if (result.email?.closing !== null && result.email?.closing !== undefined) items.push(`<li>${escape(t(result.email.closing ? 'closingYes' : 'closingNo'))}</li>`);
  return `<h3>${escape(t('feedback'))}</h3>${translatedParagraph('feedbackIntro')}<ul>${items.join('')}</ul><p class="limit">${escape(t('limits'))}</p>`;
}

function render(focusId) {
  const scenario = currentScenario();
  const step = currentStep();
  const key = keyFor();
  const language = state.language;
  const other = language === 'fr' ? 'en' : 'fr';
  document.documentElement.lang = state.ui;
  document.title = t('pageTitle');
  document.getElementById('skip').textContent = t('skip');
  root.innerHTML = `
    <header class="masthead"><a class="wordmark" href="#practice">${escape(t('title'))}<span>${escape(t('prototype'))}</span></a>
      <div class="interface"><label for="interface-language">${escape(t('interface'))}</label>
      <select id="interface-language"><option value="en" lang="en" ${state.ui === 'en' ? 'selected' : ''}>${escape(t('english'))}</option><option value="fr" lang="fr" ${state.ui === 'fr' ? 'selected' : ''}>${escape(t('french'))}</option></select></div>
    </header>
    <main>
      <div class="introduction"><h1>${escape(t('intro'))}</h1><p>${escape(t('description'))}</p></div>
      <div class="workspace">
        <aside class="sidebar">
          <label class="section-label" for="practice-language">${escape(t('direction'))}</label>
          <select id="practice-language"><option value="fr" ${language === 'fr' ? 'selected' : ''}>${escape(t('practiseFr'))}</option><option value="en" ${language === 'en' ? 'selected' : ''}>${escape(t('practiseEn'))}</option></select>
          <h2 class="section-label">${escape(t('scenarios'))}</h2>
          <div class="scenario-list">${scenarios.map(item => {
            const count = item.steps.filter(itemStep => state.progress.progress[keyFor(itemStep, item)]).length;
            return `<button type="button" data-scenario="${item.id}" id="scenario-${item.id}" aria-pressed="${item.id === scenario.id}"><span>${escape(item.title[state.ui])}</span><small>${escape(t('threeSteps'))}</small><small>${escape(t('progressSummary', { count, total: item.steps.length }))}</small></button>`;
          }).join('')}</div>
          <section class="progress" aria-labelledby="progress-title"><h2 id="progress-title">${escape(t('progress'))}</h2><p class="small">${escape(t('progressHint'))}</p>
            <ol>${scenario.steps.map(item => `<li><span>${escape(item.title[state.ui])}</span><strong>${escape(t(state.progress.progress[keyFor(item)] || 'unrated'))}</strong></li>`).join('')}</ol>
          </section>
        </aside>
        <section class="practice" id="practice" tabindex="-1" aria-labelledby="scenario-title">
          <div class="practice-heading"><p class="step-count">${escape(t('step', { current: state.step + 1, total: scenario.steps.length }))}</p><h2 id="scenario-title">${escape(scenario.title[state.ui])}</h2></div>
          <nav class="step-nav" aria-label="${escape(t('steps'))}">${scenario.steps.map((item, index) => `<button type="button" data-step="${index}" id="step-${index}" ${index === state.step ? 'aria-current="step"' : ''}><span aria-hidden="true">${index + 1}</span>${escape(item.title[state.ui])}</button>`).join('')}</nav>
          <h3 id="step-title" tabindex="-1">${escape(step.title[state.ui])}</h3>
          <div class="situation"><h4>${escape(t('situation'))}</h4><p lang="${other}">${escape(step.situation[other])}</p></div>
          <div class="task"><h4>${escape(t('task'))}</h4><p lang="${language}">${escape(step.task[language])}</p></div>
          <div class="expression-block"><h4>${escape(t('expressions'))}</h4><ul lang="${language}">${step.expressions[language].map(item => `<li>${escape(item)}</li>`).join('')}</ul></div>
          <p class="register"><strong>${escape(t('register'))}:</strong> <span lang="${language}">${escape(step.register[language])}</span></p>
          <form id="answer-form" novalidate><label for="answer">${escape(t(language === 'fr' ? 'answerFr' : 'answerEn'))}</label>
            <p id="answer-hint" class="small">${escape(t('answerHint'))}</p>
            <textarea id="answer" lang="${language}" rows="6" spellcheck="false" autocomplete="off" autocapitalize="off" aria-describedby="answer-hint answer-error">${escape(state.drafts[key] || '')}</textarea>
            <p id="answer-error" class="error" role="alert"></p>
            <div class="actions"><button type="submit" class="primary">${escape(t('check'))}</button>${button('show-example', t('showExample'), `aria-controls="example" aria-expanded="${Boolean(state.examples[key])}"`)}</div>
          </form>
          <section id="feedback" class="feedback" aria-live="polite" aria-atomic="true">${state.feedback[key] ? feedbackMarkup(state.feedback[key]) : ''}</section>
          <section id="example" class="example" ${state.examples[key] ? '' : 'hidden'} aria-labelledby="example-title"><h3 id="example-title">${escape(t('example'))}</h3><blockquote lang="${language}">${escape(step.answer[language])}</blockquote><h4>${escape(t('note'))}</h4><p lang="${language}">${escape(step.note[language])}</p></section>
          <fieldset class="assessment"><legend>${escape(t('assessment'))}</legend><p class="small">${escape(t('assessmentHint'))}</p><div>${['practice', 'almost', 'comfortable'].map(rating => button(`rating-${rating}`, t(rating), `data-rating="${rating}" aria-pressed="${state.progress.progress[key] === rating}"`)).join('')}</div></fieldset>
          <div class="step-actions">${button('previous', t('previous'), state.step === 0 ? 'disabled' : '')}${button('next', t('next'), state.step === scenario.steps.length - 1 ? 'disabled' : '')}</div>
        </section>
      </div>
      <section class="privacy" aria-label="${escape(t('progress'))}"><p>${escape(t('privacy'))}</p><p id="storage-warning" class="error" ${store.available ? 'hidden' : ''}>${escape(t('storageUnavailable'))}</p><div class="actions">${button('export', t('export'))}${button('clear', t('clear'), 'class="clear"')}</div></section>
      <details class="how"><summary>${escape(t('how'))}</summary>${['howRules', 'howRegister', 'howEmail', 'howLength', 'howExample', 'limits', 'howSynthetic', 'howPrivacy', 'translation'].map(translatedParagraph).join('')}</details>
    </main><footer><p>${escape(t('footer'))}</p></footer>`;
  if (focusId) document.getElementById(focusId)?.focus();
}

function revealExample() {
  state.examples[keyFor()] = true;
  document.getElementById('example').hidden = false;
  document.getElementById('show-example').setAttribute('aria-expanded', 'true');
}

root.addEventListener('input', event => {
  if (event.target.id === 'answer') state.drafts[keyFor()] = event.target.value;
});
root.addEventListener('change', event => {
  if (event.target.id === 'interface-language') { state.ui = event.target.value; render('interface-language'); }
  if (event.target.id === 'practice-language') { state.language = event.target.value; render('practice-language'); }
});
root.addEventListener('submit', event => {
  if (event.target.id !== 'answer-form') return;
  event.preventDefault();
  const field = document.getElementById('answer');
  state.drafts[keyFor()] = field.value;
  const error = document.getElementById('answer-error');
  error.textContent = '';
  if (!field.value.trim()) {
    error.textContent = t('emptyAnswer');
    field.setAttribute('aria-invalid', 'true');
    field.focus();
    return;
  }
  field.removeAttribute('aria-invalid');
  const step = currentStep();
  const result = checkAnswer(field.value, { language: state.language, expressions: step.expressions[state.language], emailPart: step.emailPart });
  state.feedback[keyFor()] = result;
  const region = document.getElementById('feedback');
  region.hidden = false;
  region.innerHTML = feedbackMarkup(result);
  revealExample();
});
root.addEventListener('click', event => {
  const target = event.target.closest('button');
  if (!target || target.disabled) return;
  if (target.dataset.scenario) { state.scenario = target.dataset.scenario; state.step = 0; render('scenario-title'); document.getElementById('practice').focus(); }
  else if (target.dataset.step !== undefined) { state.step = Number(target.dataset.step); render('step-title'); }
  else if (target.dataset.rating) {
    state.progress.progress[keyFor()] = target.dataset.rating;
    store.save(state.progress);
    render(target.id);
    announce(store.available ? 'savedAssessment' : 'storageUnavailable');
  }
  else if (target.id === 'previous' || target.id === 'next') { state.step += target.id === 'next' ? 1 : -1; render('step-title'); }
  else if (target.id === 'show-example') { revealExample(); document.getElementById('example-title').setAttribute('tabindex', '-1'); document.getElementById('example-title').focus(); }
  else if (target.id === 'clear') {
    state.progress = emptyProgress(); state.drafts = {}; state.feedback = {}; state.examples = {};
    store.clear(); render('clear'); announce(store.available ? 'cleared' : 'storageUnavailable');
  }
  else if (target.id === 'export') {
    let url;
    try {
      url = URL.createObjectURL(new Blob([exportProgress(state.progress)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url; link.download = 'workplace-progress.json'; document.body.append(link); link.click(); link.remove();
      announce('exported');
    } catch { announce('exportError'); }
    finally { if (url) window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
  }
});

render();
