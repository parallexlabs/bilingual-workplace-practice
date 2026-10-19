// File-compatible entry script. See scripts/sync-offline.js.
(() => {
'use strict';
// Embedded local content. See scripts/sync-offline.js.
const dictionaries = {
  "en": {
    "title": "Workplace practice",
    "pageTitle": "Workplace practice | Bilingual prototype",
    "intro": "Small workplace moments. Space to practise.",
    "description": "Choose a situation, write a short response and compare it with an example. Go at your own pace.",
    "prototype": "Public prototype by ParalleX Labs Inc.",
    "skip": "Skip to practice",
    "interface": "Interface language",
    "direction": "I want to practise",
    "practiseFr": "Practise French",
    "practiseEn": "Practise English",
    "scenarios": "Choose a scenario",
    "threeSteps": "3 short steps",
    "step": "Step {current} of {total}",
    "steps": "Scenario steps",
    "situation": "The situation",
    "task": "Your task",
    "expressions": "Expressions to try",
    "register": "Tone to use",
    "answerFr": "Your response in French",
    "answerEn": "Your response in English",
    "answerHint": "Aim for 8 to 100 words. Your response stays on this page and is never saved.",
    "check": "Check my response",
    "showExample": "Show example response",
    "example": "Example response",
    "note": "Practice tip",
    "feedback": "Your feedback",
    "feedbackIntro": "These are phrase, tone, length and applicable e-mail checks. They are not a score.",
    "found": "Found: {expression}",
    "accent": "Found with different accents: {expression}. Compare the accents with the example.",
    "missing": "Not found: {expression}",
    "informal": "Informal words found: {words}. Use a professional tone.",
    "registerOk": "No words from our informal word list were found. This does not confirm the tone is appropriate.",
    "lengthShort": "{count} words: try a fuller response of at least 8 words.",
    "lengthLong": "{count} words: consider a shorter response of no more than 100 words.",
    "lengthOk": "{count} words: within the suggested length of 8 to 100 words.",
    "greetingYes": "Greeting found at the start of the first line.",
    "greetingNo": "Add a greeting at the start, such as Hello or Bonjour.",
    "closingYes": "Polite closing found in the last two lines.",
    "closingNo": "Add a polite closing, such as Kind regards or Cordialement.",
    "limits": "This prototype does not check grammar or meaning; compare with the example response.",
    "emptyAnswer": "Write a response before checking it.",
    "assessment": "How do you feel about this step?",
    "assessmentHint": "Choose your own assessment. You can change it at any time.",
    "practice": "I need more practice",
    "almost": "Almost",
    "comfortable": "I’m comfortable",
    "unrated": "Not assessed",
    "savedAssessment": "Self-assessment updated.",
    "previous": "Previous step",
    "next": "Next step",
    "progress": "Your progress",
    "progressSummary": "{count} of {total} steps assessed",
    "progressHint": "Self-assessments are separate for French and English practice. They are your reflections, not measured results.",
    "privacy": "Nothing leaves your browser. Only your self-assessments are saved in localStorage on this browser, under one key. No accounts, cookies or analytics.",
    "storageUnavailable": "Saving is unavailable. You can keep practising and export progress for this session. Clearing removes progress from this session, but cannot remove a previously saved copy while storage is unavailable.",
    "export": "Export progress",
    "clear": "Clear progress",
    "exported": "Progress exported as a JSON file. Keep it somewhere private if needed.",
    "exportError": "The export could not be created in this browser.",
    "cleared": "Progress cleared.",
    "how": "How this works",
    "howRules": "Expressions are matched as whole words or phrases, ignoring case and accents. Curly and straight apostrophes match. Extra spaces between words are accepted. Differences in accents are noted. Equivalent wording may not match.",
    "howRegister": "For French, the register check flags tu, toi, ton, ta and tes. For English, it flags hey, yo, gonna, wanna, dude and lol. It cannot interpret context, including quotations.",
    "howEmail": "For the greeting step, the first non-empty line must start with Bonjour, Bonsoir, Hello, Dear, Good morning or Good afternoon, in the practice language. For the closing step, the last two non-empty lines are checked for Cordialement, Bien à vous, Bonne journée or Merci in French; Kind regards, Best regards, Regards, Thank you or Thanks in English. Other steps do not use these checks.",
    "howLength": "Fewer than 8 words prompts a fuller response; more than 100 prompts a shorter one. These are practice hints, not requirements for workplace writing.",
    "howExample": "An example appears after your first check, or whenever you request it. More than one response can work.",
    "howSynthetic": "The scenarios and names are invented. They contain no real workplace or personal information. This is a demonstration, with no claim about any government program, test, level, client or certification.",
    "howPrivacy": "All checks happen on this page. Nothing is sent anywhere. Your response is kept in memory only until the page closes or progress is cleared. Export contains only self-assessments. There is no import feature.",
    "translation": "French not yet reviewed by a professional translator.",
    "footer": "A space to practise, not an assessment or certification.",
    "english": "English",
    "french": "Français",
    "enableScript": "Enable JavaScript to use this offline practice page."
  },
  "fr": {
    "title": "Pratique au travail",
    "pageTitle": "Pratique au travail | Prototype bilingue",
    "intro": "Des situations de travail pour vous exercer.",
    "description": "Choisissez une situation, rédigez une courte réponse et comparez-la avec un exemple. Allez à votre rythme.",
    "prototype": "Prototype public de ParalleX Labs Inc.",
    "skip": "Aller à la pratique",
    "interface": "Langue de l’interface",
    "direction": "Je souhaite pratiquer",
    "practiseFr": "Pratiquer le français",
    "practiseEn": "Pratiquer l’anglais",
    "scenarios": "Choisissez un scénario",
    "threeSteps": "3 courtes étapes",
    "step": "Étape {current} sur {total}",
    "steps": "Étapes du scénario",
    "situation": "La situation",
    "task": "Votre tâche",
    "expressions": "Expressions à utiliser",
    "register": "Ton à adopter",
    "answerFr": "Votre réponse en français",
    "answerEn": "Votre réponse en anglais",
    "answerHint": "Visez de 8 à 100 mots. Votre réponse reste sur cette page et n’est jamais enregistrée.",
    "check": "Vérifier ma réponse",
    "showExample": "Afficher la réponse type",
    "example": "Réponse type",
    "note": "Conseil de pratique",
    "feedback": "Votre rétroaction",
    "feedbackIntro": "Ces vérifications portent sur les expressions, le ton, la longueur et, au besoin, le courriel. Elles ne donnent pas de note.",
    "found": "Repéré : {expression}",
    "accent": "Repéré avec des accents différents : {expression}. Comparez les accents avec l’exemple.",
    "missing": "Non repéré : {expression}",
    "informal": "Mots familiers repérés : {words}. Utilisez un ton professionnel.",
    "registerOk": "Aucun mot de notre liste de mots familiers n’a été repéré. Cela ne garantit pas que le ton convient.",
    "lengthShort": "{count} mots : essayez une réponse plus complète d’au moins 8 mots.",
    "lengthLong": "{count} mots : envisagez une réponse plus courte de 100 mots ou moins.",
    "lengthOk": "{count} mots : la longueur respecte la suggestion de 8 à 100 mots.",
    "greetingYes": "Salutation repérée au début de la première ligne.",
    "greetingNo": "Ajoutez une salutation au début, comme Bonjour ou Hello.",
    "closingYes": "Formule de politesse repérée dans les deux dernières lignes.",
    "closingNo": "Ajoutez une formule de politesse, comme Cordialement ou Kind regards.",
    "limits": "Ce prototype ne vérifie ni la grammaire ni le sens; comparez votre texte avec la réponse type.",
    "emptyAnswer": "Rédigez une réponse avant de la vérifier.",
    "assessment": "Comment vous sentez-vous à cette étape?",
    "assessmentHint": "Choisissez votre propre appréciation. Vous pouvez la modifier à tout moment.",
    "practice": "J’ai besoin de pratiquer davantage",
    "almost": "J’y suis presque",
    "comfortable": "Je suis à l’aise",
    "unrated": "Non évaluée",
    "savedAssessment": "Appréciation mise à jour.",
    "previous": "Étape précédente",
    "next": "Étape suivante",
    "progress": "Votre progression",
    "progressSummary": "{count} étapes évaluées sur {total}",
    "progressHint": "Les appréciations sont distinctes pour la pratique du français et de l’anglais. Ce sont vos réflexions, pas des résultats mesurés.",
    "privacy": "Rien ne quitte votre navigateur. Seules vos appréciations sont enregistrées dans le stockage local (localStorage) de ce navigateur, sous une seule clé. Aucun compte, témoin ou outil de mesure d’audience.",
    "storageUnavailable": "L’enregistrement est indisponible. Vous pouvez continuer et exporter la progression de cette séance. L’effacement retire la progression de cette séance, mais ne peut pas supprimer une copie déjà enregistrée tant que le stockage est inaccessible.",
    "export": "Exporter la progression",
    "clear": "Effacer la progression",
    "exported": "Progression exportée dans un fichier JSON. Conservez-le dans un endroit privé au besoin.",
    "exportError": "L’exportation n’a pas pu être créée dans ce navigateur.",
    "cleared": "Progression effacée.",
    "how": "Fonctionnement",
    "howRules": "Les expressions sont recherchées comme des mots ou des groupes de mots entiers, sans tenir compte des majuscules ni des accents. Les apostrophes courbes et droites sont équivalentes. Les espaces supplémentaires entre les mots sont acceptés. Les différences d’accents sont signalées. Une formulation équivalente peut ne pas être repérée.",
    "howRegister": "En français, la vérification du registre signale tu, toi, ton, ta et tes. En anglais, elle signale hey, yo, gonna, wanna, dude et lol. Elle ne peut pas interpréter le contexte, y compris les citations.",
    "howEmail": "À l’étape de la salutation, la première ligne non vide doit commencer par Bonjour, Bonsoir, Hello, Dear, Good morning ou Good afternoon, selon la langue pratiquée. À l’étape de la conclusion, les deux dernières lignes non vides sont vérifiées pour repérer Cordialement, Bien à vous, Bonne journée ou Merci en français; Kind regards, Best regards, Regards, Thank you ou Thanks en anglais. Ces vérifications ne s’appliquent pas aux autres étapes.",
    "howLength": "Un texte de moins de 8 mots donne lieu à une suggestion de réponse plus complète; au-delà de 100 mots, une réponse plus courte est suggérée. Il s’agit de conseils de pratique, pas de règles de rédaction au travail.",
    "howExample": "Une réponse type s’affiche après votre première vérification ou dès que vous la demandez. Plusieurs réponses peuvent convenir.",
    "howSynthetic": "Les scénarios et les noms sont inventés. Ils ne contiennent aucune donnée professionnelle ou personnelle réelle. Il s’agit d’une démonstration, sans prétention concernant un programme gouvernemental, un test, un niveau, un client ou une certification.",
    "howPrivacy": "Toutes les vérifications se font sur cette page. Rien n’est envoyé. Votre réponse reste en mémoire jusqu’à la fermeture de la page ou à l’effacement de la progression. L’exportation contient uniquement vos appréciations. Il n’y a pas de fonction d’importation.",
    "translation": "French not yet reviewed by a professional translator.",
    "footer": "Un espace de pratique, sans évaluation ni certification.",
    "english": "English",
    "french": "Français",
    "enableScript": "Activez JavaScript pour utiliser cette page de pratique hors ligne."
  }
};
const scenarioData = [
  {
    "id": "meeting",
    "title": {
      "en": "Team meeting: give a short project update",
      "fr": "Réunion d’équipe : faire le point sur un projet"
    },
    "steps": [
      {
        "id": 1,
        "title": {
          "en": "Open the update",
          "fr": "Commencer le point de situation"
        },
        "situation": {
          "en": "You are meeting with your colleague Camille to discuss an internal planning guide. Introduce a short update.",
          "fr": "Vous rencontrez votre collègue Camille pour discuter d’un guide de planification interne. Présentez une courte mise à jour."
        },
        "task": {
          "en": "Thank Camille for being there and introduce your project update.",
          "fr": "Remerciez Camille de sa présence et annoncez votre point sur le projet."
        },
        "expressions": {
          "en": [
            "thank you",
            "project update"
          ],
          "fr": [
            "merci de votre présence",
            "faire le point"
          ]
        },
        "register": {
          "en": "Use a neutral, professional tone.",
          "fr": "Utilisez le vouvoiement et un ton professionnel."
        },
        "answer": {
          "en": "Thank you for joining me, Camille. I would like to give you a short project update on the planning guide.",
          "fr": "Bonjour Camille, merci de votre présence. Je souhaite faire le point avec vous sur le guide de planification."
        },
        "note": {
          "en": "A brief opening helps your colleague understand the purpose of the update.",
          "fr": "Une courte introduction permet à votre collègue de comprendre l’objectif de votre intervention."
        }
      },
      {
        "id": 2,
        "title": {
          "en": "Explain a delay",
          "fr": "Expliquer un retard"
        },
        "situation": {
          "en": "The guide will be ready two days later than planned because a review took longer than expected.",
          "fr": "Le guide sera prêt deux jours plus tard que prévu, car une révision a pris plus de temps que prévu."
        },
        "task": {
          "en": "Report the two-day delay and explain its cause in one or two sentences.",
          "fr": "Signalez le retard de deux jours et expliquez sa cause en une ou deux phrases."
        },
        "expressions": {
          "en": [
            "two days",
            "because"
          ],
          "fr": [
            "deux jours",
            "en raison de"
          ]
        },
        "register": {
          "en": "Use a neutral, professional tone.",
          "fr": "Utilisez le vouvoiement et un ton professionnel."
        },
        "answer": {
          "en": "The guide will be delayed by two days because the review took longer than expected.",
          "fr": "La remise du guide est reportée de deux jours en raison de la révision, qui a pris plus de temps que prévu."
        },
        "note": {
          "en": "Give a concrete delay and a brief cause. Keep the explanation factual.",
          "fr": "Indiquez un délai précis et une cause brève. Présentez les faits simplement."
        }
      },
      {
        "id": 3,
        "title": {
          "en": "Agree on a next step",
          "fr": "Convenir de la prochaine étape"
        },
        "situation": {
          "en": "You can send a revised schedule this afternoon. You want Camille’s agreement before you proceed.",
          "fr": "Vous pouvez envoyer un calendrier révisé cet après-midi. Vous souhaitez obtenir l’accord de Camille avant de poursuivre."
        },
        "task": {
          "en": "Propose sending the revised schedule this afternoon and ask for agreement.",
          "fr": "Proposez d’envoyer le calendrier révisé cet après-midi et demandez l’accord de Camille."
        },
        "expressions": {
          "en": [
            "I suggest",
            "does that work for you"
          ],
          "fr": [
            "je vous propose",
            "est-ce que cela vous convient"
          ]
        },
        "register": {
          "en": "Use a neutral, professional tone.",
          "fr": "Utilisez le vouvoiement et un ton professionnel."
        },
        "answer": {
          "en": "I suggest sending you the revised schedule this afternoon. Does that work for you?",
          "fr": "Je vous propose de vous envoyer le calendrier révisé cet après-midi. Est-ce que cela vous convient?"
        },
        "note": {
          "en": "End with a clear action and an open invitation to agree or suggest a change.",
          "fr": "Terminez par une action précise et invitez votre collègue à donner son accord ou à proposer un changement."
        }
      }
    ]
  },
  {
    "id": "email",
    "title": {
      "en": "E-mail to a colleague: reschedule a meeting",
      "fr": "Courriel à un collègue : déplacer une réunion"
    },
    "steps": [
      {
        "id": 1,
        "title": {
          "en": "Greeting and purpose",
          "fr": "Salutation et objectif"
        },
        "situation": {
          "en": "You have a scheduling conflict with your meeting with Alex. Start an e-mail to ask about moving it.",
          "fr": "Un conflit d’horaire vous empêche de participer à votre réunion avec Alex. Commencez un courriel pour demander de la déplacer."
        },
        "task": {
          "en": "Greet Alex and explain that you would like to reschedule the meeting.",
          "fr": "Saluez Alex et expliquez que vous souhaitez déplacer la réunion."
        },
        "expressions": {
          "en": [
            "hello",
            "reschedule our meeting"
          ],
          "fr": [
            "bonjour",
            "déplacer notre réunion"
          ]
        },
        "register": {
          "en": "Use a neutral, professional tone.",
          "fr": "Utilisez le vouvoiement et un ton professionnel."
        },
        "answer": {
          "en": "Hello Alex,\nI would like to reschedule our meeting because of a scheduling conflict.",
          "fr": "Bonjour Alex,\nJe souhaite déplacer notre réunion en raison d’un conflit d’horaire."
        },
        "note": {
          "en": "A simple greeting and a clear purpose help your colleague respond.",
          "fr": "Une salutation simple et un objectif clair facilitent la réponse de votre collègue."
        },
        "emailPart": "greeting"
      },
      {
        "id": 2,
        "title": {
          "en": "Offer two times",
          "fr": "Proposer deux créneaux"
        },
        "situation": {
          "en": "You are available on Tuesday at 10 a.m. or Thursday at 2 p.m. Offer both options to Alex.",
          "fr": "Vous êtes disponible mardi à 10 h ou jeudi à 14 h. Proposez ces deux possibilités à Alex."
        },
        "task": {
          "en": "Offer both times and ask which one works for Alex.",
          "fr": "Proposez les deux créneaux et demandez à Alex lequel lui convient."
        },
        "expressions": {
          "en": [
            "Tuesday at 10 a.m.",
            "Thursday at 2 p.m.",
            "which time"
          ],
          "fr": [
            "mardi à 10 h",
            "jeudi à 14 h",
            "quel créneau"
          ]
        },
        "register": {
          "en": "Use a neutral, professional tone.",
          "fr": "Utilisez le vouvoiement et un ton professionnel."
        },
        "answer": {
          "en": "Would Tuesday at 10 a.m. or Thursday at 2 p.m. work for you? Please let me know which time you prefer.",
          "fr": "Seriez-vous disponible mardi à 10 h ou jeudi à 14 h? Pourriez-vous m’indiquer quel créneau vous convient le mieux?"
        },
        "note": {
          "en": "Offering two specific times makes it easier to choose.",
          "fr": "Deux créneaux précis facilitent le choix."
        }
      },
      {
        "id": 3,
        "title": {
          "en": "Close politely",
          "fr": "Terminer avec courtoisie"
        },
        "situation": {
          "en": "Finish your e-mail to Alex. Thank your colleague for considering the change and use a polite closing.",
          "fr": "Terminez votre courriel à Alex. Remerciez votre collègue de prendre en compte ce changement et ajoutez une formule de politesse."
        },
        "task": {
          "en": "Thank Alex and close the e-mail politely. Use the invented sender name Morgan if you wish.",
          "fr": "Remerciez Alex et terminez le courriel avec courtoisie. Vous pouvez signer du prénom fictif Morgan."
        },
        "expressions": {
          "en": [
            "thank you",
            "kind regards"
          ],
          "fr": [
            "merci de votre compréhension",
            "cordialement"
          ]
        },
        "register": {
          "en": "Use a neutral, professional tone.",
          "fr": "Utilisez le vouvoiement et un ton professionnel."
        },
        "answer": {
          "en": "Thank you for considering this change. I look forward to hearing from you.\nKind regards,\nMorgan",
          "fr": "Merci de votre compréhension. Dans l’attente de votre réponse, je vous souhaite une bonne journée.\nCordialement,\nMorgan"
        },
        "note": {
          "en": "Keep the closing brief. Choose a formula that suits a professional exchange.",
          "fr": "Gardez une conclusion brève. Choisissez une formule adaptée à un échange professionnel."
        },
        "emailPart": "closing"
      }
    ]
  }
];


function translate(language, key, values = {}) {
  const template = dictionaries[language]?.[key];
  if (typeof template !== 'string') throw new Error(`Missing translation: ${language}.${key}`);
  return template.replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(values, name) ? String(values[name]) : match);
}

const INFORMAL = {
  fr: ['tu', 'toi', 'ton', 'ta', 'tes'],
  en: ['hey', 'yo', 'gonna', 'wanna', 'dude', 'lol']
};

function normalize(text) {
  return String(text).normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase().replace(/[’‘]/g, "'");
}

function contains(text, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'u').test(text);
}

