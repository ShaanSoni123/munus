# Google OAuth Setup for Munus

## Overview
This document explains how Google OAuth authentication is implemented in the Munus application.

## How It Works

### 1. Frontend Implementation
- **Google One Tap**: Uses Google's modern One Tap sign-in for a seamless user experience
- **Account Selection**: Users can choose from their Google accounts
- **Role-based Flow**: After sign-in, users are directed to existing role-specific dashboards

### 2. Backend Implementation
- **JWT Verification**: Backend verifies Google's JWT credentials
- **User Creation/Login**: Automatically creates new users or logs in existing ones
- **Role Assignment**: Users specify their role (jobseeker/employer) during sign-in

### 3. User Flow
1. User clicks "Sign in with Google" button
2. Google One Tap appears with account selection
3. User selects their Google account
4. Backend verifies the credential and creates/logs in the user
5. User is redirected to existing role-specific dashboard:
   - **Job Seekers**: Go to `JobSeekerDashboard` component
   - **Employers**: Go to `EmployerDashboard` component

## Configuration

### Frontend (.env)
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Backend (.env)
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
```

## Dashboard Integration

### Existing Dashboards
- **JobSeekerDashboard**: For job seekers to find jobs, build resumes, etc.
- **EmployerDashboard**: For employers to post jobs, find candidates, etc.

### No New Dashboard Created
- Users are redirected to existing dashboard components
- The parent component handles routing based on user role
- Maintains consistency with the existing application structure

## Security Features
- JWT token verification
- Secure credential handling
- Role-based access control
- Automatic session management

## Testing
1. Start the backend server
2. Start the frontend development server
3. Navigate to the profile creation page
4. Click "Sign in with Google"
5. Select a Google account
6. Verify redirection to appropriate existing dashboard

## Troubleshooting
- Ensure Google OAuth library is loaded in index.html
- Check that environment variables are properly set
- Verify Google OAuth credentials are valid
- Check browser console for any JavaScript errors
- Verify backend logs for authentication issues
- Ensure existing dashboard components are properly imported and routed 