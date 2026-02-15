# KAI - Premium AI Wellness Companion ✨
The most advanced student-focused wellness companion with empathetic AI support, voice and video analysis, and a beautiful glassmorphism UI.

## Overview 🌟
KAI transforms student wellness support with intelligent content analysis, a friendly conversational agent, and engaging activities. Built with Next.js and Genkit, it delivers instant personalized recommendations, voice and video check-ins, and a gamified dashboard experience.

## Features ✨
Smart Wellness Support 🧠
- Mood-aware AI chat with empathetic responses and actionable recommendations. 💬
- Voice check-in with emotional analysis and a spoken TTS response. 🎙️
- Video check-in with facial emotion analysis and confidence scores. 🎥
- Personalized wellness activities generated from user inputs. 🌿

Premium UI and UX 🎨
- Glassmorphism design with gradients and soft translucency. 🫧
- Smooth animations and polished micro-interactions. ✨
- Responsive layouts across desktop and mobile. 📱
- PDF export for voice and video analysis reports. 🧾

Advanced Functionality 🚀
- Dedicated dashboard with insights, grove, and activities. 📊
- Fast client-side interactions and server actions. ⚡
- Firebase Auth and Firestore integration. 🔒

## Usage 🎮
Quick access points:
- Home hub: `/home` 🏠
- AI chat: `/chat` 🤖
- Voice analysis: `/voice-chat` 🎙️
- Video analysis: `/video-chat` 🎥
- Dashboard: `/dashboard` 📈

Smart analysis behavior:
- Voice check-ins analyze a 10-second recording and return a summary plus TTS audio. 🗣️
- Video check-ins analyze a 5-second clip and return emotion confidence scores. 😄
- Text chat provides personalized wellness recommendations based on mood and message context. 🌈

## Installation 🛠️
From source (recommended for development):

```bash
npm install
```

Run the app:

```bash
npm run dev
```

The dev server runs on `http://localhost:9002`.

## Configuration ⚙️
Environment variables:

Create a `.env` file in the project root:

```bash
GOOGLE_API_KEY=your_google_ai_api_key
```

Notes:
- The video analysis flow currently uses an inline API key in [src/ai/flows/video-analysis-flow.ts](src/ai/flows/video-analysis-flow.ts). For production use, move this into an environment variable and rotate the key. 🔑
- Firebase client configuration lives in [src/lib/firebase.ts](src/lib/firebase.ts). For multi-environment setups, consider moving values to `NEXT_PUBLIC_...` env variables. 🔥

## Project Structure 🧩
```
src/
	ai/                # Genkit setup and AI flows
	app/               # Next.js routes and server actions
	components/        # UI and feature components
	hooks/             # Reusable hooks
	lib/               # Firebase config and shared utilities
```

## AI Flows 🤖
- Personalized recommendations: [src/ai/flows/personalized-wellness-recommendations.ts](src/ai/flows/personalized-wellness-recommendations.ts) 💡
- Voice analysis with TTS: [src/ai/flows/voice-analysis-flow.ts](src/ai/flows/voice-analysis-flow.ts) 🎧
- Video emotion analysis: [src/ai/flows/video-analysis-flow.ts](src/ai/flows/video-analysis-flow.ts) 🎬

## Scripts 📜
- `npm run dev` - Start Next.js dev server (Turbopack) on port 9002 🧪
- `npm run build` - Production build 🏗️
- `npm run start` - Start production server 🚀
- `npm run lint` - Lint 🧹
- `npm run typecheck` - TypeScript type checks 🔍
- `npm run genkit:dev` - Start Genkit for AI flows 🤖

## Technical Details 🧰
Architecture highlights:
- Next.js App Router with server actions for AI chat. 🧭
- Genkit flows for recommendations, voice analysis, and video analysis. 🧪
- Firebase Auth and Firestore for user state and data. 🔐
- Modern UI patterns with Radix UI and Tailwind CSS. 🎯

## Privacy and Safety 🛡️
- KAI provides wellness support content and is not a medical professional. 🧑‍⚕️
- It does not offer diagnoses, crisis counseling, or emergency services. 🚫
- If you need urgent help, contact local emergency services or a trusted professional. 🆘

## Troubleshooting 🧯
- No mic/camera access: Ensure browser permissions are enabled for the site. 🎙️
- Genkit errors: Verify `GOOGLE_API_KEY` and check Genkit logs. 🧩
- Build issues: Run `npm run typecheck` and `npm run lint`. 🧪

## Support 💬
- Bug reports: open an issue in your tracker. 🐛
- Feature requests: share ideas in discussions or issues. 💡
- Documentation: update this README as new features ship. 📚
