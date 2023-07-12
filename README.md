# I Name This Feeling

A tool for writing poetry by giving names to your feelings.

!["These emotions of…" followed by repetitions of "rage and rage and rage".](documentation/Screen%20Shot%202020-07-08%20at%2021.57.05.png)

## Development

This is a Node.js/Express app using EJS as the templating engine. It also interfaces with a Supabase database — to get that running, make a copy of `.env.example`, rename it `.env`, and add the API key from the Supabase project key.

```
npm install
npm run dev
```