# Amimi Frontend

Vue.js frontend application for Amimi - an AI-powered relationship companion.


### Documentation for Assignment 4C

1. **Design Document** - [DESIGN_DOCUMENT.md](DESIGN_DOCUMENT.md)
   - Summarizes how final design differs from Assignment 2 and Assignment 4b
   - Documents concept design evolution, visual design implementation, and architecture changes
   - Links to backend concept specifications and synchronization patterns

2. **Project Reflection** - [REFLECTION.md](REFLECTION.md)
   - Reflection on project experience, challenges, and learnings
   - Documents skills acquired and areas for improvement
   - Discusses use of Context tool and agentic coding tools
   - Conclusions about LLMs in software development

3. **Final Video Demonstration** - [Assginment 4C Video.mov](Assginment%204C%20Video.mov)
   - Short video (up to 3 minutes) showing the app in use
   - Highlights key features with audio narration
   - Demonstrates complete user journey: registration, pairing, private chat, and shared chat with @Amimi mention
   - Shows the deployed application on Render

4. **Backend Console Trace** - [backend-trace.txt](backend-trace.txt)
   - Complete trace of incoming actions to the backend during video demonstration
   - Captured from Render dashboard console logs
   - Shows all API requests, synchronizations, and responses
   - Demonstrates authentication, pairing, conversation creation, message sending, and @Amimi mention triggering


### Previous Required Documents

1. **User Journey** - [user-journey.md](user-journey.md)
   - One-paragraph narrative of Alice and Bob's journey with Amimi
   - Demonstrates pairing, private chat, and shared chat features
   - Covers the complete user experience from sign-up to relationship growth

2. **Screen Recording** - [Screen Recording - Final Check.mov](Screen%20Recording%20-%20Final%20Check.mov)
   - Final 2-minute demonstration of the user journey
   - Narrated walkthrough of key features
   - Shows: sign up, pairing, private chat with AI, shared chat with @Amimi
   - Demonstrates the beautiful sunset-themed UI with Amimi cloud character
   - Highlights real-time message synchronization and natural AI responses

3. **Visual Design Study - Color** - [color-design-research.png](color-design-research.png)
   - Collage of 5 inspiring images with sunset themes
   - Extracted color palettes from each image
   - Annotations highlighting design choices
   - Focus on romantic, warm sunset colors (purples, oranges, blues, yellows, reds)

4. **Visual Design Study - Typography** - [font-design-research.png](font-design-research.png)
   - Two sections: Display fonts and Amimi fonts
   - Diverse examples from visual media
   - Annotations explaining font characteristics
   - Emphasis on readability vs. distinct, cute, handwritten styles

### Source Code & Implementation

- **Main Application**: [src/App-working.vue](src/App-working.vue) - Complete application in single component
- **API Client**: [src/api/](src/api/)
  - [client.ts](src/api/client.ts) - HTTP client configuration
  - [pairing.ts](src/api/pairing.ts) - Pairing API calls
  - [conversationalAgent.ts](src/api/conversationalAgent.ts) - Private chat API
  - [groupConversation.ts](src/api/groupConversation.ts) - Shared chat API
- **Assets**:
  - [Amimi Cloud Character (basic)](src/assets/Amimi-cloud.png)
  - [Amimi Cloud Character (writing)](src/assets/Amimi-cloud-write.png)
- **API Specification**: [src/api-spec.md](src/api-spec.md) - Copied from backend

## 🌟 Features

- **Email/Password Authentication**: Secure login and registration
- **Partner Pairing**: Code-based pairing system to connect with your partner
- **AI Chat**: Real-time chat with Gemini AI for relationship support
- **Responsive Design**: Modern, mobile-friendly interface
- **State Management**: Persistent sessions with localStorage
- **Shared Chat**: Multi-user conversations with automatic AI responses


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
   yarn install
   ```

3. **Start the development server**
   ```bash
   yarn dev
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
- Email/password registration
- Secure login with session tokens
- Session management and logout
- Automatic session validation

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
1. **Register**: Create a new user account with email/password
2. **Login**: Sign in with credentials
3. **Pairing**: Generate and share pairing codes
4. **Chat**: Send messages to Amimi AI
5. **Shared Chat**: Test @Amimi mention feature

## 🚀 Deployment

### Build for Production
```bash
yarn; yarn build
```

### Deploy to Render
Amimi frontend can be deployed to Render, Vercel, Netlify, or any static hosting platform:

```bash
yarn; yarn build
# Deploy the dist/ folder to your preferred platform
```

**Note**: Update API base URL for production deployment.

## 🔗 API Integration

The frontend integrates with the Amimi Backend API:

- **Base URL**: `http://localhost:8000/api` (configurable)
- **Authentication**: Session token-based (email/password)
- **CORS**: Configured for localhost development
- **Error Handling**: Comprehensive error handling and user feedback
- **Session Management**: Automatic token injection in API calls

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

### Design Implementation

The UI implements the visual design study:
- **Colors**: Sunset-inspired palette (creams, corals, purples, blues, oranges)
- **Typography**: Single Day font for Amimi messages (handwritten/cute style)
- **Layout**: Gradient backgrounds, rounded corners, soft shadows, decorative elements
- **Character IP**: Amimi cloud character integrated throughout UI

### Feature Highlights

- ✅ Beautiful sunset-themed romantic UI
- ✅ Amimi cloud character animations
- ✅ Email/password authentication
- ✅ Real-time message synchronization for shared chat
- ✅ @Amimi mention feature (auto-triggers AI in backend)
- ✅ Private and shared chat modes
- ✅ Natural, empathetic AI responses
- ✅ Responsive design for all screen sizes

## 📞 Support

For support or questions, please open an issue in the repository.

---

Built with ❤️ for long-distance relationships