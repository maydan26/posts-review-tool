# Flagged Posts Review Tool

A full-stack web application for reviewing and managing flagged social media posts. Built with Node.js/TypeScript backend and React/TypeScript frontend.

## 🚀 Features

### Backend API
- **RESTful API** with Express.js and TypeScript
- **Comprehensive filtering** by status, platform, tag, and text search
- **Smart pagination** with limit + offset support
- **CRUD operations** for post status and tags
- **File-based data storage** using `mock-posts.json`
- **Comprehensive test suite** with 48 passing tests
- **Error handling** and validation
- **Health check endpoint**

### Frontend Interface
- **Modern React UI** with Material-UI (MUI) components
- **Responsive design** with Tailwind CSS
- **Real-time filtering** and search
- **Inline editing** for post status and tags
- **Professional pagination** controls
- **Loading states** and error handling
- **TypeScript** for type safety

## 🛠 Tech Stack

### Backend
- **Node.js** with TypeScript
- **Express.js** web framework
- **CORS** for cross-origin requests
- **Jest** for testing
- **Supertest** for API testing

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Material-UI (MUI)** for components
- **Tailwind CSS** for styling
- **Custom hooks** for state management

## 📁 Project Structure

```
posts/
├── backend/                 # Node.js/TypeScript API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── types.ts        # TypeScript interfaces
│   │   ├── dataService.ts  # Data access layer
│   │   └── index.ts        # Server entry point
│   ├── tests/              # Test files
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React/TypeScript UI
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app component
│   ├── package.json
│   └── tailwind.config.js
├── mock-posts.json         # Sample data
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3001`

4. **Run tests:**
   ```bash
   npm test
   npm run test:coverage
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### GET /posts
List posts with optional filtering and pagination.

**Query Parameters:**
- `status` - Filter by post status (`FLAGGED`, `UNDER_REVIEW`, `DISMISSED`)
- `platform` - Filter by platform (e.g., `twitter`, `facebook`)
- `tag` - Filter by tag
- `search` - Search in post text content
- `limit` - Number of posts per page (default: 20)
- `offset` - Number of posts to skip (default: 0)

**Example:**
```bash
curl "http://localhost:3001/api/posts?status=FLAGGED&limit=10&offset=0"
```

#### PATCH /posts/:id/status
Update the status of a post.

**Request Body:**
```json
{
  "status": "UNDER_REVIEW"
}
```

**Example:**
```bash
curl -X PATCH "http://localhost:3001/api/posts/1/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "UNDER_REVIEW"}'
```

#### POST /posts/:id/tags
Add a tag to a post.

**Request Body:**
```json
{
  "tag": "spam"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3001/api/posts/1/tags" \
  -H "Content-Type: application/json" \
  -d '{"tag": "spam"}'
```

#### DELETE /posts/:id/tags/:tag
Remove a tag from a post.

**Example:**
```bash
curl -X DELETE "http://localhost:3001/api/posts/1/tags/spam"
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Flagged Posts API is running",
  "timestamp": "2025-01-13T14:30:00.000Z",
  "database": {
    "totalPosts": 20
  }
}
```

## 🧪 Testing

### Backend Tests
The backend includes comprehensive tests covering:
- All API endpoints
- Filtering and pagination
- Error handling
- Data consistency
- Edge cases

**Run tests:**
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage report
```

**Test Coverage:**
- 77.38% statements
- 82.69% branches  
- 88% functions
- 48 passing tests

## 🎨 Frontend Features

### Components
- **PostTable** - Displays posts with inline editing
- **FilterBar** - Advanced filtering controls
- **Pagination** - Professional pagination component

### Key Features
- **Real-time search** and filtering
- **Inline status editing** with dropdown
- **Tag management** (add/remove)
- **Responsive design** for all screen sizes
- **Loading states** and error handling
- **Professional UI** with Material-UI components

## 🔧 Configuration

### Environment Variables

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3001/api
```

**Backend:**
No environment variables required for basic setup.

## 📊 Data Model

### Post Interface
```typescript
interface Post {
  id: number;
  platform: string;
  text: string;
  status: 'FLAGGED' | 'UNDER_REVIEW' | 'DISMISSED';
  tags: string[];
  created_at: string;
}
```

## 🚀 Deployment

### Backend
1. Build the project:
   ```bash
   cd backend
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

### Frontend
1. Build the project:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve the `dist` folder with any static file server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.

## 🎯 Assumptions Made

1. **No Authentication** - As specified in requirements
2. **No Persistence** - Changes can be lost on restart
3. **File-based Storage** - Using `mock-posts.json` as database
4. **Single User** - No concurrent user considerations
5. **Development Environment** - Optimized for development/testing

## 🔍 Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- User authentication and authorization
- Real-time updates with WebSockets
- Advanced analytics and reporting
- Bulk operations for posts
- Export functionality
- Dark mode support
- Mobile app version
