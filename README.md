# Farcaster Neynar Identity Sync Engine

By mid-2026, building real-time decentralized social applications requires high-throughput data pipelines that sync smoothly with social graphs like Farcaster. This repository provides a professional-grade Node.js reference architecture to continuously mirror Farcaster user profiles, custody addresses, and verified connected wallets using the **Neynar API**.

Rather than querying decentralized Hubs via slow, gas-intensive networks or complex gRPC protocols, this utility manages connection throttling and data formatting to deliver structured identity profiles for advanced cross-chain applications.

## Core Features
- **Deterministic Identity Mapping:** Automatically links a user's Farcaster ID (FID) with their primary custody address and connected EVM/Solana wallets.
- **Webhook Processing:** Built-in middleware to verify and ingest real-time profile updates, follows, and castings from Neynar webhooks.
- **Batch Backfill Routine:** High-velocity script designed to backfill large sets of historical social graph data cleanly.
- **Flat Layout:** All processing middleware, authentication strategies, and routing systems reside collectively in the root directory.

## Getting Started
1. Install client dependencies: `npm install`
2. Configure your Neynar API API key and target database credentials inside `.env`.
3. Start the tracking worker daemon: `node syncEngine.js`
