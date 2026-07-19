# FanFlow AI

A GenAI-enabled stadium operations platform built for FIFA World Cup 2026 — submitted for **PromptWars**.

**Live demo:** https://worldcup-ai-companion.lovable.app
**Repo:** https://github.com/anwayapoojary-spec/Worldcup-dashboard-Promptwars-

## The Problem

Match days at a major stadium involve two very different groups trying to solve the same problem from opposite ends: fans trying to navigate a huge, crowded venue, and staff trying to keep that same venue safe, moving, and running on time. Most existing tools pick one side. FanFlow AI tries to serve both from a single connected system, with an AI layer that turns raw operational signals into decisions someone can actually act on.

## What It Does

### Fan-Facing
- **Navigation** — in-stadium wayfinding to gates, seats, and amenities
- **Accessibility** — requesting assistance, accessible routes, and accommodations
- **Live updates** — real-time match and event information

### Staff-Facing (Operations Console)
- **Dashboard** — a live match-day overview: attendee occupancy, average gate wait, active incidents, and system health, all updating in real time
- **Crowd Analytics** — rolling occupancy trends and zone-level density (North / South / East / West / Pitch) so staff can see where pressure is building before it becomes a problem
- **Gates & Entry** — per-gate status, wait time, load, and utilization, so staff can redirect flow to underused entrances
- **Transportation** — inbound flow across rail, shuttle, rideshare, and parking, with next-arrival times and surge indicators
- **Incident Feed** — logging and status tracking (Open → Ack → Dispatched → Resolved) for medical events, congestion, lost items, accessibility requests, and security concerns
- **Resource Status** — network, power, water, and staffing levels at a glance
- **AI Insights** — a confidence-scored insights panel that reads live signals (currently 180+ per session) and surfaces recommended actions, rather than making staff dig through raw numbers themselves

## Why This Design

The two-sided structure is the core idea: fan tools and ops tools aren't separate products bolted together, they're two views into the same live state of the stadium. A gate getting congested isn't just an ops metric — it should also change what a fan's navigation tool tells them. That connective layer is what the AI insights engine is meant to do.

## Tech / How It Was Built

This was vibe coded — built rapidly with AI-assisted tooling (Lovable) rather than hand-written from scratch. The value I put in was on the systems thinking side: what a stadium operations team actually needs to track, how fan-facing and staff-facing needs intersect, and what data model ties both together — not on writing every line of the frontend by hand.

## Status

Core dashboard, crowd analytics, gates, transportation, and incident modules are functional. Ongoing work includes deepening the AI assistant, expanding accessibility features, and tightening the fan-facing ↔ ops-facing feedback loop.

## Competition

Built and submitted as an entry for **PromptWars**.
