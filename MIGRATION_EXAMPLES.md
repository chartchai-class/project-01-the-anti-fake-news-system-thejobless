# Migration Usage Examples

This document provides practical examples of how to use the migration tools.

## Example 1: Basic Migration (Phase-II is Empty)

If the phase-ii repository is empty or you don't need to preserve its README:

```bash
# Step 1: Run the migration script
./migrate-to-phase-ii.sh

# Step 2: Push to phase-ii (you'll need authentication)
git push phase-ii migration-from-project-01:main --force
git push phase-ii --tags
```

**Result:**
- All 42 commits from project-01 are now in phase-ii
- Both tags (Final-version, Version-1.0) are in phase-ii
- Project-01 README is used

## Example 2: Preserve Phase-II README

If phase-ii has a README you want to keep:

### Option A: Automatic (if you have phase-ii access)

```bash
# The script will automatically backup and restore the README
./migrate-to-phase-ii.sh

# Push to phase-ii
git push phase-ii migration-from-project-01:main --force
git push phase-ii --tags
```

### Option B: Manual (if you don't have phase-ii access yet)

```bash
# Step 1: Download phase-ii README manually
# Go to: https://github.com/chartchai-class/the-social-anti-fake-news-system-phase-ii-thejobless
# Download the README.md file and save it as /tmp/phase-ii-readme-backup.md

# Step 2: Run the migration script
./migrate-to-phase-ii.sh

# Step 3: Restore the phase-ii README
cp /tmp/phase-ii-readme-backup.md README.md
git add README.md
git commit -m "Preserve README from phase-ii repository"

# Step 4: Push to phase-ii
git push phase-ii migration-from-project-01:main --force
git push phase-ii --tags
```

## Example 3: Quick Migration Setup

For a simpler, faster setup:

```bash
# Run quick setup
./quick-migrate.sh

# If you want to preserve phase-ii README, do it now:
# 1. Download README from phase-ii
# 2. Replace README.md
# 3. git add README.md && git commit -m "Preserve phase-ii README"

# Push to phase-ii
git push phase-ii migration-from-project-01:main --force
git push phase-ii --tags
```

## Example 4: Using Git Credentials Helper

To avoid entering credentials multiple times:

```bash
# Configure credentials caching
git config --global credential.helper cache
git config --global credential.helper 'cache --timeout=3600'

# Or use a Personal Access Token
git remote set-url phase-ii https://YOUR_TOKEN@github.com/chartchai-class/the-social-anti-fake-news-system-phase-ii-thejobless.git

# Then run migration
./migrate-to-phase-ii.sh
git push phase-ii migration-from-project-01:main --force
git push phase-ii --tags
```

## Example 5: Verify Migration Success

After pushing to phase-ii:

```bash
# Clone phase-ii in a temp directory
cd /tmp
git clone https://github.com/chartchai-class/the-social-anti-fake-news-system-phase-ii-thejobless.git verify-migration
cd verify-migration

# Check commits
echo "Commit count: $(git rev-list --count HEAD)"
# Should show: Commit count: 42

# Check tags
echo "Tags:"
git tag -l
# Should show:
# Final-version
# Version-1.0

# Check files
ls -la
# Should show all project-01 files including thejobless/

# Check README
head -5 README.md
# Should show either project-01 or phase-ii README (depending on what you chose)

# Check a specific tagged commit
git show Final-version --stat
```

## Example 6: Troubleshooting Authentication

If you get authentication errors:

```bash
# Option 1: Use Personal Access Token (PAT)
# 1. Go to https://github.com/settings/tokens
# 2. Generate new token with 'repo' permissions
# 3. Use it as password when prompted

# Option 2: Use SSH instead of HTTPS
git remote set-url phase-ii git@github.com:chartchai-class/the-social-anti-fake-news-system-phase-ii-thejobless.git

# Option 3: Use GitHub CLI
gh auth login
# Then run migration as normal
```

## Example 7: Rollback Migration

If something goes wrong after pushing:

```bash
# If phase-ii had previous content, you can rollback
# (This requires knowing the previous commit SHA)

# Connect to phase-ii
git clone https://github.com/chartchai-class/the-social-anti-fake-news-system-phase-ii-thejobless.git
cd the-social-anti-fake-news-system-phase-ii-thejobless

# View reflog to find previous commit
git reflog

# Reset to previous state (replace PREV_SHA with actual SHA)
git reset --hard PREV_SHA
git push origin main --force
```

## Example 8: Incremental Push (Safer)

If you're worried about force-pushing:

```bash
# Instead of force push, create a new branch in phase-ii
git push phase-ii migration-from-project-01:project-01-migration

# Then in phase-ii repository, merge it:
# git checkout main
# git merge project-01-migration
# git push origin main
```

## Common Scenarios

### Scenario: Phase-II is completely empty
**Solution:** Use Example 1 (Basic Migration)

### Scenario: Phase-II has only a README
**Solution:** Use Example 2 (Preserve Phase-II README)

### Scenario: Phase-II has content you want to keep
**Solution:** Don't use force push. Instead:
1. Clone phase-ii locally
2. Add project-01 as a remote
3. Merge project-01 content into phase-ii
4. Resolve any conflicts
5. Push to phase-ii

### Scenario: Multiple people need to migrate
**Solution:** 
1. One person runs the migration
2. Others can then clone the phase-ii repository directly
3. All history and tags are preserved

## Summary

The most common workflow is:

```bash
# 1. Run migration
./migrate-to-phase-ii.sh

# 2. Optionally preserve phase-ii README
# (if needed and you have the file)
cp /tmp/phase-ii-readme-backup.md README.md
git add README.md
git commit -m "Preserve phase-ii README"

# 3. Push everything
git push phase-ii migration-from-project-01:main --force
git push phase-ii --tags

# 4. Verify
git ls-remote --tags phase-ii
git ls-remote --heads phase-ii
```

That's it! Your project-01 is now in phase-ii with all history preserved.
