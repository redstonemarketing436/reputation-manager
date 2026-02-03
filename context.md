Project Context: Redstone Reputation Manager
1. Vision & Aesthetic
Goal: A luxury multi-tenant reputation and operations bridge for property management.

Style: Architectural, "Dark Mode" luxury.

Palette: Background #08252b, Cards #2e4a51, Accent Red #ba0024.

Typography: PP Mori (Sans-Serif).

Edges: Sharp, 0px border-radius (no rounded corners).

Layout: Asymmetrical Bento-Box grid for the dashboard.

2. Current Tech Stack
Framework: Next.js (App Router) in src/app.

Styling: Tailwind CSS + Lucide React icons.

AI: Gemini via @google/generative-ai.

External Integrations: Entrata (Status webhooks) and Google Business Profiles (Review management).

3. High-Priority Architectural Fixes (Next Steps)
Security: Move Gemini API calls from client-side (NEXT_PUBLIC) to Server Actions or Route Handlers to protect API keys.

Survey Logic Loop: * The Entrata Webhook must generate survey URLs that include propertyId (e.g., /survey?propertyId=XYZ&token=ABC).

The /survey page must attribute feedback to that propertyId in the database.

Data Layer: Transition from MOCK_REVIEWS to a persistent database (Postgres/Supabase/Firestore) to support multi-tenant Role-Based Access Control (RBAC).

4. Feature Requirements
Smart Survey: 1-3 stars triggers internal feedback + 30s delay before showing Google link. 4-5 stars shows Google link immediately.

AI Insights: Use Gemini to flag "Actionable Feedback" (Maintenance, Noise, etc.) and display these in a "Priority Actions" bento-box on the dashboard.

Reporting: Ability to filter data by date ranges and property IDs.

5. File Structure Reference
src/app/survey: Rating gate flow.

src/app/api/webhooks/entrata: Entry point for resident status changes.

src/lib/services/ai.ts: Logic for drafting replies and analyzing sentiment.

src/contexts/PropertyContext.tsx: Global state for the selected property filter.
