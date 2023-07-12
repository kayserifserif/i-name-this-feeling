# I Name This Feeling

A tool for writing poetry by giving names to your feelings.

![The prompt "what i feel is" followed by repetitions of "rage and rage and rage".](documentation/Screenshot 2023-07-11 at 10.34.01 PM.png)

## Development

This is a Node.js/Express app using EJS as the templating engine. It also interfaces with a Supabase database — to get that running, make a copy of `.env.example`, rename it `.env`, and add the API key from the Supabase project key.

```
npm install
npm run dev
```