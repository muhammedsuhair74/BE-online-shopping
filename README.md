# Backend Application

A basic Node.js/Express backend application.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the application:**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-reload)
   npm run dev
   ```

3. **Access the API:**
   - Server runs on: `http://localhost:3000`
   - Health check: `http://localhost:3000/health`

## API Endpoints

### GET Routes
- `GET /` - Welcome message
- `GET /health` - Health check endpoint
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### POST Routes
- `POST /api/users` - Create a new user
  - Body: `{ "name": "John Doe", "email": "john@example.com" }`

## Testing with cURL

```bash
# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

## Project Structure

```
BE Project/
├── app.js          # Main application file
├── package.json    # Dependencies and scripts
├── .env           # Environment variables
└── README.md      # This file
```
# BE-online-shopping
