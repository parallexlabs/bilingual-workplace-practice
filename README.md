# Workplace practice

A small public browser prototype by ParalleX Labs Inc. Practise a project update or an e-mail to reschedule a meeting. Each scenario has three steps in English and French. Choose either interface language and either practice direction independently.

This is a demonstration. It makes no claim about any government program, test, level, client, result or certification. All names and situations are invented. French uses formal vous; English uses a neutral professional tone.

## Run

Open `index.html` in a current browser. No server, installation, dependencies or build step is required. Alternatively, from this folder run `python3 -m http.server 8000` and open `http://localhost:8000`. The same files work on GitHub Pages. Configure the repository's Pages source as GitHub Actions to use the included workflow.

## Practice and feedback

Choose a scenario and a practice language. Read the situation in the other language and the task in the language you are practising. Write a response, then check it. An example appears after the first non-empty attempt or when requested. Each step also includes target expressions, a register rule and a teaching note.

- Expressions match whole words or phrases, ignoring case and accents. Extra spaces and curved apostrophes are accepted. Accent differences are reported. Equivalent wording may not match.
- French register checks flag tu, toi, ton, ta and tes. English checks flag hey, yo, gonna, wanna, dude and lol. Context, including quotations, is not interpreted.
- On the e-mail greeting step, the first non-empty line must start with Bonjour or Bonsoir in French; Hello, Dear, Good morning or Good afternoon in English.
- On the closing step, the last two non-empty lines are checked for Cordialement, Bien à vous, Bonne journée or Merci in French; Kind regards, Best regards, Regards, Thank you or Thanks in English. The middle step has no greeting or closing check.
- Fewer than 8 words suggests a fuller response. More than 100 suggests a shorter response. These hints are not workplace writing requirements.

The prototype does not check grammar, meaning, factual accuracy, whether two times were actually proposed, or whether the response completes the task. Compare your writing with the example. Multiple responses can be appropriate. No score or language level is assigned.

## Privacy and progress

Nothing leaves the browser. There are no remote resources, accounts, cookies or analytics. Spelling checks are disabled on the response field. Responses are kept only in page memory and are lost on reload, closing the page or clearing progress.

Only self-assessments are saved, under one localStorage key: `workplace-practice.progress.v1`. Progress is separate for each scenario and practice language. It is not a measure of learning. File and hosted copies have separate storage. Browser policies can also restrict file storage.

Export downloads a JSON file containing only version information and self-assessments. There is no import feature. Clear removes the one key and resets the current session. If storage is unavailable, practice and session export still work. A visible notice explains that a previously saved copy cannot be removed while storage is inaccessible. The page does not clear unrelated browser data.

## Accessibility

The page aims for WCAG 2.2 AA: semantic controls, labelled fields, visible focus, text alongside colour, a polite live feedback region, keyboard navigation, reduced-motion support and a layout that adapts to 320 px. Focus moves to the step heading when you navigate steps. Interface and practice languages have appropriate language attributes. This is an intent, not a certification; assistive technology and contrast checks should be included in release review.

## Files and checks

The editable logic lives in ES modules in `js/`. The bilingual source text lives in `i18n/` and `data/scenarios/`. `js/content.js` contains the same embedded text for modules. `js/offline.js` is the checked-in file-compatible entry script, using the same logic and text without runtime imports or data loading. This allows direct file opening, which otherwise restricts module imports. There is no build step to run the app.

After editing sources or text, run `node scripts/sync-offline.js` to refresh the two checked-in copies. Run `npm test` with Node 22. Tests check snapshot parity, expression and accent matching, register, e-mail checks, length boundaries, translations, scenario completeness, storage failures and runtime network restrictions. They use only `node:test` and built-in modules. The workflow runs tests and punctuation checks before deploying the public files from main. Repository settings and hosted deployment require owner verification.

## Content and licence

French not yet reviewed by a professional translator.

Code is licensed under Apache-2.0; see LICENSE. Scenario text in `data/scenarios/` and its embedded copies is licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). Attribute Amir Daneshpajouh, ParalleX Labs Inc., and indicate changes when reusing scenario text. See CONTENT_LICENSE.md and CITATION.cff.
