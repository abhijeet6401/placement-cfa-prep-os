# CaseRoom

A personal case interview practice website for product management, business analyst, and consulting interviews. Upload a PNG/JPG/WebP screenshot, review the extracted case text, then practice one question at a time with adaptive follow-ups, optional hints, and an evidence-based review.

## Features

- Image input up to 8 MB; extracted text is editable before starting.
- Three interview tracks; beginner/intermediate/advanced difficulty; interview or coaching style.
- Server-side OpenAI Responses API integration. Keys never reach the browser.
- Structured scorecard across clarification, structure, analysis, judgment, and communication.
- Browser-local session history and Markdown transcript export.
- Six sample cases with clearly labeled guided practice when AI is not configured. Sample mode does not evaluate answers or fabricate scores.
- Private Sites hosting and a server-side authenticated-user check on AI routes.

## Local development

Requires Node.js 22 or later. No dependencies or package installation are required.

```sh
node scripts/build.mjs
node --test tests/server.test.mjs
node scripts/validate-artifact.mjs
node --env-file-if-exists=.env.local scripts/dev.mjs
```

Open http://127.0.0.1:3100. The local server binds to loopback and injects a local development identity; do not expose it to the internet. The production Worker relies on Sites identity headers and must stay owner-private. To host elsewhere, implement a trusted authentication boundary before enabling AI.

## AI configuration

Use secure key setup to provision `OPENAI_API_KEY`; `.env.local` is ignored by Git. Production reads the key from the Worker environment, configured as a Sites secret. `OPENAI_MODEL` defaults to `gpt-4.1-mini` and can be overridden server-side. Deploy after changing environment values. The app reports connection availability separately from runtime errors such as invalid credentials or insufficient API credits.

## Source and deployment

### GitHub Pages

Run `node scripts/build-pages.mjs` to create `pages/index.html`. Publish the contents of `pages/` at the root of the `gh-pages` branch, then select **Settings → Pages → Deploy from a branch → gh-pages → / (root)**. The Pages edition explicitly runs in guided practice mode: GitHub Pages cannot execute the secure AI Worker. Never put an API key into frontend code or the Pages branch.

`src/` contains the frontend; `worker/index.js` contains the server routes and interview instructions. `scripts/build.mjs` creates one self-contained `dist/server/index.js` and copies the hosting manifest. `dist/` is generated. Publish using the Sites source workflow and the existing project ID in `.openai/hosting.json`.

## Data handling

Images, case text, and conversation history are sent to OpenAI for AI interactions with `store: false`. The app does not write images or conversations to a server database. Text sessions are saved in browser localStorage (up to 30); images are excluded. Clearing browser data removes history. Use export for a durable copy. Client-provided history is not a trusted assessment record.

AI requests are limited to a 10 MB body, 18,000 characters of case text, 60 messages, and 8,000 characters per message. A per-isolate throttle reduces accidental repeated requests; it is not a distributed quota system. The app is designed for one private owner.

## Verification limits

Server and frontend logic have automated coverage using Node's test runner. Live AI requires an API key and sufficient credits. Browser visual verification should be performed when browser automation is available.
