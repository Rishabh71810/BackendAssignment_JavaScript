# Subscription Microservice

A robust microservice for managing user subscriptions in a SaaS platform, built with Node.js, Express, PostgreSQL, and JWT authentication.

## Features

- **User Management**: Registration, authentication, and profile management
- **Plan Management**: Create and manage subscription plans with flexible pricing
- **Subscription Management**: Full lifecycle management of user subscriptions
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation using Joi
- **Error Handling**: Structured error responses and logging
- **Database**: PostgreSQL with Sequelize ORM
- **Scheduled Tasks**: Automatic subscription expiration handling
- **Rate Limiting**: Protection against abuse
- **Security**: Helmet, CORS, and other security middleware

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS, bcryptjs
- **Scheduling**: node-cron

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd subscription-microservice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=subscription_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_DIALECT=postgres
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # Logging
   LOG_LEVEL=info
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb subscription_db
   
   # Run migrations (if using migrations)
   npm run migrate
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### User Management

**Register User**
```http
POST /users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login User**
```http
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Get User Profile** (Requires Auth)
```http
GET /users/profile
Authorization: Bearer <token>
```

**Update Profile** (Requires Auth)
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

#### Plan Management

**Get All Plans**
```http
GET /plans?page=1&limit=10&isActive=true&minPrice=0&maxPrice=100
```

**Get Active Plans**
```http
GET /plans/active
```

**Get Plan by ID**
```http
GET /plans/{planId}
```

**Create Plan** (Requires Auth)
```http
POST /plans
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Premium Plan",
  "description": "Full access to all features",
  "price": 29.99,
  "currency": "USD",
  "duration": 30,
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "maxUsers": 10,
  "maxStorage": 1073741824,
  "apiCallsLimit": 10000
}
```

**Update Plan** (Requires Auth)
```http
PUT /plans/{planId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 39.99,
  "features": ["Feature 1", "Feature 2", "Feature 3", "New Feature"]
}
```

#### Subscription Management

**Create Subscription** (Requires Auth)
```http
POST /subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-uuid",
  "planId": "plan-uuid",
  "autoRenew": true,
  "paymentMethod": "credit_card"
}
```

**Get Current User's Subscription** (Requires Auth)
```http
GET /subscriptions/me
Authorization: Bearer <token>
```

**Get User Subscription** (Requires Auth)
```http
GET /subscriptions/{userId}
Authorization: Bearer <token>
```

**Update Subscription** (Requires Auth)
```http
PUT /subscriptions/{userId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "new-plan-uuid",
  "autoRenew": false
}
```

**Cancel Subscription** (Requires Auth)
```http
DELETE /subscriptions/{userId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "No longer needed"
}
```

### Response Format

All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Error description",
  "details": [ ... ] // For validation errors
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `firstName` (String)
- `lastName` (String)
- `isActive` (Boolean)
- `lastLoginAt` (Date)
- `createdAt` (Date)
- `updatedAt` (Date)

### Plans Table
- `id` (UUID, Primary Key)
- `name` (String, Unique)
- `description` (Text)
- `price` (Decimal)
- `currency` (String)
- `duration` (Integer, days)
- `features` (JSONB)
- `isActive` (Boolean)
- `maxUsers` (Integer)
- `maxStorage` (BigInt)
- `apiCallsLimit` (Integer)
- `createdAt` (Date)
- `updatedAt` (Date)

### Subscriptions Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `planId` (UUID, Foreign Key)
- `status` (Enum: ACTIVE, INACTIVE, CANCELLED, EXPIRED)
- `startDate` (Date)
- `endDate` (Date)
- `autoRenew` (Boolean)
- `paymentMethod` (String)
- `lastPaymentDate` (Date)
- `nextBillingDate` (Date)
- `cancelledAt` (Date)
- `cancellationReason` (Text)
- `metadata` (JSONB)
- `createdAt` (Date)
- `updatedAt` (Date)

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration
- `npm run seed` - Run database seeders

### Project Structure

```
src/
├── config/
│   └── database.js          # Database configuration
├── controllers/             # Request handlers
│   ├── userController.js
│   ├── planController.js
│   └── subscriptionController.js
├── middleware/              # Custom middleware
│   ├── auth.js             # Authentication middleware
│   └── validation.js       # Validation middleware
├── models/                  # Sequelize models
│   ├── index.js
│   ├── user.js
│   ├── plan.js
│   └── subscription.js
├── routes/                  # Route definitions
│   ├── index.js
│   ├── userRoutes.js
│   ├── planRoutes.js
│   └── subscriptionRoutes.js
├── services/                # Business logic
│   ├── userService.js
│   ├── planService.js
│   └── subscriptionService.js
├── utils/                   # Utilities
│   └── logger.js           # Winston logger
├── validators/              # Joi validation schemas
│   └── index.js
└── server.js               # Application entry point
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents abuse and DoS attacks
- **Input Validation**: Comprehensive validation using Joi
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Environment Variables**: Sensitive data protection

## Monitoring and Logging

- **Winston Logger**: Structured logging with different levels
- **Error Tracking**: Comprehensive error handling and logging
- **Health Check**: `/health` endpoint for monitoring

## Deployment

### Environment Variables for Production

Ensure these environment variables are set in production:

- `NODE_ENV=production`
- `JWT_SECRET` - Strong secret key
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Production database
- `PORT` - Server port

### Docker Support

Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License #   B a c k e n d A s s i g n m e n t _ J a v a S c r i p t  
 