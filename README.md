# Amimi Frontend

Vue.js frontend application for Amimi - an AI-powered relationship companion.

## 🌟 Features

- **User Authentication**: Simple sign-up and user management
- **Partner Pairing**: Code-based pairing system to connect with your partner
- **AI Chat**: Real-time chat with Gemini AI for relationship support
- **Responsive Design**: Modern, mobile-friendly interface
- **State Management**: Persistent user state with localStorage
- **Debug Tools**: Built-in API testing utilities

## 🚀 Live Demo

Visit the live application: [Amimi Frontend](https://jaredhlzhang.github.io/Amimi-frontend_61040/)

## 🛠️ Tech Stack

- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Fetch API
- **Styling**: CSS3 with modern features
- **TypeScript**: Full TypeScript support

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Amimi Backend running (see [Backend Repository](https://github.com/JaredHLZhang/Amimi_backend_61040))

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/JaredHLZhang/Amimi-frontend_61040.git
   cd Amimi-frontend_61040
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🏗️ Project Structure

```
src/
├── api/                    # API client and service functions
│   ├── client.ts          # HTTP client configuration
│   ├── pairing.ts         # Pairing API calls
│   ├── conversationalAgent.ts # Chat API calls
│   └── debug.ts           # Debug utilities
├── components/            # Reusable Vue components
├── views/                 # Page components
│   ├── HomeView.vue       # Landing page
│   ├── PairingView.vue    # Partner pairing interface
│   └── PrivateChatView.vue # Chat interface
├── stores/                # Pinia stores
│   └── user.ts           # User state management
├── router/                # Vue Router configuration
├── assets/                # Static assets
└── App.vue               # Root component
```

## 🎯 Core Features

### User Authentication
- Simple sign-up process
- Persistent user sessions
- User state management

### Partner Pairing
- Generate unique pairing codes
- Accept partner's pairing code
- Real-time pairing status updates
- Pair management and dissolution

### AI Chat Interface
- Real-time messaging with Gemini AI
- Conversation history
- Typing indicators
- Message timestamps
- Responsive chat interface

### Debug Tools
- API testing utilities
- Console logging for debugging
- Direct API endpoint testing

## 🔧 Configuration

### API Configuration
The frontend connects to the backend API. Update the API base URL in `src/api/client.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Environment Variables
Create a `.env` file for environment-specific configuration:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🧪 Testing

### Manual Testing
1. **Sign Up**: Create a new user account
2. **Pairing**: Generate and share pairing codes
3. **Chat**: Send messages to Amimi AI
4. **Debug**: Use debug tools to test API endpoints

### Debug Mode
Access debug tools by clicking "Debug APIs" on the home page when not signed in.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run build
# Deploy the dist/ folder to GitHub Pages
```

### Deploy to Vercel/Netlify
```bash
npm run build
# Deploy the dist/ folder to your preferred platform
```

## 🔗 API Integration

The frontend integrates with the Amimi Backend API:

- **Base URL**: `http://localhost:8000/api`
- **Authentication**: User ID-based
- **CORS**: Configured for localhost development
- **Error Handling**: Comprehensive error handling and user feedback

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface
- **Smooth Animations**: CSS transitions and hover effects
- **Loading States**: Visual feedback during API calls
- **Error Messages**: User-friendly error handling
- **Success Feedback**: Confirmation messages for actions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related Projects

- [Amimi Backend](https://github.com/JaredHLZhang/Amimi_backend_61040) - Deno backend with concept architecture

## 📞 Support

For support or questions, please open an issue in the repository.

---

Built with ❤️ for long-distance relationships