# Realtime Chat Application

A modern realtime chat application built with **React**, **TypeScript**, **Firebase**, and **Tailwind CSS**. The project demonstrates a real‑time messaging with Firestore, authentication via Google, and a clean UI powered by shadcn/ui.

This repository is designed as a practical example of how to build a realtime application

## Features

* Google authentication (Firebase Auth)
* Realtime messaging using Firestore subscriptions
* Channel‑based chat system
* Channel membership management
* User search
* Optimistic UI updates
* Persistent authentication state (Zustand)

## Tech Stack

* **React** + **TypeScript**
* **Firebase** (Auth, Firestore)
* **Zustand** (state management)
* **TanStack Query** (server state)
* **Tailwind CSS**
* **shadcn/ui**
* **React Router**
* **Vite**

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/forelolit/sibers.git
cd sibers
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

## Application Usage

### To start using the application, follow these steps:
# Sign in with a Google account
* Authenticate using your Google account to access the application features.
# Create a channel
* After signing in, create a new channel to start chatting.
# Invite members
You can add users to your channel in one of the following ways
* Search for users using the built-in search functionality and invite them directly.
* Ask owner to add you to an existing channel.
Once added to a channel, all members can interact according to the channel’s functionality.