function checkAnswer(answer, { language, expressions, emailPart = null }) {
  const text = String(answer);
  const folded = normalize(text);
  const original = text.normalize('NFC').toLocaleLowerCase().replace(/[’‘]/g, "'");
  const words = text.trim().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || [];
  const result = {
    expressions: expressions.map(expression => ({
      expression,
      found: contains(folded, normalize(expression)),
      accentOnly: contains(folded, normalize(expression)) && !contains(original, expression.normalize('NFC').toLocaleLowerCase().replace(/[’‘]/g, "'"))
    })),
    informal: INFORMAL[language].filter(word => contains(folded, word)),
    words: words.length,
    length: words.length < 8 ? 'short' : words.length > 100 ? 'long' : 'ok',
    email: null
  };
  if (emailPart) {
    const greetings = language === 'fr' ? ['bonjour', 'bonsoir'] : ['hello', 'dear', 'good morning', 'good afternoon'];
    const closings = language === 'fr' ? ['cordialement', 'bien à vous', 'bonne journée', 'merci'] : ['kind regards', 'best regards', 'regards', 'thank you', 'thanks'];
    const lines = text.split(/\n/).map(line => line.trim()).filter(Boolean);
    const first = normalize(lines[0] || '');
    const last = normalize(lines.slice(-2).join(' '));
    result.email = {
      part: emailPart,
      greeting: emailPart === 'greeting' ? greetings.some(word => first.startsWith(normalize(word)) && contains(first, normalize(word))) : null,
      closing: emailPart === 'closing' ? closings.some(word => contains(last, normalize(word))) : null
    };
  }
  return result;
}

