# CampusFindIt - Complete Project Flowchart

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend - React Application"
        LP[Landing Page]
        AUTH[Authentication Page]
        OTP[OTP Verification]
        FP[Forgot Password]
        HOME[Home Page]
        REPORT[Report Item Page]
        PROFILE[Profile Page]
        BROWSE[Browse Items]
        LOST[Lost Items Page]
        FOUND[Found Items Page]
    end

    subgraph "Backend - Express API"
        API[Express Server]
        
        subgraph "Routes"
            UR[User Routes]
            OR[OTP Routes]
            IR[Item Routes]
            CR[Claims Routes]
            NR[Notification Routes]
        end
        
        subgraph "Controllers"
            UC[User Controller]
            OC[OTP Controller]
            IC[Item Controller]
            CC[Claims Controller]
            NC[Notification Controller]
        end
        
        subgraph "Services"
            ES[Email Service]
            OS[OTP Service]
            NS[Notification Service]
            CS[Claim Email Service]
            UA[User Auth Service]
        end
    end

    subgraph "Data Layer"
        MONGO[(MongoDB)]
        REDIS[(Redis Cache)]
        CLOUD[Cloudinary Storage]
    end

    LP -->|Sign Up / Login| AUTH
    AUTH -->|Verify Email| OTP
    AUTH -->|Forgot Password| FP
    OTP -->|Success| HOME
    FP -->|Reset Link| AUTH
    
    HOME -->|Navigate| REPORT
    HOME -->|Navigate| PROFILE
    HOME -->|Navigate| BROWSE
    HOME -->|Navigate| LOST
    HOME -->|Navigate| FOUND
    
    HOME -->|API Calls| API
    REPORT -->|API Calls| API
    PROFILE -->|API Calls| API
    BROWSE -->|API Calls| API
    LOST -->|API Calls| API
    FOUND -->|API Calls| API
    
    API --> UR
    API --> OR
    API --> IR
    API --> CR
    API --> NR
    
    UR --> UC
    OR --> OC
    IR --> IC
    CR --> CC
    NR --> NC
    
    UC --> UA
    UC --> ES
    OC --> OS
    OC --> ES
    IC --> NS
    CC --> CS
    CC --> NS
    
    UC --> MONGO
    OC --> REDIS
    IC --> MONGO
    IC --> CLOUD
    CC --> MONGO
    NC --> MONGO
