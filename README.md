# RhymePage

## Overview
RhymePage is a dynamic web application designed to streamline and enrich the lyric-writing process for artists. With an intuitive interface, RhymePage leverages the power of the [Datamuse API](https://www.datamuse.com/api/) to provide rhyme suggestions and the [Dictionary API](https://api.dictionaryapi.dev/api/v2/entries/en_US/) to offer definitions. Beyond writing, RhymePage offers a robust notebook feature that enables users to save, organize, share, and edit their lyrical masterpieces. RhymePage is engineered using modern technologies such as React, TypeScript, Tailwind CSS, and Firebase.

## Key Technologies
- Vite: A lightning-fast frontend build tool.
- Firebase: A comprehensive app development platform used for user authentication and database management.
- React: A JavaScript library for building interactive user interfaces.
- TypeScript: A statically typed superset of JavaScript that ensures code reliability.
- Tailwind CSS: A utility-first CSS framework for creating custom designs.
- React Router: A collection of navigational components to create single-page applications with React.
- DaisyUI: A plugin for Tailwind CSS that provides additional UI components.
- Axios: A JavaScript library for making HTTP requests.
- React Icons: A library that offers customizable and easily scalable React icons.
- Heroicons: A set of beautifully crafted SVG icons.
- TxtAnime.js: A JavaScript library to create appealing text animations.

## Feature Highlights

### Landing Page
- The landing page showcases eye-catching text animations powered by TxtAnime.js, illustrating the application's features and functionalities.

### Dashboard
- Here, users can enter lyrics and instantly receive rhyme suggestions for the last word in real-time.
- The application actively listens for space or enter key presses to trigger API requests for rhyme suggestions.
- Suggested words are presented as interactive buttons. A left-click appends the word to the lyrics and requests new suggestions, whereas a right-click triggers an API request for the word's definition.
- Lyrics can be saved to the user's notebook (an account is required).

### Notes
- Users can view and manage saved lyrics.
- Lyrics can be organized into notebooks, and shared with collaborators.
- Provides functionalities to create new notes, edit existing notes, and delete notes.

### Profile
- Users can view and edit their profile information, including username, email, and password.
- Profile statistics, such as follower count, following count, note count, and usage stats are displayed.
- Users can delete their account.

### Login/Register
- New users can create an account, while returning users can log in.
- Password recovery is supported.
- Google Authentication is integrated for an expedited sign-in process.