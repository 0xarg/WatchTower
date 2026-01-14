# WatchTower

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

A production-ready website uptime monitoring system that continuously checks endpoints, detects downtime using incident-based logic, and sends alerts when services go down and recover.

## Table of Contents

- [Features](#features)
- [Why WatchTower](#why-watchtower)
- [How It Works](#how-it-works)
- [Architecture Highlights](#architecture-highlights)
- [Tech Stack](#tech-stack)
- [Data Model](#data-model)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Automated Uptime Checks**: HTTP/HTTPS endpoint monitoring with configurable intervals and timeouts.
- **Incident-Based Downtime Detection**: Avoids false positives and alert spam by using incident lifecycles.
- **Email Alerts**: Notifications for incident start (DOWN) and resolution (UP).
- **Derived Status**: Status is computed from real data, not stored flags.
- **Secure Background Worker**: Protected by secret headers for serverless execution.
- **Serverless-Friendly**: Designed for predictable costs and no long-running processes.

## Why WatchTower

Unlike basic monitoring demos that simply ping URLs and toggle status flags, WatchTower is built like a real monitoring system. It incorporates background workers, incident lifecycles, alert deduplication, and serverless-safe execution, making it suitable for SaaS foundations, internal tools, or reference architectures for cron-driven systems.

## How It Works

The system operates continuously without manual intervention:
GitHub Actions (cron)
↓
Secure Worker API (/api/worker/checks)
↓
HTTP checks + optimistic locking
↓
check_results → incidents
↓
Email alerts (DOWN / UP)

## Architecture Highlights

- **Incident Model**: Incidents open after consecutive failures and close on recovery.
- **Optimistic Locking**: Prevents duplicate checks in concurrent runs.
- **Alert Deduplication**: One alert per incident, with retries on delivery failure.
- **Hard Execution Limits**: Bounded work per cron run for predictable serverless costs.

These patterns mirror those in professional monitoring platforms.

## Tech Stack

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS / shadcn/ui

### Backend / Infrastructure

- Supabase (PostgreSQL, Auth, RLS)
- GitHub Actions (cron jobs)
- Vercel (deployment)

### Alerts

- Email via Resend

## Data Model

- **monitors**: Configuration (URL, interval, timeout)
- **check_results**: Append-only check history
- **incidents**: Open/resolved downtime periods
- **alerts**: Alert delivery tracking

Status is derived from data, never stored explicitly.

## Prerequisites

- Node.js (version 18 or higher)
- pnpm
- Supabase account
- Resend account (for email alerts)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/watchtower.git
   cd watchtower
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    RESEND_API_KEY=your_resend_api_key
    WORKER_SECRET_HEADER=your_worker_secret_header_value
   ```
4. Set up Supabase:
   - Create a new Supabase project.
   - Run the SQL migrations located in the `supabase/migrations` directory to set up the database schema.
5. Deploy the application:
   - You can deploy the Next.js application to Vercel or any other hosting provider that
     supports Next.js.

## Usage

- Add monitors via the web interface.
- The GitHub Actions cron job will automatically run the background worker to perform checks and handle incidents
- Monitor email alerts for downtime notifications.

## Contributing

Contributions are welcome! Please open issues and submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue on GitHub or contact the maintainer at your
email address.
Anurag Poonia - [GitHub](https://github.com/0xarg)
