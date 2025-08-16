# ⚽ Hud FC Manager

A comprehensive football management platform that allows users to manage their squad, create matches, track statistics, and organize tournaments. Built with modern web technologies for a seamless user experience.

> **📋 IMPORTANT LICENSE NOTICE**: This software is open source for viewing and local use only. Public hosting, redistribution, or commercial use is prohibited. See [LICENSE.md](LICENSE.md) for details.

## 🌟 Features

### 📋 Squad Management
- **Player Creation & Management**: Add players with customizable positions, ages, and ratings
- **Position-Based Organization**: Organize players by Goalkeeper, Defender, Midfielder, and Forward positions
- **Player Statistics**: Track comprehensive stats including goals, assists, saves, and clean sheets
- **Rating System**: Monitor player performance with match ratings and averages

### ⚽ Match Management
- **Flexible Team Sizes**: Support for customizable match formats from 5v5 to 11v11
- **Match Creation**: Easy-to-use interface for setting up matches with date selection
- **Goal & Save Tracking**: Record goals, assists, saves, and player performance
- **Match History**: Complete history of all played matches with detailed statistics

### 📊 Statistics & Analytics
- **Player Performance**: Detailed individual player statistics and performance metrics
- **Team Analytics**: Comprehensive team performance analysis
- **Match Statistics**: In-depth match analysis with goals, assists, and saves tracking
- **Historical Data**: Long-term performance tracking and trends

### 🏆 Tournament Management
- **Tournament Creation**: Set up tournaments with various formats
- **Multiple Formats**: Support for single elimination, double elimination, league, and group stage formats
- **Team Registration**: Team registration and management system

### 🔐 User Authentication
- **Secure Authentication**: User registration and login system
- **Personal Data**: Each user has their own squad and match data
- **Data Privacy**: Secure data storage with user isolation

## 🚀 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development for better code quality
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing for single-page application
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **PostgreSQL** - Robust relational database

### State Management
- **React Query (TanStack Query)** - Powerful data fetching and caching
- **React Hooks** - Modern state management with useState and useContext
- **Custom Hooks** - Reusable logic abstraction

### Performance Optimizations
- **Intelligent Caching** - Smart caching strategies with React Query
- **Optimized Queries** - Efficient database queries with minimal joins
- **Error Recovery** - Automatic retry mechanisms and error handling
- **Loading States** - Smooth loading experiences with skeleton screens

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** - Package manager (comes with Node.js)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd football-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application running.

### Android Installation

1.  **Download the APK**
    *   You can download the latest `app-release.apk` from the root of this repository or by clicking [here](./app-release.apk).

2.  **Enable Unknown Sources**
    *   On your Android device, go to **Settings > Security**.
    *   Enable the **"Install from unknown sources"** or **"Unknown sources"** option. This allows you to install apps from outside the Google Play Store.
    *   On newer Android versions, you may need to grant this permission to your browser or file manager app when you try to open the APK.

3.  **Install the App**
    *   Open the downloaded `app-release.apk` file on your Android device.
    *   Follow the on-screen prompts to install the application.

### Database Setup

The application uses Supabase as the backend. The database schema includes:

- **Players Table**: Store player information and statistics
- **Matches Table**: Match data with team compositions and results
- **Match Goals Table**: Detailed goal tracking with scorers and assisters
- **Match Saves Table**: Goalkeeper save statistics
- **Tournaments Table**: Tournament information and settings
- **Tournament Teams Table**: Team registrations and standings
- **Tournament Matches Table**: Tournament-specific match data

## 📱 Usage Guide

### Getting Started

1. **Create an Account**
   - Register with your email and password

2. **Build Your Squad**
   - Add players with their positions and ratings
   - Organize your team by position
   - Set player details like age and initial ratings

3. **Create Your First Match**
   - Select team composition (5v5 to 11v11)
   - Choose match date
   - Track goals, assists, and saves

4. **Analyze Performance**
   - View detailed statistics for players and teams
   - Track performance trends over time
   - Identify top performers and areas for improvement

### Advanced Features

#### Custom Match Formats
The system supports various match formats:
- **5v5**: Small-sided games perfect for training
- **7v7**: Youth football standard
- **11v11**: Full football matches
- **Custom**: Any combination (e.g., 6v8, 9v10)

## 🎯 Features in Detail

### Match Statistics Tracking

The system automatically calculates and tracks:

- **Goals**: Scored by each player with assist tracking
- **Assists**: Secondary assists and key passes
- **Saves**: Goalkeeper statistics and clean sheets
- **Team Performance**: Overall team statistics and trends

### Performance Analytics

Analytics include:

- **Player Progression**: Track improvement over time
- **Position Analysis**: Performance by playing position
- **Match Impact**: Key performance indicators

## 🔧 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── AuthPage.tsx    # Authentication component
│   ├── MatchCreation.tsx # Match creation interface
│   ├── SquadManagement.tsx # Squad management
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication hook
│   ├── useSupabaseFootballData.ts # Data management
│   └── ...
├── integrations/       # External service integrations
│   └── supabase/       # Supabase configuration
├── pages/              # Page components
├── services/           # Business logic services
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

### Key Components

#### `useSupabaseFootballData` Hook
Centralized data management hook that handles:
- Player CRUD operations
- Match creation and management  
- Statistics calculation

#### `MatchCreation` Component
Match creation interface featuring:
- Dynamic team size validation (5-11 players)
- Goal and save tracking
- Match completion workflow

#### `Statistics` Component
Analytics dashboard providing:
- Player performance metrics
- Team statistics overview
- Historical performance trends

### Build Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🚀 Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build** (optional)
   ```bash
   npm run preview
   ```

### Deployment Options

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

#### Netlify
1. Connect repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set environment variables

#### Other Platforms
The built application (`dist` folder) can be deployed to any static hosting service:
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting
- Digital Ocean Apps

## 🤝 Contributing

**Before contributing, please read the [LICENSE.md](LICENSE.md) to understand the project's licensing terms.**

### Development Setup

1. **Fork the repository** (for contribution purposes only)
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Code Style

- Use TypeScript for type safety
- Follow existing component patterns
- Write descriptive commit messages
- Add comments for complex logic
- Ensure responsive design principles

### Contribution Agreement

By contributing to this project, you agree that your contributions will be licensed under the same restrictive terms as outlined in [LICENSE.md](LICENSE.md).

## 📄 License

**IMPORTANT LICENSING NOTICE**

This project uses a **custom restrictive license**. While the source code is open for viewing and local use, it comes with specific restrictions:

### ✅ **What You CAN Do:**
- View and study the source code for learning purposes
- Run and modify the software locally for personal use
- Contribute to the project via pull requests
- Report bugs and suggest features

### ❌ **What You CANNOT Do:**
- Host or deploy this software on any public server or platform
- Redistribute the software or any portion of it
- Use the software for commercial purposes
- Create and distribute derivative works

**This software is provided for local development and educational purposes only.**

For complete license terms, see the [LICENSE.md](LICENSE.md) file.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Supabase** for the robust backend infrastructure
- **Tailwind CSS** for the utility-first styling approach
- **React Query** for excellent data management capabilities
- **Lucide** for the comprehensive icon library

## 📞 Support

If you encounter any issues or have questions:

1. **Check the documentation** - Most common issues are covered here
2. **Search existing issues** - Someone might have faced the same problem
3. **Create a new issue** - Provide detailed information about the problem

---

**Built with ❤️ for football enthusiasts everywhere** ⚽
