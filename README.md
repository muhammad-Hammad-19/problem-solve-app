# Help Hub

## Run locally

1. Create `backend/.env` with your local values:

   ```powershell
   Copy-Item .env.example backend\.env
   ```

2. Install dependencies and start the backend:

   ```powershell
   cd backend
   npm install
   npm run dev
   ```

3. In a second terminal, configure and start the frontend:

   ```powershell
   cd frontend
   npm install
   Set-Content .env.local "NEXT_PUBLIC_BASE_URL=http://localhost:5000"
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000). The API is available at [http://localhost:5000](http://localhost:5000).
