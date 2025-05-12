#!/bin/bash

# This script initializes a GitHub repository for the coaching institute management system

# Initialize Git repository
git init

# Add all files to the repository
git add .

# Create initial commit
git commit -m "Initial commit: Coaching Institute Management System"

# Create a .gitignore file
cat > .gitignore << EOF
# Dependencies
node_modules/
.pnp/
.pnp.js

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
/server/dist/
/client/build/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
.DS_Store
Thumbs.db
EOF

# Add .gitignore file
git add .gitignore
git commit -m "Add .gitignore file"

# Instructions for connecting to GitHub
echo "Repository initialized locally."
echo ""
echo "To connect to GitHub, create a new repository on GitHub (without README, license, or .gitignore),"
echo "then run the following commands:"
echo ""
echo "  git remote add origin https://github.com/yourusername/coaching-institute-app.git"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""
echo "Replace 'yourusername' with your actual GitHub username." 