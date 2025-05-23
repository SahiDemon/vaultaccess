# VaultAccess - Secure Access Control System

![VaultAccess Logo](public/logo.png)

VaultAccess is a modern security dashboard that provides comprehensive access control management, user authentication, and security monitoring features.

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- A Supabase account for the backend database
- Git for version control

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sahidemon/vaultaccess.git
cd vaultaccess
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
```

5. Access the application at `http://localhost:3000`

### Database Setup

The application requires a Supabase backend with the following tables:

- `_history`: Stores access log data
- `alerts`: Stores system alerts
- `users`: Manages user authentication

Run the database setup scripts:

```bash
node lib/setup-db.js
```

You can also manually execute the SQL migrations in the `lib/migrations` directory using the Supabase SQL Editor.

## Features

### Authentication

VaultAccess provides secure authentication:

- Email/password login
- Session management
- Role-based permissions

### Dashboard Overview

The dashboard displays key security metrics:

- Access attempts (total, successful, failed)
- User statistics
- Recent activity charts

### Access Control

Manage who can access your secure areas:

- User role management
- Access schedules
- Permission groups

### Access Logs

Track all access attempts with detailed information:

- Authentication method used
- Success/failure status
- Timestamp data
- User information

The logs view features:
- Scrollable history
- Color-coded statuses (green for granted, red for denied)
- Filter by authentication method
- Responsive design for desktop and mobile

### System Alerts

Monitor important system events:

- Real-time alerts for security events
- Configuration changes
- System updates
- Access control modifications

The alerts are:
- Color-coded by severity
- Categorized by type
- Time-stamped
- Scrollable for easy review

### Facial Recognition

Add facial recognition for enhanced security:

- Register new faces
- Update reference images
- Integrate with access control

## User Guide

### First-time Setup

1. Register an admin account
2. Configure system settings
3. Add users and assign permissions
4. Set up authentication methods

### Managing Access Control

1. Navigate to the "Access Control" section
2. Enable/disable different authentication methods
3. Set access rules for different users
4. Create access schedules

### Monitoring Logs

1. Check the "Access Logs" section for all authentication events
2. Use filters to find specific events
3. Export logs for compliance purposes

### System Alerts

1. Monitor the "System Alerts" section for important notifications
2. Configure alert preferences in Settings
3. Set up notifications for critical events

## Troubleshooting

### Common Issues

- **Authentication Failed**: Check user credentials and permissions
- **Database Connection Error**: Verify Supabase configuration
- **Missing Logs**: Ensure database tables are properly created

### Support

For additional help, contact support at:

- Email: support@vaultaccess.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/vaultaccess/issues)
