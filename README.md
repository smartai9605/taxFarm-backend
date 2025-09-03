# TaxFarm Backend API

Express.js backend with TypeScript and MongoDB for the TaxFarm application.

## Features

- Express.js with TypeScript
- MongoDB with Mongoose
- CORS enabled
- Security headers with Helmet
- Request logging with Morgan
- Environment-based configuration
- Health check endpoint

## Local Development

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```

3. Update the `.env` file with your configuration:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/taxfarm
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:5000`

## Production Build

```bash
npm run build
npm start
```

## API Endpoints

- `GET /` - Welcome message and API info
- `GET /health` - Health check endpoint
- `/api/users` - User management routes

## Vercel Deployment

This backend is configured for deployment on Vercel.

### Prerequisites

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

### Environment Variables Setup

Before deploying, set up the following environment variables in your Vercel dashboard or using the CLI:

```bash
vercel env add NODE_ENV
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add JWT_EXPIRE
```

### Deploy

1. For first-time deployment:
   ```bash
   vercel
   ```

2. For subsequent deployments:
   ```bash
   vercel --prod
   ```

### Environment Variables Required

- `NODE_ENV`: Set to `production`
- `MONGODB_URI`: Your MongoDB connection string (use MongoDB Atlas for production)
- `JWT_SECRET`: A secure secret key for JWT tokens (minimum 32 characters)
- `JWT_EXPIRE`: JWT token expiration time (e.g., "7d")

### MongoDB Atlas Setup

For production deployment, you'll need a MongoDB Atlas cluster:

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Update `MONGODB_URI` in Vercel environment variables

Example connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/taxfarm?retryWrites=true&w=majority
```

## Project Structure

```
src/
  ├── config/
  │   └── database.ts     # MongoDB connection
  ├── controllers/
  │   └── userController.ts
  ├── models/
  │   └── User.ts
  ├── routes/
  │   └── userRoutes.ts
  └── server.ts           # Main application file
```

## Technologies Used

- Express.js
- TypeScript
- MongoDB & Mongoose
- CORS
- Helmet (Security)
- Morgan (Logging)
- dotenv (Environment variables)

## License

ISC