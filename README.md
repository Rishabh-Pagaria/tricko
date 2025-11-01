# Tricko 🎃

A Halloween-themed mobile app that connects treat-givers with trick-or-treaters around Texas A&M University. Built with React Native, Expo, and Firebase.

## Features

### For Trick-or-Treaters
- Interactive map showing active treat locations
- View available treats and trick themes at each location
- Real-time updates of active houses
- View treat details by tapping on orange markers

### For House Owners
- Mark your house as active on the map
- Specify available treats
- Set your preferred trick theme
- Manage your house's visibility

## Tech Stack

- **Frontend**: React Native with Expo
- **Maps**: React Native Maps
- **Backend**: Firebase (Firestore & Authentication)
- **State Management**: React Context API
- **Navigation**: Expo Router
- **Authentication**: Firebase Auth
- **Styling**: React Native StyleSheet

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Rishabh-Pagaria/tricko.git
```

2. Install dependencies:
```bash
cd tricko
npm install
```

3. Start the development server:
```bash
npx expo start -c
```

4. Open the app on your device using Expo Go or run on a simulator

## Project Structure

```
tricko/
├── app/                 # Expo Router screens
│   ├── owner/          # House owner screens
│   └── tricker/        # Trick-or-treater screens
├── components/         # Reusable components
├── src/
│   ├── lib/           # Firebase config and auth
│   └── services/      # API services
├── assets/            # Images and animations
└── scripts/           # Utility scripts
```

## Features in Detail

### Map View
- Orange markers indicate active houses
- Tap markers to view treat and trick information
- Real-time updates for house status

### User Roles
- **House Owners**: Can publish their house location and manage treat availability
- **Trick-or-Treaters**: Can view active houses and their details

## Development Scripts

- `npm start`: Start the Expo development server
- `scripts/seed-houses.ts`: Add sample house data to Firestore


## Contributors

- Rishabh Pagaria
