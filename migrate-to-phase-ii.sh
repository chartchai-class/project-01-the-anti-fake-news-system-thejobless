#!/bin/bash
set -e

# Migration Script: Clone Project-01 to Phase-II Repository
# This script migrates all content, commits, and tags from project-01 to phase-ii
# while preserving the existing README from phase-ii

echo "=========================================="
echo "Migration: Project-01 -> Phase-II"
echo "=========================================="

# Configuration
PHASE_II_REPO="https://github.com/chartchai-class/the-social-anti-fake-news-system-phase-ii-thejobless.git"
PHASE_II_REMOTE="phase-ii"
BACKUP_README="/tmp/phase-ii-readme-backup.md"
MIGRATION_BRANCH="migration-from-project-01"

# Step 1: Add phase-ii repository as a remote
echo ""
echo "[Step 1/7] Adding phase-ii repository as remote..."
if git remote | grep -q "^${PHASE_II_REMOTE}$"; then
    echo "Remote '${PHASE_II_REMOTE}' already exists, updating URL..."
    git remote set-url ${PHASE_II_REMOTE} ${PHASE_II_REPO}
else
    git remote add ${PHASE_II_REMOTE} ${PHASE_II_REPO}
fi
echo "✓ Remote added successfully"

# Step 2: Fetch the phase-ii repository
echo ""
echo "[Step 2/7] Fetching phase-ii repository..."
if git fetch ${PHASE_II_REMOTE} 2>&1 | tee /tmp/fetch-output.txt | grep -v "Username\|Password"; then
    echo "✓ Phase-ii repository fetched"
    FETCH_SUCCESS=true
else
    if grep -q "Authentication failed" /tmp/fetch-output.txt 2>/dev/null; then
        echo "⚠ Authentication required - will proceed without fetching phase-ii"
        echo "  You can manually provide the phase-ii README later if needed"
        FETCH_SUCCESS=false
    else
        echo "✓ Phase-ii repository fetched (empty repository)"
        FETCH_SUCCESS=true
    fi
fi

# Step 3: Check if phase-ii has a main/master branch and backup its README
echo ""
echo "[Step 3/7] Backing up README from phase-ii repository..."
PHASE_II_DEFAULT_BRANCH=""

if [ "${FETCH_SUCCESS}" = "true" ]; then
    if git ls-remote --heads ${PHASE_II_REMOTE} 2>/dev/null | grep -q "refs/heads/main"; then
        PHASE_II_DEFAULT_BRANCH="main"
    elif git ls-remote --heads ${PHASE_II_REMOTE} 2>/dev/null | grep -q "refs/heads/master"; then
        PHASE_II_DEFAULT_BRANCH="master"
    fi

    if [ -n "${PHASE_II_DEFAULT_BRANCH}" ]; then
        echo "Phase-ii default branch: ${PHASE_II_DEFAULT_BRANCH}"
        if git show ${PHASE_II_REMOTE}/${PHASE_II_DEFAULT_BRANCH}:README.md > ${BACKUP_README} 2>/dev/null; then
            echo "✓ README backed up from phase-ii/${PHASE_II_DEFAULT_BRANCH}"
        else
            echo "⚠ No README found in phase-ii/${PHASE_II_DEFAULT_BRANCH} - will use project-01 README"
            BACKUP_README=""
        fi
    else
        echo "⚠ Phase-ii repository appears to be empty - no backup needed"
        BACKUP_README=""
    fi
else
    echo "⚠ Could not fetch phase-ii repository - skipping README backup"
    echo "  If phase-ii has a README you want to preserve, you can:"
    echo "  1. Manually download it from GitHub"
    echo "  2. Place it at: ${BACKUP_README}"
    echo "  3. Re-run this script"
    BACKUP_README=""
fi

# Step 4: Create a migration branch from current state
echo ""
echo "[Step 4/7] Creating migration branch..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git checkout -b ${MIGRATION_BRANCH} 2>/dev/null || git checkout ${MIGRATION_BRANCH}
echo "✓ Created/switched to branch: ${MIGRATION_BRANCH}"

# Step 5: Restore phase-ii README if it was backed up
if [ -n "${BACKUP_README}" ] && [ -f "${BACKUP_README}" ]; then
    echo ""
    echo "[Step 5/7] Restoring phase-ii README..."
    cp ${BACKUP_README} README.md
    git add README.md
    if git diff --cached --quiet; then
        echo "✓ README is already identical to phase-ii version"
    else
        git commit -m "Preserve README from phase-ii repository

This commit preserves the README from the phase-ii repository while
migrating all other content from project-01."
        echo "✓ Phase-ii README preserved in migration branch"
    fi
else
    echo ""
    echo "[Step 5/7] No README to restore, using project-01 README"
fi

# Step 6: Display summary and prepare for push
echo ""
echo "[Step 6/7] Migration summary:"
echo "  - Total commits to migrate: $(git rev-list --count ${MIGRATION_BRANCH})"
echo "  - Tags to migrate: $(git tag -l | wc -l)"
git tag -l | sed 's/^/    * /'
echo "  - README status: $([ -n "${BACKUP_README}" ] && echo "Phase-ii README preserved" || echo "Using project-01 README")"

# Step 7: Instructions for pushing
echo ""
echo "[Step 7/7] Ready to push to phase-ii repository"
echo ""
echo "=========================================="
echo "PUSH COMMANDS:"
echo "=========================================="
echo ""
echo "To complete the migration, run the following commands:"
echo ""
echo "# Push the migration branch to phase-ii repository"
echo "git push ${PHASE_II_REMOTE} ${MIGRATION_BRANCH}:main --force"
echo ""
echo "# Push all tags to phase-ii repository"
echo "git push ${PHASE_II_REMOTE} --tags"
echo ""
echo "=========================================="
echo "ALTERNATIVE: Push all branches and tags"
echo "=========================================="
echo ""
echo "# Push all branches"
echo "git push ${PHASE_II_REMOTE} --all --force"
echo ""
echo "# Push all tags"
echo "git push ${PHASE_II_REMOTE} --tags"
echo ""
echo "=========================================="
echo "NOTE: This script cannot push automatically because"
echo "it requires authentication credentials for the"
echo "phase-ii repository. Please run the commands above"
echo "manually with appropriate credentials."
echo "=========================================="
echo ""
echo "Migration preparation completed successfully!"
