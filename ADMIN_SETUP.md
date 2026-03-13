# Admin System Setup Guide

## Creating an Admin User

Since Supabase Auth requires email confirmation by default, you need to create an admin user through the Supabase dashboard or disable email confirmation.

### Method 1: Via Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard/project/ukzpuykdgmysgtotdblo
2. Navigate to **Authentication** > **Users**
3. Click **Add User**
4. Enter:
   - Email: `admin@stmevents.com`
   - Password: `Admin123!STM`
   - Auto Confirm User: **Yes**
5. Click **Create User**
6. Copy the user's UUID from the users table
7. Run this SQL in the SQL Editor:

```sql
INSERT INTO admin_users (user_id, email)
VALUES ('PASTE_USER_UUID_HERE', 'admin@stmevents.com');
```

### Method 2: Disable Email Confirmation (Development Only)

1. Go to **Authentication** > **Settings**
2. Scroll to **Email Auth**
3. Disable **Enable email confirmations**
4. Now you can sign up directly at: http://localhost:3000/admin/login

### Method 3: Via Playwright Test

The admin test suite (`tests/admin.spec.ts`) automatically creates a test admin user:
- Email: `admin@stmevents.com`
- Password: `TestAdmin123!`

Run: `npm test tests/admin.spec.ts`

## Admin Features

### Dashboard (`/admin/dashboard`)
- Overview statistics for all content types
- Quick navigation to management pages
- User email display
- Logout functionality

### Events Management (`/admin/events`)
- **List View**: Table showing all events with status, date, location
- **Create**: Form to add new events with:
  - English and German titles/descriptions
  - Auto-generated slugs
  - Event date, location, venue
  - Lineup (comma-separated DJs)
  - Eventbrite URL integration
  - Publish toggle
- **Edit**: Modify existing events
- **Delete**: Remove events (with confirmation)

### Equipment Management (`/admin/equipment`)
- **List View**: Table with equipment name, category, price, availability
- **Create**: Form to add equipment with:
  - English and German names/descriptions
  - Category selection (Sound, DJ, Lighting)
  - Price per day
  - Availability toggle
- **Edit**: Update equipment details
- **Delete**: Remove equipment

### Gallery Management (`/admin/gallery`)
- **Grid View**: Visual display of all media items
- **Create**: Upload and manage:
  - Images
  - Videos
  - Aftermovies
  - DJ sets
  - Titles and descriptions in both languages
  - Publish status

### DJs Management (`/admin/djs`)
- **List View**: Table of resident DJs
- **Create**: Add DJ profiles with:
  - Name
  - Bio (English and German)
  - Social media links (Instagram, SoundCloud, etc.)
  - Active status
- **Edit**: Update DJ information
- **Delete**: Remove DJ profiles

## Database Schema

All admin operations use Row Level Security (RLS):

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies
- **Public**: Can view published content only
- **Admins**: Full CRUD access to all tables
- **Helper Function**: `is_admin(user_id)` checks admin status

## Testing

### Run All Admin Tests
```bash
npm test tests/admin.spec.ts
```

### Test Coverage
- ✅ Admin authentication (login, logout, unauthorized access)
- ✅ Dashboard display and navigation
- ✅ Events CRUD operations
- ✅ Form validation
- ✅ Database integration
- ✅ RLS policy verification

### Manual Testing Checklist

1. **Authentication**
   - [ ] Login with valid credentials
   - [ ] Login with invalid credentials shows error
   - [ ] Unauthorized users redirected to login
   - [ ] Logout works correctly

2. **Events Management**
   - [ ] Create new event
   - [ ] View events list
   - [ ] Edit existing event
   - [ ] Delete event
   - [ ] Publish/unpublish toggle
   - [ ] Slug auto-generation

3. **Equipment Management**
   - [ ] Add new equipment
   - [ ] Update equipment details
   - [ ] Toggle availability
   - [ ] Delete equipment

4. **Gallery Management**
   - [ ] Upload media
   - [ ] View gallery grid
   - [ ] Edit media details
   - [ ] Delete media

5. **DJs Management**
   - [ ] Add new DJ
   - [ ] Update DJ profile
   - [ ] Toggle active status
   - [ ] Delete DJ

## Security Notes

- All admin routes check authentication
- RLS policies prevent unauthorized database access
- Passwords are hashed by Supabase Auth
- Admin status stored in separate table
- Session management handled by Supabase

## Troubleshooting

### "Unauthorized: Not an admin user"
- Ensure user exists in `admin_users` table
- Verify `user_id` matches auth.users UUID

### "Invalid credentials"
- Check email and password
- Verify user exists in Supabase Auth
- Check if email confirmation is required

### Database errors
- Verify RLS policies are enabled
- Check admin_users table exists
- Ensure is_admin() function is created

## Production Deployment

Before deploying to production:

1. **Enable email confirmation** in Supabase Auth settings
2. **Set up email templates** for password reset
3. **Configure allowed redirect URLs** in Supabase
4. **Add rate limiting** to prevent brute force attacks
5. **Set up monitoring** for failed login attempts
6. **Backup admin_users table** regularly
7. **Use strong passwords** for all admin accounts
8. **Enable 2FA** if available in Supabase

## API Endpoints

The admin system uses Supabase client-side SDK. No custom API routes needed.

All operations go through:
- `supabase.auth.*` for authentication
- `supabase.from('table_name').*` for CRUD operations

## Future Enhancements

- [ ] Bulk operations (delete multiple items)
- [ ] Image upload to Supabase Storage
- [ ] Rich text editor for descriptions
- [ ] Event duplication feature
- [ ] Export data to CSV
- [ ] Activity logs
- [ ] Multiple admin roles (super admin, editor, viewer)
- [ ] Email notifications for new submissions
