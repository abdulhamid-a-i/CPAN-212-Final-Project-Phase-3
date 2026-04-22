# CPAN-212-Final-Project-Phase-3

## Project Overview

A Full Stack Application built using MERN technologies to Manage and track books, shipments, inventory, and an online shop to allow customer to shop for books online.



## Setup

1. Place your PFX file in:
   - `backend-api/cert/server.pfx`

2. Configure `.env` in `backend-api/`

3. Configure `.env.local` in `frontend-api`

4. Install backend dependencies:
   ```bash
   npm install

5. Install frontend dependencies:
   ```bash
   npm install

## Environment Configuration

Configure Frontend Env:
```bash
   NEXT_PUBLIC_API_BASE_URL in frontend-web .env.local
```
Configure the following variables in Backend Env:
  ```bash 
   NODE_ENV
   PORT

   MONGODB_URI
   JWT_SECRET
   JWT_EXPIRES_IN

   FRONTEND_URL

   HTTPS_PFX_PATH
   HTTPS_PFX_PASSPHRASE

   KEYCLOAK_BASE_URL
   KEYCLOAK_REALM
   KEYCLOAK_ISSUER
   KEYCLOAK_JWKS_URL
   KEYCLOAK_CLIENT_ID
   KEYCLOAK_BACKEND_CLIENT_ID
   KEYCLOAK_BACKEND_CLIENT_SECRET
```
## Deployment

Build Docker image using `docker compose build --progress=plain`
Then start containers using `docker compose up -d`
