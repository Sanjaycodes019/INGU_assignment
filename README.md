# Contact Management App

A simple, functional MERN stack contact management web application with CRUD operations.

## Features

- ✅ Add new contacts with name, email, and phone
- ✅ View all contacts in a responsive grid layout
- ✅ Edit existing contacts
- ✅ Delete contacts with confirmation
- ✅ Search contacts by name
- ✅ Form validation
- ✅ Responsive design for mobile and desktop
- ✅ Loading states and error handling
- ✅ Clean, simple UI suitable for placement assignments

## Technology Stack

- **Frontend**: React 18 with functional components and hooks
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas (cloud-based)
- **Validation**: Express-validator for backend, custom validation for frontend
- **HTTP Client**: Axios
- **Styling**: CSS3 with responsive design

## Project Structure

```
contact-management/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styles
│   │   └── index.js       # React entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── server.js          # Express server with API routes
│   ├── .env.example       # Environment variables template
│   └── package.json
├── .gitignore
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | Get all contacts (with optional search) |
| GET | `/api/contacts/:id` | Get single contact by ID |
| POST | `/api/contacts` | Create new contact |
| PUT | `/api/contacts/:id` | Update existing contact |
| DELETE | `/api/contacts/:id` | Delete contact |

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd contact-management
```

### 2. Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file with your MongoDB Atlas connection string:
```
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/contact_management?retryWrites=true&w=majority
```

5. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to client directory (from project root):
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Running the Application

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

The app should open automatically in your browser. If not, navigate to `http://localhost:3000`.

## MongoDB Atlas Setup

1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier M0)
3. Create a database user with username and password
4. Add your IP address to the whitelist (use `0.0.0.0/0` for access from anywhere)
5. Get your connection string from the "Connect" section
6. Replace `your_username` and `your_password` in the connection string with your actual credentials

## Deployment

### Backend Deployment (Render)

1. Push your code to GitHub
2. Create a new account on [Render](https://render.com)
3. Connect your GitHub repository
4. Create a new "Web Service"
5. Set build command: `cd server && npm install`
6. Set start command: `cd server && npm start`
7. Add environment variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
8. Deploy!

### Frontend Deployment (Netlify/Vercel)

#### Netlify:
1. Build the React app: `cd client && npm run build`
2. Push to GitHub
3. Connect your repository to Netlify
4. Set build command: `cd client && npm run build`
5. Set publish directory: `client/build`
6. Add environment variable for API URL if needed

#### Vercel:
1. Push to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect it's a React app
4. Set environment variables if needed
5. Deploy!

### Important Notes for Deployment

- Make sure your MongoDB Atlas allows access from your deployment platform
- Update the API URL in the frontend if deploying to different domains
- Set proper CORS origins in production
- Consider using environment variables for all configuration

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/contact_management?retryWrites=true&w=majority
```

### Frontend (if needed)
The frontend uses a proxy in development. For production, you might need to set:
```
REACT_APP_API_URL=https://your-backend-url.com
```

## Validation Rules

- **Name**: Minimum 2 characters, required
- **Email**: Valid email format, required, unique
- **Phone**: 10-15 digits, required

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Check your connection string
   - Ensure IP whitelist includes your deployment IP
   - Verify database user credentials

2. **CORS Error**:
   - Backend should be running when accessing frontend
   - Check that CORS is properly configured in server.js

3. **Build Errors**:
   - Ensure all dependencies are installed
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`

4. **Port Already in Use**:
   - Change the PORT in .env file
   - Kill existing processes using the port

### Development Tips

- Use `npm run dev` in server directory for auto-restart during development
- The frontend proxy handles API calls in development
- Check browser console for JavaScript errors
- Use MongoDB Atlas Compass to view your data

## Future Enhancements

- User authentication
- Contact groups/categories
- Import/export contacts
- Advanced search filters
- Contact avatars
- Bulk operations
- Pagination for large contact lists

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
