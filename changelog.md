# Changelog

## [1.0.0] - 2024-08-04

### Added

#### Login and Signup

- **Google Sign-In**
  - Functionality for logging in with Google added.
  - **Facebook Login**
  - Button for Facebook login added but functionality is skipped for now.
- **Signup**
  - Requires email and password.
  - OTP sent to email for verification.
- **Login**
  - Authenticated users can log in without OTP.
  - Unauthenticated users who haven't verified using OTP need to verify using OTP on login.

#### Onboarding Pages

- **Basic Details**
  - User adds full name and profile picture. Full name is mandatory.
- **Upload Resume**
  - Option to upload a resume.
- **Create Link**
  - Option to create a link for the resume.
  - Onboarding steps can be skipped.

#### Dashboard

- **Overview Page**
  - Display aggregated data of user resumes.
  - Show top-performing links and top links.
- **My Resume Page**
  - Functionality to upload resumes.
  - Option to mark resumes as active or inactive.
  - View and edit resume links.
- **My Links Page**
  - Create links for resume uploads.
  - Option to request email notifications for views.
  - Display aggregated visit duration, downloads, and views per link.
  - Show detailed stats per link and session, including:
    - Page-wise duration of resume views in bar graph format.
    - Heatmap for mouse hover on resume.
    - Percentage read based on pages viewed by the recruiter.
    - Detailed download table with aggregation option.
- **Plans Page**
  - Display three subscription plans: Free, Standard, and Pro.
  - Integration with Stripe for payment and upgrading plans.
- **Feedback Page**
  - Display feedback from recruiters about user resumes.
- **Recruiter Page**
  - Allow recruiters to download, view, and give feedback on resumes.
- **Real-Time Notification System**
  - Notifications for resume views, link publications, and downloads in the dashboard.

#### Public URL for Recruiters

- **Data Batching**
  - Data is batched and sent to the database every 10 seconds.
  - Data is also sent to the database before a page refresh or close.
- **Session Management**
  - A link opened in a new tab is considered a new session, but not when opened in the same tab.

#### Customer Support Chatbot

- **Chatbot from Chatbase.co**
  - Added for customer support.
  - Trained on a custom dataset about Rezlink.
