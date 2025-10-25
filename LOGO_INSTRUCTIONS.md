# Logo Setup Instructions

## Issue
The logo is not loading when the website is deployed because the logo file is missing from the public folder.

## Solution

### Step 1: Add Your Logo File
You need to place your logo file in the correct location:

1. Make sure you have your logo file named `IVY-03.png`
2. Place it in: `/public/IMGs/IVY-03.png`

The folder structure should look like this:
```
/Users/mac/Documents/GitHub/ivy-eg/
├── public/
│   └── IMGs/
│       └── IVY-03.png    ← Your logo file goes here
├── src/
└── ...
```

### Step 2: Logo Requirements
- **File name:** `IVY-03.png`
- **Format:** PNG with transparent background (recommended)
- **Color:** White logo (the CSS applies a filter to make it white)
- **Recommended size:** At least 200px width for best quality on all screens

### Step 3: Deploy Again
After adding the logo file:
1. Commit the change: `git add public/IMGs/IVY-03.png`
2. Commit: `git commit -m "Add IVY logo"`
3. Push: `git push`
4. Your deployment will automatically update (if using Netlify/Vercel)

## Where the Logo Appears
The logo is used in 3 places:
1. **Header** (desktop and mobile)
2. **Home page hero section**
3. **Footer**

## If You Want to Use a Different Logo File
If your logo has a different name or format:
1. Place your logo in `/public/IMGs/`
2. Update these files:
   - `src/components/Header.jsx` (line 65 and 93)
   - `src/pages/Home.jsx` (line 95)
   - `src/components/Footer.jsx` (line 14)
3. Change `IVY-03.png` to your logo filename

## Technical Note - Vite Public Assets
This project uses Vite, which serves files from the `public` folder directly at the root path.
- Files in `/public/IMGs/` are accessible at `/IMGs/`
- No special environment variables needed
- The logo paths work the same in development and production
