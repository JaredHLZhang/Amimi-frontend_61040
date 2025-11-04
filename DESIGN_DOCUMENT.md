# Amimi Design Document

## Overview

Amimi is an AI-powered relationship companion designed for long-distance couples, built using a concept-based architecture with declarative synchronizations. This document summarizes how the final design differs from the initial concept design in Assignment 2 and the visual design in Assignment 4b.

---

## Concept Design Evolution

### Initial Design

The original concept design focused on six core concepts:
1. **Pairing** - Code-based user pairing
2. **ConversationalAgent** - Private AI chat
3. **ContentCapture** - Multi-modal content capture
4. **CommunicationInteraction** - Interaction tracking
5. **VisualGeneration** - AI-generated visual content (design only, not implemented)

### Key Changes in Final Implementation

#### 1. **Addition of GroupConversation Concept**

**Implementation**: Created a new `GroupConversation` concept that:
- Supports multiple participants (typically couples + Amimi)
- Maintains shared conversation history
- Integrates Gemini AI with couple-focused prompts
- Auto-creates when users successfully pair

**Link**: See [GroupConversation specification](https://github.com/JaredHLZhang/Amimi_backend_61040/blob/main/design/concepts/GroupConversation/GroupConversation.md)

#### 2. **Synchronization Engine Migration (Assignment 4C)**

**Original**: Direct action calls between concepts in `Pairing.acceptPairing()`

**Final**: Declarative synchronizations using the sync engine:
- **auth.sync.ts**: Session validation for all protected endpoints
- **amimi.sync.ts**: Auto-trigger AI responses on `@Amimi` mentions
- **pairing.sync.ts**: Auto-create shared conversations on pairing

**Benefits**: 
- Better separation of concerns
- More maintainable orchestration
- Easier to reason about cross-concept interactions

**Link**: See [Assignment 4C changes](https://github.com/JaredHLZhang/Amimi_backend_61040/blob/main/design/assignment4c-changes.md)

#### 3. **Authentication System**

**Original**: Simple user ID generation, no authentication

**Final**: Full email/password authentication using `Sessioning` concept:
- User registration with name, email, password
- Session-based authentication
- Protected endpoints require valid sessions
- User name display instead of user IDs

**Implementation**: All protected endpoints route through authentication syncs that validate sessions before allowing access.

#### 4. **@Amimi Mention Feature**

**Original**: Not specified in initial design

**Final**: Backend synchronization automatically triggers Amimi responses in shared chat when users mention `@Amimi`. This allows couples to explicitly request AI input without it responding to every message.

**Implementation**: `amimi.sync.ts` listens for `GroupConversation.sendMessage` actions containing `@Amimi` and triggers `GroupConversation.getAgentResponse`.

---

## From Assignment 4b: Visual Design Implementation

### Visual Design Goals (Assignment 4b)

The visual design study established:
- **Color Palette**: Sunset-inspired romantic theme (purples, corals, oranges, creams)
- **Typography**: Mix of readable fonts for body text and cute "Single Day" font for Amimi
- **Character IP**: Amimi cloud character with multiple states (idle, writing)
- **Layout**: Gradient backgrounds, rounded corners, soft shadows, decorative elements

### Implementation in Final Design

#### 1. **Color System**

**Implemented**:
- CSS custom properties for the sunset palette
- Gradient backgrounds transitioning from light purple to pink
- Coral-pink accent colors for primary buttons
- Dark purple for text content

**Location**: Frontend `App-working.vue` style section

#### 2. **Typography**

**Implemented**:
- Body text: System fonts (San Francisco on Mac, Arial fallback)
- Amimi messages: "Single Day" font (handwritten style) where available
- Font sizes: Hierarchical system (24px titles, 16px body, 14px secondary)

**Enhancement**: Added responsive font sizing for mobile devices

#### 3. **Character Integration**

**Implemented**:
- Amimi cloud character appears in hero section
- Writing animation state when AI is generating responses
- Smooth transitions and animations

#### 4. **User Experience Refinements**

**Changes from 4b**:
- **Name Display**: Shows user's registered name instead of user ID on home page
- **Loading States**: Improved loading animation management for shared chat
- **Message Positioning**: Fixed message alignment so users' messages appear on correct side in shared chat
- **Real-time Updates**: Polling mechanism for shared chat message synchronization

---

## Architecture Changes Summary

### Backend Architecture

**Final**: Sync engine with `Requesting` concept:
- All endpoints route through `Requesting.request`
- Authentication handled declaratively via syncs
- Response routing handled via separate success/error syncs
- Passthrough configuration for public endpoints


### Frontend Architecture

**Final**: Simplified to single-file component (`App-working.vue`):
- All views in one component (Home, Pairing, Chat)
- Manual view switching instead of router
- Reactive refs with localStorage for state persistence

---

## Backend vs Frontend Responsibilities

Clear separation: **Security & Reliability → Backend**, **User Experience & Presentation → Frontend**.

### Backend (Synchronizations)

- **Authentication** (`auth.sync.ts`): Session validation for all protected endpoints - must be server-side for security
- **@Amimi Detection** (`amimi.sync.ts`): Auto-triggers AI responses when `@Amimi` is mentioned - ensures reliability and consistency across all clients
- **Shared Conversation Creation**: Auto-creates group conversations on pairing - atomic operation for data integrity
- **Response Routing**: Matches action outputs to HTTP responses - declarative success/error handling

### Frontend

- **Message Polling**: Polls shared chat history every 2 seconds - provides real-time UX without WebSockets
- **Loading States**: Shows/hides Amimi animation - immediate visual feedback
- **UI Display**: Message positioning, formatting, view switching - all presentation logic
- **Conversation Loading**: Loads from localStorage, validates IDs - fast initial load with fallback

### Summary

| Feature | Backend (Sync) | Frontend | Rationale |
|---------|----------------|----------|-----------|
| **Authentication** | ✅ | ❌ | Security - must be server-side |
| **@Amimi Detection** | ✅ | ❌ | Reliability - must always trigger |
| **AI Response Trigger** | ✅ | ❌ | Business logic - backend orchestration |
| **Shared Conv Creation** | ✅ | ❌ | Data integrity - atomic operation |
| **Message Polling** | ❌ | ✅ | UX - client-specific, real-time feel |
| **Loading States** | ❌ | ✅ | Presentation - immediate feedback |
| **Message Display** | ❌ | ✅ | Presentation - UI rendering |
| **Conversation Loading** | ❌ | ✅ | UX - fast cached load with validation |

---

## Key Design Decisions

### 1. **Concept Independence Maintained**

Despite adding GroupConversation and Sessioning, all concepts remain independent:
- No direct dependencies between concepts
- All interactions via synchronizations
- Generic types used throughout

### 2. **Prompt Engineering Evolution**

**Initial**: Generic relationship advice prompts

**Final**: 
- Dual prompt system (private vs. shared)
- Empathetic, friend-like tone (not therapist/coach)
- Short responses (2-3 sentences)
- Emotional vocabulary and reflection-based guidance

### 3. **Authentication Strategy**

Chose session-based over token-based for simplicity:
- Sessions stored in MongoDB with expiration
- Automatic cleanup of expired sessions
- Session validation for all protected actions

---

## Visual Design Implementation

### What Was Implemented

- Sunset color palette with gradients  
- Amimi cloud character with animations  
- Rounded corners and soft shadows  
- Decorative cloud/heart/sparkle emojis  
- Responsive layout for all screen sizes  
- Typography hierarchy  

### What Was Enhanced

- **Loading States**: More precise control of when animations appear
- **User Names**: Display registered names instead of IDs
- **Message Styling**: Proper alignment and positioning in shared chat
- **Error Handling**: User-friendly error messages with consistent styling

---

## Conclusion

The final Amimi design successfully implements the core concept design while adding essential features (GroupConversation, authentication) and refining the visual design into a cohesive, romantic, user-friendly interface. The migration to the synchronization engine in Assignment 4C provides a solid foundation for future feature additions while maintaining concept independence and separation of concerns.

**Key Links**:
- [Backend Concept Specifications](https://github.com/JaredHLZhang/Amimi_backend_61040/tree/main/design/concepts)
- [Assignment 4C Changes](https://github.com/JaredHLZhang/Amimi_backend_61040/blob/main/design/assignment4c-changes.md)
- [Backend API Specification](https://github.com/JaredHLZhang/Amimi_backend_61040/blob/main/design/api-spec.md)
- [Backend Synchronizations](https://github.com/JaredHLZhang/Amimi_backend_61040/blob/main/design/synchronizations.md)

