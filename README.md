# FanFlow AI
 
A GenAI-enabled stadium operations platform built for FIFA World Cup 2026, submitted for PromptWars.
 
## Overview
 
FanFlow AI is a match-day companion that serves two audiences at once:
 
- **Fans** — navigation, accessibility support, and live match-day updates
- **Staff / Operations** — a live ops console for crowd density, gate wait times, transportation flow, incident tracking, and resource status
An AI layer sits on top of both, surfacing real-time insights during live operations.
 
## Features
 
### Fan-Facing
- Stadium navigation and wayfinding
- Accessibility support and assistance requests
- Live match and event updates
### Staff-Facing (Ops Console)
- **Crowd Analytics** — live occupancy tracking, zone-level density (North/South/East/West), rolling 60-min crowd trends
- **Gates & Entry** — per-gate wait times, load, and utilization status
- **Transportation** — inbound flow across rail, shuttle, rideshare, and parking, with surge and next-arrival indicators
- **Incident Feed** — real-time logging for medical, congestion, lost items, accessibility, and security events, with status tracking (Open / Ack / Dispatched / Resolved)
- **Resource Status** — network, power, water, and staffing health at a glance
- **AI Insights** — confidence-scored, signal-driven recommendations generated from live operational data
## Architecture
 
- Built on an Anthropic API-backed architecture for the AI insights and assistant layer
- Live dashboard with auto-refreshing operational metrics
- Modular structure separating fan-facing and staff-facing concerns
## Status
 
Actively being refined — core dashboard, crowd analytics, transportation, and incident modules are functional. Ongoing work includes expanding the AI assistant and accessibility features.
 
## Live Demo
 
https://worldcup-ai-companion.lovable.app
 
## Competition
 
Built and submitted as an entry for **PromptWars**.
 
