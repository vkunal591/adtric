# Manthan School Website

A full-stack school website built with:

- Next.js and React
- Express and MongoDB
- JWT authentication
- bcrypt password hashing
- Multer image uploads
- Webhook.site CRM integration

## Completion Score

**11 / 11 requirements completed**

## What Is Included

### Public website

The public website includes two main sections from the design:

1. News & Events
2. Admission Enquiry

The site also includes:

- Shared header and footer
- Responsive mobile, tablet, and desktop layouts
- FAQ accordion
- Navy, pink, cyan, and cream visual theme
- Inline form validation

### News & Events

The homepage displays the latest three published items.

The full listing page is available at:

```text
/news-events
```

The listing page supports:

- Published items only
- Newest-first ordering
- Pagination
- Search
- Category filtering
- News, Event, and Achievement categories

Each item opens at:

```text
/news-events/[slug]
```

Every detail page has its own:

- Page title
- Meta description
- Open Graph title and description
- Published date
- Image and content

News data for these pages is loaded on the server from the API.

### Admission Enquiry

The enquiry form includes:

- Parent name
- Student name
- Class applying for
- Mobile number
- Optional email
- Optional message

The form:

- Submits without reloading the page
- Shows errors under the related fields
- Shows server validation errors
- Shows a success message after submission
- Validates Indian mobile numbers beginning with 6, 7, 8, or 9

## API Features

### Public News & Events API

```text
GET /api/news-events?page=1&limit=10
GET /api/news-events/:slug
```

The API returns only published items and sorts them newest first.

Optional filters:

```text
GET /api/news-events?search=sports
GET /api/news-events?category=Event
GET /api/news-events?search=sports&category=Event
```

### Enquiry API

```text
POST /api/enquiries
```

Server validation returns JSON errors with the correct status codes.

The server rejects invalid mobile numbers and prevents the same mobile number from submitting the same class enquiry within 24 hours.

Duplicate enquiries return:

```json
{
  "success": false,
  "message": "We have already received your enquiry."
}
```

with status `409 Conflict`.

### CRM Integration

After an enquiry is saved, the server sends it as JSON to `CRM_WEBHOOK_URL`.

CRM behavior:

- Request timeout: 5 seconds
- Successful response: `Sent`
- Failed response, timeout, or network error: `Failed`
- CRM failure does not fail the enquiry form submission
- CRM status and response are saved on the enquiry record

## Admin Panel

Admin pages are protected by JWT authentication and an HttpOnly cookie.

### Admin pages

```text
/admin/login
/admin
/admin/news-events
/admin/enquiries
```

### Admin login

- Passwords are hashed with bcrypt
- Login returns a signed JWT
- Admin routes require a valid JWT
- The admin role is checked against the database
- The seed script creates or updates the admin user

Run the seed script with:

```powershell
cd api
npm run seed:admin
```

### News & Events management

The admin can:

- List items
- Add items
- Edit items
- Delete items
- Upload local images
- Publish or save drafts
- Use News, Event, or Achievement categories

Image rules:

- JPG, JPEG, PNG, or WebP
- Maximum 2 MB
- Stored locally in `api/uploads`
- Served through `/uploads/<filename>`

Slugs are generated from titles and made unique automatically.

### Enquiry management

The admin can:

- View enquiries newest first
- Use pagination
- Filter by New, Contacted, or Closed
- Change enquiry status
- View CRM status
- View CRM response and sent time

## Main Routes

### Website routes

```text
/                         Homepage
/news-events              Published News & Events listing
/news-events/[slug]       Single published item
/admin/login              Admin login
/admin                    Admin dashboard
/admin/news-events        News & Events management
/admin/enquiries          Enquiry management
```

### API routes

```text
GET    /api/health
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/news-events
GET    /api/news-events/:slug
POST   /api/enquiries
GET    /api/admin/dashboard
GET    /api/admin/news
POST   /api/admin/news
PATCH  /api/admin/news/:id
DELETE /api/admin/news/:id
GET    /api/admin/enquiries
PATCH  /api/admin/enquiries/:id/status
```

## Local Setup

### 1. Start MongoDB

Make sure MongoDB is running locally or provide a remote MongoDB connection string.

### 2. Start the API

```powershell
cd "d:\Development\job\TASK_ Full Stack Developer\api"
npm install
npm run seed:admin
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

### 3. Start the website

```powershell
cd "d:\Development\job\TASK_ Full Stack Developer\manthan-school"
npm install
npm run dev
```

The website runs at:

```text
http://localhost:3000
```

## Environment Variables

Create `api/.env` with:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_website
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
CRM_WEBHOOK_URL=https://webhook.site/your-token
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@school.com
ADMIN_PASSWORD=ChangeThisPassword123!
```

The supplied Webhook.site URL is configured in the local `api/.env` file.

## Verification

Verified during implementation:

- Next.js production build passes
- Backend syntax checks pass
- Frontend diagnostics report no errors
- Uploaded images return `200 image/jpeg`
- CRM success, failure, missing URL, and timeout paths work
- CRM timeout is approximately 5 seconds
- Valid Indian mobile numbers pass validation
- Invalid mobile prefixes and lengths are rejected
- Duplicate enquiries return `409 Conflict`
- Admin seed script creates the admin account successfully

The only remaining build message is a non-blocking Next.js warning that `middleware.ts` will eventually be renamed to `proxy.ts`.
