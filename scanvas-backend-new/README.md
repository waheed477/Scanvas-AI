---
title: Scanvas Backend
emoji: 🚀
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# Scanvas Backend

Accessibility auditor backend API for Scanvas.

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/audit` - Run accessibility audit
- `GET /api/history` - Get audit history

## Environment Variables

Required variables (add in Settings → Variables and secrets):

| Variable | Description |
|----------|-------------|
| `MONGODB_ATLAS_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | NextAuth secret key |
| `NEXTAUTH_URL` | Your backend URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `PUPPETEER_SKIP_DOWNLOAD` | Set to `true` |

## Frontend

Frontend is deployed on Netlify: [scanvas.netlify.app](https://scanvas.netlify.app)

## License

MIT