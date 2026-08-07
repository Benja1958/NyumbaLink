# NyumbaLink Beta Readiness Checklist

**Project:** NyumbaLink  
**Goal:** Prepare the platform for a small closed beta with real landlords and tenants before public launch.

---

# Current MVP Status

## Core Features

- [x] User authentication
- [x] Tenant property browsing
- [x] Property search & filters
- [x] Favorites
- [x] Landlord property management (CRUD)
- [x] Admin listing approval
- [x] Multiple property images
- [x] Property image gallery
- [x] Landlord image management
- [x] Tenant ↔ Landlord messaging
- [x] Message polling
- [x] Latest message preview
- [x] Unread message count
- [x] Property reporting
- [x] Admin report moderation
- [x] Listing rejection workflow
- [x] Listing resubmission
- [x] Availability confirmation

---

# Authentication

## Backend

- [ ] Move from localStorage authentication to HTTP-only cookies
- [ ] Refresh token support
- [ ] Token expiration handling
- [ ] Logout invalidates refresh token

## Frontend

- [ ] Redirect unauthorized users automatically
- [ ] Better session expiration handling
- [ ] Persist login across refreshes

---

# Security

## API

- [ ] Verify authorization on every endpoint
- [ ] Rate limit authentication endpoints
- [ ] Rate limit messaging endpoints
- [ ] Rate limit reporting endpoints

## File Uploads

- [x] File size validation
- [x] Allowed image types
- [ ] Strip image metadata
- [ ] Cloudinary image optimization
- [ ] Validate uploaded file is an actual image

---

# User Experience

## Loading States

- [ ] Skeleton cards
- [ ] Skeleton property page
- [ ] Skeleton messaging page

## Error Handling

- [ ] Toast notifications
- [ ] Friendly error messages
- [ ] Retry failed requests

## Empty States

- [ ] No listings
- [ ] No favorites
- [ ] No conversations
- [ ] No reports

---

# Messaging

- [x] Conversations
- [x] Latest message preview
- [x] Ordering by latest activity
- [x] Unread count
- [x] Polling every 7 seconds

Future Improvements

- [ ] Push notifications
- [ ] Read receipts
- [ ] Typing indicator
- [ ] Image attachments

---

# Listings

## Completed

- [x] Multiple images
- [x] Cover image
- [x] Image gallery
- [x] Availability confirmation
- [x] Report listing
- [x] Admin approval
- [x] Admin rejection
- [x] Admin suspension

## Improvements

- [ ] Auto-expire stale listings
- [ ] Duplicate listing detection
- [ ] Listing view count
- [ ] Listing analytics

---

# Performance

## Images

- [ ] Cloudinary transformations
- [ ] Lazy loading
- [ ] Responsive image sizes

## API

- [ ] Pagination
- [ ] Response caching where appropriate
- [ ] Optimize database queries

---

# Testing

## Backend

- [ ] Unit tests
- [ ] Endpoint tests
- [ ] Authorization tests

## Frontend

- [ ] Component tests
- [ ] Navigation tests
- [ ] Form validation tests

## Manual Testing

- [ ] Tenant workflow
- [ ] Landlord workflow
- [ ] Admin workflow
- [ ] Messaging workflow
- [ ] Reporting workflow

---

# Deployment

## Backend

- [ ] Deploy FastAPI
- [ ] Configure production CORS
- [ ] HTTPS enabled
- [ ] Environment variables configured

## Frontend

- [ ] Deploy Next.js
- [ ] Production environment variables
- [ ] Production API URL

## Database

- [ ] Managed PostgreSQL
- [ ] Automatic backups

## Media

- [ ] Cloudinary production configuration

---

# Monitoring

- [ ] Error logging
- [ ] API request logging
- [ ] Uptime monitoring

---

# Closed Beta

## Recruit Testers

### Landlords

- [ ] 5–10 landlords

### Tenants

- [ ] 15–20 tenants

---

## Observe

- [ ] Watch users create listings
- [ ] Watch tenants search
- [ ] Watch messaging flow
- [ ] Watch report workflow

---

## Collect Feedback

- [ ] Bugs
- [ ] UX improvements
- [ ] Missing features
- [ ] Performance issues

---

# Public Launch Checklist

- [ ] Authentication hardened
- [ ] Security reviewed
- [ ] Performance optimized
- [ ] Production deployed
- [ ] Closed beta completed
- [ ] Major bugs fixed
- [ ] Documentation updated

---

# Beta Success Criteria

NyumbaLink is considered ready for public launch when:

- Authentication is secure.
- All core user flows work without major bugs.
- Property browsing is fast and responsive.
- Messaging is reliable.
- Reporting and moderation work correctly.
- Images load quickly.
- Deployment is stable.
- Closed beta users can successfully complete the full rental journey.
- No critical or high-severity issues remain.

---

**Current Progress:** 🟢 MVP Complete → Beta Readiness Phase