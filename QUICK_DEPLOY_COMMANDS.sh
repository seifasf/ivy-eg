#!/bin/bash

# IVY Website - Quick Deploy Script
# This script will add all changes, commit, and push to deploy

echo "🚀 IVY Website - Quick Deploy"
echo "=============================="
echo ""

# Navigate to project directory
cd /Users/mac/Documents/GitHub/ivy-eg

echo "📦 Adding logo and all changes to git..."
git add public/IMGs/IVY-03.png
git add .

echo ""
echo "💾 Committing changes..."
git commit -m "Add IVY logo and latest updates"

echo ""
echo "🌐 Pushing to repository..."
git push

echo ""
echo "✅ Done! Your website will be deployed in 1-2 minutes."
echo "🔍 Check your deployment platform (Netlify/Vercel) for build status."
echo ""
echo "Remember to clear your browser cache to see the changes:"
echo "  • Mac: Cmd + Shift + R"
echo "  • Windows: Ctrl + Shift + R"

