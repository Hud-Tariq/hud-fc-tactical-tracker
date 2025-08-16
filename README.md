# ⚽ Hud FC Manager

A comprehensive football management platform that allows users to manage their squad, create matches, track statistics, and organize tournaments. Built with modern web technologies for a seamless user experience.

![App Overview](docs/screenshots/app-overview.png)
*Main dashboard showing squad management and navigation*

## 🌟 Features

### 📋 Squad Management
- **Player Creation & Management**: Add players with customizable positions, ages, and ratings
- **Position-Based Organization**: Organize players by Goalkeeper, Defender, Midfielder, and Forward positions
- **Player Statistics**: Track comprehensive stats including goals, assists, saves, and clean sheets
- **Rating System**: Monitor player performance with match ratings and averages

![Squad Management](docs/screenshots/squad-management.png)
*Squad management interface with player cards and statistics*

### ⚽ Match Management
- **Flexible Team Sizes**: Support for customizable match formats from 5v5 to 11v11
- **Match Creation**: Easy-to-use interface for setting up matches with date selection
- **Goal & Save Tracking**: Record goals, assists, saves, and player performance
- **Match History**: Complete history of all played matches with detailed statistics

![Match Creation](docs/screenshots/match-creation.png)
*Match creation interface showing team selection and match details*

![Match View](docs/screenshots/match-view.png)
*Match view with scoring and statistics tracking*

### 📊 Statistics & Analytics
- **Player Performance**: Detailed individual player statistics and performance metrics
- **Team Analytics**: Comprehensive team performance analysis
- **Match Statistics**: In-depth match analysis with goals, assists, and saves tracking
- **Historical Data**: Long-term performance tracking and trends

![Statistics Dashboard](docs/screenshots/statistics.png)
*Statistics dashboard showing player and team performance metrics*

### 🏆 Tournament Management
- **Tournament Creation**: Set up tournaments with various formats
- **Multiple Formats**: Support for single elimination, double elimination, league, and group stage formats
- **Team Registration**: Team registration and management system

![Tournament Page](docs/screenshots/tournaments.png)
*Tournament management interface*

### 🔐 User Authentication
- **Secure Authentication**: User registration and login system
- **Personal Data**: Each user has their own squad and match data
- **Data Privacy**: Secure data storage with user isolation

![Authentication](docs/screenshots/auth.png)
*Authentication interface*

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

### Database Setup

The application uses Supabase as the backend. The database schema includes:

- **Players Table**: Store player information and statistics
- **Matches Table**: Match data with team compositions and results
- **Match Goals Table**: Detailed goal tracking with scorers and assisters
- **Match Saves Table**: Goalkeeper save statistics
- **Tournaments Table**: Tournament information and settings
- **Tournament Teams Table**: Team registrations and standings
- **Tournament Matches Table**: Tournament-specific match data

![Database Schema](docs/screenshots/database-schema.png)
*Database schema overview*

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

### Development Setup

1. **Fork the repository**
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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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

## 🏆 Screenshots Gallery

### Dashboard Overview
![Dashboard](docs/screenshots/dashboard-full.png)
*Complete dashboard view with navigation and content areas*

### Squad Management Detail
![Squad Detail](docs/screenshots/squad-detail.png)
*Detailed squad management with player cards and statistics*

### Match Creation Flow
![Match Flow](docs/screenshots/match-creation-flow.png)
*Step-by-step match creation process*

### Statistics Deep Dive
![Statistics Detail](docs/screenshots/statistics-detail.png)
*Comprehensive statistics and analytics dashboard*

### Tournament Management
![Tournament Management](docs/screenshots/tournament-management.png)
*Tournament creation and management interface*

### Responsive Design
![Mobile View](docs/screenshots/mobile-responsive.png)
*Mobile-responsive design across different screen sizes*

---

**Built with ❤️ for football enthusiasts everywhere** ⚽
