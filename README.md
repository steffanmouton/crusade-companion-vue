# Crusade Companion

A Vue.js application for managing Warhammer 40k Crusade campaigns.

## Features

- User authentication with Firebase
- Create and manage Crusade armies
- Track battles and experience
- Manage units and their progression

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Firebase account

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Register a web app in your Firebase project
5. Copy the Firebase configuration values to your `.env` file:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
```

### Installation

#### Code Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

#### Firebase Config

1. Create a `.env` file based on `.env.example` and add your Firebase configuration
2. Start the development server:

```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

## Technologies Used

- Vue 3 with Composition API
- Vuetify for UI components
- Pinia for state management
- Firebase for authentication and database
- TypeScript for type safety
- Vite for fast development and building

## License

This project is licensed under the MIT License.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Admin Setup and Data Seeding

The application includes an admin interface for seeding initial data into the Firestore database. This is helpful for setting up the game's initial data like troops, equipment, and factions.

### Setting Up an Admin User

1. First, register a regular user through the application's sign-up page
2. Run the following command to promote the user to admin status:

```bash
npm run create-admin
```

3. When prompted, enter the email and password of the user you want to make an admin
4. The script will update the user's record in Firestore with admin privileges

### Accessing the Admin Panel

Once a user has admin privileges, they can access the admin panel from the dashboard. Look for the "Admin Panel" button in the account card.

### Seeding Game Data

The admin panel allows you to seed the following data collections:

- **Troops** - Character types that can be added to armies
- **Equipment** - Weapons, armor, and other items that can be equipped by troops
- **Factions** - The different factions that armies can belong to

Each collection will only be seeded if it's currently empty. The seeding process adds timestamps to each record for tracking when they were created.

## Development

```bash
npm run dev
```