```

## User Journey Flow

```mermaid
flowchart TD
    START([User Visits Site]) --> LP[Landing Page]
    
    LP -->|Click Get Started| AUTH{Authentication}
    
    AUTH -->|New User| SIGNUP[Sign Up Form]
    AUTH -->|Existing User| LOGIN[Login Form]
    AUTH -->|Forgot Password| FP[Forgot Password]
    
    SIGNUP -->|Submit| OTPVERIFY[OTP Verification]
    OTPVERIFY -->|Valid OTP| HOME[Home Page]
    OTPVERIFY -->|Invalid OTP| OTPVERIFY
    
    LOGIN -->|Valid Credentials| CHECKVERIFY{Email Verified?}
    CHECKVERIFY -->|Yes| HOME
    CHECKVERIFY -->|No| OTPVERIFY
    
    FP -->|Submit Email| RESETLINK[Reset Link Sent]
    RESETLINK -->|Click Link| NEWPASS[Set New Password]
    NEWPASS --> LOGIN
    
    HOME --> ACTIONS{User Actions}
    
    ACTIONS -->|Browse| VIEWITEMS[View Items]
    ACTIONS -->|Search| SEARCH[Search Items]
    ACTIONS -->|Report Lost| REPORTLOST[Report Lost Item]
    ACTIONS -->|Report Found| REPORTFOUND[Report Found Item]
    ACTIONS -->|View Profile| PROFILE[Profile Page]
    ACTIONS -->|Notifications| NOTIF[View Notifications]
    
    VIEWITEMS -->|Click Item| MODAL[Item Detail Modal]
    MODAL -->|Found Item| CLAIM[Claim Item]
    MODAL -->|Lost Item| FOUNDREPORT[Report Found]
    
    CLAIM -->|Submit| DECLARATION1[Read Declaration]
    DECLARATION1 -->|Agree| DESCRIBE[Describe Item]
    DESCRIBE -->|Submit| CLAIMREQ[Claim Request Sent]
    
    FOUNDREPORT -->|Submit| DECLARATION2[Read Declaration]
    DECLARATION2 -->|Agree| DETAILS[Provide Details]
    DETAILS -->|Submit| FOUNDREQ[Found Report Sent]
    
    PROFILE --> TABS{Profile Tabs}
    TABS -->|My Items| MYITEMS[View Posted Items]
    TABS -->|Claims| CLAIMS[View Claims]
    TABS -->|Notifications| NOTIFLIST[Notification List]
    
    MYITEMS -->|Review Claim| REVIEWCLAIM{Accept/Reject}
    REVIEWCLAIM -->|Accept| ACCEPTCLAIM[Mark as Reunited]
    REVIEWCLAIM -->|Reject| REJECTCLAIM[Reject Claim]
    
    CLAIMS -->|View Status| CLAIMSTATUS[Claim Status]
    
    NOTIFLIST -->|Click| NOTIFDETAIL[Notification Detail]
    
    PROFILE -->|Logout| LOGOUT[Logout]
    LOGOUT --> LP
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant MongoDB
    participant Redis
    participant Email

    User->>Frontend: Enter Signup Details
    Frontend->>Backend: POST /api/users/signup
    Backend->>MongoDB: Check if user exists
    
    alt User Exists
        MongoDB-->>Backend: User found
        Backend-->>Frontend: Error: User exists
        Frontend-->>User: Show error message
    else New User
        MongoDB-->>Backend: User not found
        Backend->>MongoDB: Create new user
        Backend->>Redis: Generate & store OTP
        Backend->>Email: Send OTP email
        Backend-->>Frontend: Success + userId
        Frontend->>Frontend: Navigate to OTP page
        Frontend-->>User: Show OTP input
        
        User->>Frontend: Enter OTP
        Frontend->>Backend: POST /api/otp/verify
        Backend->>Redis: Verify OTP
        
        alt Valid OTP
            Redis-->>Backend: OTP valid
            Backend->>MongoDB: Mark user as verified
            Backend-->>Frontend: Success + token
            Frontend->>Frontend: Store token in localStorage
            Frontend-->>User: Navigate to Home
        else Invalid OTP
            Redis-->>Backend: OTP invalid
            Backend-->>Frontend: Error: Invalid OTP
            Frontend-->>User: Show error
        end
    end
```

## Item Reporting Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant MongoDB
    participant Cloudinary
    participant NotifService

    User->>Frontend: Fill Report Item Form
    User->>Frontend: Upload Images
    Frontend->>Backend: POST /api/items/add (with images)
    Backend->>Cloudinary: Upload images
    Cloudinary-->>Backend: Image URLs
    Backend->>MongoDB: Save item with image URLs
    MongoDB-->>Backend: Item saved
    Backend-->>Frontend: Success
    Frontend-->>User: Show success message
    Frontend->>Frontend: Navigate to Home
```

## Claim/Found Reporting Flow

```mermaid
sequenceDiagram
    participant Claimer
    participant Frontend
    participant Backend
    participant MongoDB
    participant NotifService
    participant Email
    participant Owner

    Claimer->>Frontend: Click "Claim Item" or "Found Item"
    Frontend->>Claimer: Show Declaration
    Claimer->>Frontend: Agree to Declaration
    Frontend->>Claimer: Show Description Form
    Claimer->>Frontend: Submit Description
    Frontend->>Backend: POST /api/claims/addclaim/:itemId
    Backend->>MongoDB: Create claim record
    Backend->>NotifService: Create notification
    NotifService->>MongoDB: Save notification
    NotifService->>Email: Send email to owner
    Email-->>Owner: Notification email
    Backend-->>Frontend: Success
    Frontend-->>Claimer: Show success message
    
    Owner->>Frontend: View Notifications
    Frontend->>Backend: GET /api/notifications
    Backend->>MongoDB: Fetch notifications
    MongoDB-->>Backend: Notification list
    Backend-->>Frontend: Notifications
    Frontend-->>Owner: Display notifications
    
    Owner->>Frontend: Navigate to Profile > Claims
    Frontend->>Backend: GET /api/claims/item/:itemId
    Backend->>MongoDB: Fetch claims for item
    MongoDB-->>Backend: Claims list
    Backend-->>Frontend: Claims
    Frontend-->>Owner: Display claims
    
    Owner->>Frontend: Accept/Reject Claim
    Frontend->>Backend: PUT /api/claims/:claimId
    Backend->>MongoDB: Update claim status
    Backend->>NotifService: Notify claimer
    NotifService->>Email: Send email to claimer
    Backend-->>Frontend: Success
    Frontend-->>Owner: Update UI
```

