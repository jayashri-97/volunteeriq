# VolunteerIQ — Product Overview

## Purpose & Value Proposition
VolunteerIQ is an AI-powered disaster relief coordination platform built for NGOs and volunteer networks, primarily targeting India. It bridges the gap between field reports and volunteer deployment by automating the parsing, scoring, and matching pipeline — reducing response time from hours to minutes.

Built for the **Google Solution Challenge 2025**.

## Key Features

### AI-Powered Field Report Parsing
- Accepts raw SMS, WhatsApp messages, voice transcripts, or any informal text
- Uses **Google Gemini 1.5 Flash** to extract: location, need type, urgency score (1–10), skills required, family count, and description
- Falls back to an intelligent keyword-based mock parser when no API key is present
- Validates coordinates against India's geographic bounding box (lat 8–37, lng 68–97.5)

### Urgency Scoring Engine
- Composite score formula: `(ai_score × 0.5) + (recency_weight × 0.3) + (family_count_weight × 0.2)`
- Maps AI score to urgency levels: Critical (≥8), High (≥5), Medium (<5)
- Scores displayed as 0–100 integer on each need card

### Volunteer Matching
- AI-driven matching via Gemini ranks top 3 volunteers by skill overlap, proximity, and availability
- Falls back to proximity + availability composite scoring when AI matching fails
- Dynamic match map stored per session alongside static pre-seeded match data

### Real-Time Dashboard (3-Panel Layout)
- **Left panel**: Filterable, searchable needs list sorted by urgency score
- **Center panel**: Interactive Leaflet map with pin markers, fly-to animation on new needs, and field report input strip
- **Right panel**: Selected need detail with matched volunteers, assign/resolve actions, and activity feed

### Mobile-Responsive Layout
- Tab-based mobile navigation: Needs / Map / Submit / Profile
- Responsive grid collapses to single-column on small screens

### Keyboard Shortcuts
- `/` — focus search
- `Escape` — deselect need or close modal
- `Arrow Up/Down` — navigate needs list
- `R` — open resolve modal for selected need

## Target Users
- **NGO coordinators** managing disaster relief operations across Indian districts
- **Field volunteers** receiving assignments and deployment instructions
- **Relief network administrators** tracking active needs, deployed volunteers, and resolved cases

## Use Cases
1. Field coordinator submits a raw SMS report → AI parses and scores it → matched volunteers appear instantly
2. Coordinator filters needs by urgency level and assigns the best-matched volunteer in one click
3. Operations team monitors live stats (critical count, active needs, deployed/available volunteers, resolved cases) from the topbar
4. Post-disaster review of resolved needs and activity log

## Domain Context
- Focused on Maharashtra, India districts (Parbhani, Washim, Yavatmal, Nanded, Akola, Amravati, etc.)
- Supports 23 need types: Water Supply, Medical Aid, Food Distribution, Shelter, Search & Rescue, Sanitation, Power Restoration, Road Clearance, Earthquake Relief, Cyclone Response, Flood Rescue, and more
- 20 volunteer skill categories: First Aid, Medical, Rescue Operations, Logistics, Driving, Water Purification, Construction, Counseling, Translation, etc.