const STORAGE_KEY = 'workplace-practice.progress.v1';

function emptyProgress() { return { version: 1, progress: {} }; }

function cleanProgress(value) {
  const clean = emptyProgress();
  if (value?.version !== 1 || !value.progress || typeof value.progress !== 'object') return clean;
  for (const [key, rating] of Object.entries(value.progress)) {
    if (/^(meeting|email):(en|fr):[1-3]$/.test(key) && ['practice', 'almost', 'comfortable'].includes(rating)) clean.progress[key] = rating;
  }
  return clean;
}

function createStorage(getStorage = () => globalThis.localStorage) {
  let available = true;
  return {
    get available() { return available; },
    load() {
      try {
        const raw = getStorage().getItem(STORAGE_KEY);
        return raw ? cleanProgress(JSON.parse(raw)) : emptyProgress();
      } catch { available = false; return emptyProgress(); }
    },
    save(value) {
      try { getStorage().setItem(STORAGE_KEY, JSON.stringify(cleanProgress(value))); available = true; return true; }
      catch { available = false; return false; }
    },
    clear() {
      try { getStorage().removeItem(STORAGE_KEY); available = true; return true; }
      catch { available = false; return false; }
    }
  };
}

function exportProgress(value) { return JSON.stringify(cleanProgress(value), null, 2); }


const scenarios = scenarioData;
function progressKey(scenarioId, language, stepId) {
  return `${scenarioId}:${language}:${stepId}`;
}


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

})();
