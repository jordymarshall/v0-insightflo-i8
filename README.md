# InsightFlo

This is a Next.js VIBE project for InsightFlo, a survey and insights platform.
ALL VIBES IN HERE!

## Project Structure

The project is organized into the following sections:

- `/app/landing/` - Landing Page
- `/app/home/` - Home Page (Post Sign-In)
- `/app/account-settings/` - Account Settings Page
- `/app/survey-editor/` - Survey Editor (Context, Questions, Insights)
- `/app/survey-respondent/` - Respondent & Preview View

## Importing Existing Files

To complete the setup, you need to copy over all the `.tsx`, CSS, and asset files from the existing v0 chats into the corresponding folders:

1. **Landing Page vF** → `/app/landing/`
2. **Home Page (Post Sign-In)** → `/app/home/`
3. **Account Settings Page** → `/app/account-settings/` (+ its `layout.tsx`)
4. **Core Pages** → `/app/survey-editor/` (`survey-context-page.tsx`, `questions-page.tsx`, `insights-page.tsx`)
5. **Respondent & Preview** → `/app/survey-respondent/page.tsx` and `/app/survey-respondent/preview.tsx`

Ensure that all imports and paths resolve correctly, and merge any shared components under `/components/ui`.

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
