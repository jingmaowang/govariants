# Rating System Documentation

## Overview
This project has implemented a complete Glicko-2 rating system that supports independent ratings for multiple game variants. Users can now view their ratings and leaderboards in the interface.

## New Features

### 1. Game Seat Rating Display (SeatComponent.vue)
- Display player ratings for the current variant on each game seat
- Format: `Rating: 1500 ± 350`
- Shows "Unrated" if the player has no rating for that variant

### 2. User Profile Rating Display (UserView.vue)
- Display ratings for all game variants
- Include rating, RD (rating deviation), and volatility
- Show list of unrated variants
- Beautiful grid layout display

### 3. Leaderboard Page (LeaderboardView.vue)
- Support selecting different game variants to view leaderboards
- Display rank, username, rating, RD, and volatility
- Special styling for top 3 (gold, silver, bronze medal icons)
- Responsive design, mobile-friendly

## Technical Implementation

### Backend API
- `GET /api/leaderboard?variant=<variant>` - Get leaderboard for specified variant
- Use MongoDB aggregation queries to get rating data
- Sort by rating in descending order

### Frontend Components
- Use Vue 3 Composition API
- TypeScript type safety
- Responsive design and beautiful UI

## Supported Variants
The following game variants support the rating system:
- baduk (Baduk)
- phantom (Phantom Baduk)
- capture (Capture Baduk)
- tetris (Tetris Baduk)
- pyramid (Pyramid Baduk)
- thue-morse (Thue-Morse Baduk)
- freeze (Freeze Baduk)
- fractional (Fractional Baduk)
- keima (Keima Baduk)
- one color (One Color Baduk)
- drift (Drift Baduk)
- quantum (Quantum Baduk)
- sfractional (Sequential Fractional Baduk)

## Usage

### View Your Ratings
1. Enter the game interface to see your and opponent's ratings on seats
2. Visit user profile page `/users/<userId>` to view ratings for all variants

### View Leaderboards
1. Click "🏆 View Leaderboard" button on homepage
2. Or directly visit `/leaderboard` page
3. Use dropdown menu to select different game variants
4. View player rankings for that variant

### Get Ratings
1. Choose a game variant that supports ratings
2. Play a game with another player
3. System automatically calculates and updates ratings after game ends

## Rating Algorithm
- Use Glicko-2 rating system
- New player default rating: 1500
- Default RD (rating deviation): 350
- Default volatility: 0.06
- Support draw, win/loss three results

## File Structure
```
packages/
├── server/
│   ├── src/
│   │   ├── api.ts              # New leaderboard API endpoint
│   │   ├── users.ts            # New getLeaderboard function
│   │   └── rating/rating.ts    # Rating calculation logic
└── vue-client/
    ├── src/
    │   ├── views/
    │   │   ├── LeaderboardView.vue    # New leaderboard page
    │   │   └── UserView.vue           # Modified to display ratings
    │   ├── components/GameView/
    │   │   └── SeatComponent.vue      # Modified to display seat ratings
    │   └── router/index.ts            # New leaderboard route
```

## Notes
- Only completed games update ratings
- Need 2 players to calculate ratings
- Guest users also get ratings, but displayed as "guest (...)"
- Rating updates are real-time, effective immediately after game ends

## Future Improvement Suggestions
1. Add rating history records
2. Implement rating trend charts
3. Add rating matching system (match players of similar skill levels)
4. Support viewing leaderboards for specific time periods
5. Add rating statistics and analysis features