## Database Schema

```mermaid
erDiagram
    USER ||--o{ ITEM : posts
    USER ||--o{ CLAIM : makes
    USER ||--o{ NOTIFICATION : receives
    ITEM ||--o{ CLAIM : has
    
    USER {
        string _id PK
        string username
        string email
        string password
        boolean isVerified
        date createdAt
    }
    
    ITEM {
        string _id PK
        string title
        string description
        string category
        string location
        string status
        array images
        string postedBy FK
        date date
        date createdAt
    }
    
    CLAIM {
        string _id PK
        string itemId FK
        string claimedBy FK
        string message
        string claimType
        string status
        string foundLocation
        date foundDate
        date createdAt
    }
    
    NOTIFICATION {
        string _id PK
        string userId FK
        string type
        string message
        string itemId FK
        string claimId FK
        boolean isRead
        date createdAt
    }
```

## API Endpoints Overview

### User Routes (`/api/users`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `GET /me` - Get current user info

### OTP Routes (`/api/otp`)
- `POST /send` - Send OTP to email
- `POST /verify` - Verify OTP code
- `POST /resend` - Resend OTP

### Item Routes (`/api/items`)
- `GET /getall` - Get all items
- `GET /:id` - Get item by ID
- `POST /add` - Create new item (with image upload)
- `PUT /:id` - Update item
- `DELETE /:id` - Delete item
- `GET /user/:userId` - Get items by user

### Claims Routes (`/api/claims`)
- `POST /addclaim/:itemId` - Create claim for item
- `GET /item/:itemId` - Get claims for item
- `GET /user/:userId` - Get claims by user
- `GET /count/:itemId` - Get claim count for item
- `PUT /:claimId` - Update claim status (accept/reject)

### Notification Routes (`/api/notifications`)
- `GET /` - Get user notifications
- `GET /unread-count` - Get unread notification count
- `PUT /:id/read` - Mark notification as read
- `PUT /mark-all-read` - Mark all as read

## Technology Stack

```mermaid
graph LR
    subgraph "Frontend"
        REACT[React 18]
        RR[React Router]
        CSS[CSS Modules]
    end
    
    subgraph "Backend"
        NODE[Node.js]
        EXPRESS[Express.js]
        MULTER[Multer]
    end
    
    subgraph "Database"
        MONGODB[MongoDB]
        MONGOOSE[Mongoose ODM]
        REDIS[Redis]
    end
    
    subgraph "External Services"
        CLOUDINARY[Cloudinary]
        NODEMAILER[Nodemailer]
    end
    
    subgraph "Authentication"
        JWT[JWT Tokens]
        BCRYPT[Bcrypt]
    end
    
    REACT --> RR
    REACT --> CSS
    NODE --> EXPRESS
    EXPRESS --> MULTER
    EXPRESS --> MONGOOSE
    EXPRESS --> REDIS
    EXPRESS --> JWT
    EXPRESS --> BCRYPT
    MONGOOSE --> MONGODB
    EXPRESS --> CLOUDINARY
    EXPRESS --> NODEMAILER
```

## Key Features

1. **User Authentication**
   - Email/Password signup and login
   - OTP email verification
   - Password reset functionality
   - JWT-based authentication

2. **Item Management**
   - Report lost items
   - Report found items
   - Upload multiple images (Cloudinary)
   - Search and filter items
   - View item details

3. **Claims System**
   - Claim found items
   - Report finding lost items
   - Declaration agreements
   - Owner review and approval
   - Accept/Reject claims

4. **Notifications**
   - Real-time notification count
   - Email notifications
   - In-app notification center
   - Claim status updates

5. **Profile Management**
   - View posted items
   - Manage claims
   - View notifications
   - Update profile

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- OTP verification with Redis
- Protected routes (PrivateRoute)
- CORS configuration
- Input validation
- Secure cookie handling
