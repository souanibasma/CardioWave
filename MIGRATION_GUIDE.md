# MIGRATION GUIDE: Email Verification, Google OAuth & Chatbot Fix

This guide details all modifications required to port the Email Verification, Google OAuth features, and Chatbot fixes into the NEW version of the project.

## 1. Environment Variables (`.env`)

You need to add the following variables to the backend `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Email (SMTP)
SMTP_EMAIL=your_smtp_email_here
SMTP_PASSWORD=your_smtp_app_password_here
FRONTEND_URL=http://localhost:5173
```

Also, add `VITE_GOOGLE_CLIENT_ID` to the frontend `.env` file (if you have one) or provide it via your hosting environment.

## 2. New Packages Installed

### Backend (`web/backend`)
- `google-auth-library` (`npm install google-auth-library`)
- `nodemailer` (`npm install nodemailer`)
- `@types/nodemailer` (`npm install -D @types/nodemailer`)

### Frontend (`web/front`)
- `@react-oauth/google` (`npm install @react-oauth/google`)

## 3. Database Modifications (`User.ts`)
Add the following fields to the `User` schema (`web/backend/src/models/User.ts`):
- `isEmailVerified: { type: Boolean, default: false }`
- `verificationToken: { type: String }`
- `verificationExpires: { type: Date }`
- `googleId: { type: String, unique: true, sparse: true }`

## 4. New Files Created

- `web/backend/src/services/emailService.ts`: Contains `sendVerificationEmail` using Nodemailer.
- `web/front/src/app/pages/VerifyEmail.tsx`: UI for the `/verify-email` route. (Now automatically logs the user in).
- `web/front/src/app/pages/CompleteProfile.tsx`: UI for doctors signing up via Google to complete their profile (specialty, license).

## 5. Modified Files & Required Changes

### Backend

1. **`web/backend/src/controllers/authController.ts`**
   - **Imports**: Added `crypto`, `sendVerificationEmail`, `OAuth2Client` from `google-auth-library`.
   - **`registerUser`**: Generate `verificationToken` via `crypto.randomBytes(20).toString("hex")`, set `verificationExpires` (24h). Call `sendVerificationEmail`.
   - **`loginUser`**: Add check `if (!user.isEmailVerified)` -> return 403 with `{ requiresVerification: true }`.
   - **New Endpoints**: Added `verifyEmail`, `resendVerificationEmail`, `completeProfile`, and `googleAuth`.

2. **`web/backend/src/routes/authRoutes.ts`**
   - Added routes:
     - `POST /verify-email` -> `verifyEmail`
     - `POST /resend-verification` -> `resendVerificationEmail`
     - `POST /google` -> `googleAuth`
     - `POST /complete-profile` -> `completeProfile`

3. **`web/backend/src/controllers/chatbotController.ts`**
   - **Chatbot Fix**: Reverted `askChatbot` schema to send `{ question, history }` to `http://127.0.0.1:8002/chat` and return `{ answer: response.data.answer }` to match `chatbot_general/api.py`. This fixes the frontend crash.

### Frontend

1. **`web/front/src/services/api.ts`**
   - Added `verifyEmailToken`, `resendVerificationEmail`, and `completeDoctorProfile`.

2. **`web/front/src/app/context/AuthContext.tsx`**
   - Added `googleLogin(idToken, role)` to `AuthContextType` and implemented it in `AuthProvider`.
   - Updated `login` catch block to handle `err?.response?.data?.requiresVerification` and throw an object `{ requiresVerification: true, message: ... }`.

3. **`web/front/src/app/App.tsx`**
   - Wrapped the application in `<GoogleOAuthProvider clientId={...}>`.

4. **`web/front/src/app/routes.tsx`**
   - Imported and added routes:
     - `/verify-email` -> `<VerifyEmail />`
     - `/complete-profile` -> `<ProtectedRoute allowedRoles={['medecin']}><CompleteProfile /></ProtectedRoute>`

5. **`web/front/src/app/pages/Connexion.tsx`**
   - Imported `GoogleLogin` and handled `requiresVerification`.
   - Added `<GoogleLogin>` component. Redirect logic handles `requiresProfileCompletion`.

6. **`web/front/src/app/pages/InscriptionPatient.tsx`** & **`web/front/src/app/pages/InscriptionMedecin.tsx`**
   - Added `<GoogleLogin>` configured to pass roles.
   - Added `showSuccess` state to show a "Verification Email Sent" alert before redirecting to login.

## 6. Verification Steps
- Normal signup -> email verification -> login (working with auto-login).
- Google doctor signup -> profile completion -> pending/admin validation (working).
- ChatbotIA -> correctly receives valid responses from the backend without 500 errors.
