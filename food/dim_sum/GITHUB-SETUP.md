# GitHub Setup for Transparent Collaboration

*How to set up the repository so friends can edit directly without pull requests*

## Repository Settings

### 1. Make Repository Public
- Go to Settings → General
- Scroll to "Danger Zone"
- Click "Change repository visibility"
- Select "Public"

### 2. Enable Direct Commits to Main Branch
- Go to Settings → Branches
- If there are branch protection rules, delete them
- This allows direct commits without pull requests

### 3. Add Collaborators (Optional but Recommended)
- Go to Settings → Collaborators
- Click "Add people"
- Add friends' GitHub usernames
- They'll get email invitations

### 4. Enable Issues (For Questions)
- Go to Settings → General
- Check "Issues" under Features
- Friends can ask questions here instead of in files

## Alternative: Use GitHub Codespaces (Advanced)

If you want even easier editing:
1. Enable Codespaces in repository settings
2. Friends can click "Code" → "Codespaces" → "Create codespace"
3. They get a full VS Code editor in the browser
4. Changes auto-commit when they save

## For Your Friends

Share this link format:
```
https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/tree/main/food/dim_sum/recipes
```

Tell them:
1. "Click any .md file to view it"
2. "Click the pencil icon to edit"
3. "Scroll down and click 'Commit changes' when done"
4. "That's it - no pull requests needed!"

## Security Note

This setup allows anyone with the link to edit files. If you're concerned about security:
- Keep the repository private
- Add only trusted friends as collaborators
- They'll need GitHub accounts but can still edit directly

## Backup Strategy

Since files can be edited directly:
- GitHub automatically keeps version history
- You can always revert changes if needed
- Consider making a backup branch occasionally

## Troubleshooting

**Friends can't edit?**
- Make sure repository is public OR they're added as collaborators
- They need to be logged into GitHub
- Check that branch protection rules are disabled

**Want to review changes?**
- Enable email notifications in your GitHub settings
- You'll get emails when files are edited
- Check the "Commits" tab to see all changes
