# Campus Marketplace – Frontend

## Requirements

- Node.js v18+
- Backend running locally at `http://127.0.0.1:8000`

## Check Node Version

```bash
node -v
```

## Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend` with:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Run the App

```bash
npm run dev
```

Open `http://localhost:3000`.

Make sure the backend is running at `http://127.0.0.1:8000` and that `http://127.0.0.1:8000/docs` loads.
