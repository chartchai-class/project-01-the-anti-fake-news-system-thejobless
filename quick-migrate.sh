#!/bin/bash
set -e

# Quick Migration Script: Project-01 to Phase-II
# This script creates a migration-ready state that can be pushed to phase-ii

echo "========================================"
echo "Quick Migration Setup"
echo "========================================"

PHASE_II_REPO="https://github.com/chartchai-class/the-social-anti-fake-news-system-phase-ii-thejobless.git"
PHASE_II_REMOTE="phase-ii"
MIGRATION_BRANCH="migration-from-project-01"

# Add remote
echo "[1/3] Adding phase-ii remote..."
git remote remove ${PHASE_II_REMOTE} 2>/dev/null || true
git remote add ${PHASE_II_REMOTE} ${PHASE_II_REPO}
echo "✓ Remote added"

# Create migration branch
echo "[2/3] Creating migration branch..."
git checkout -b ${MIGRATION_BRANCH} 2>/dev/null || git checkout ${MIGRATION_BRANCH}
echo "✓ Migration branch ready"

# Show status
echo "[3/3] Status:"
echo "  - Commits: $(git rev-list --count ${MIGRATION_BRANCH})"
echo "  - Tags: $(git tag -l | wc -l)"
echo "  - Branch: ${MIGRATION_BRANCH}"

echo ""
echo "========================================"
echo "NEXT STEPS:"
echo "========================================"
echo ""
echo "1. If phase-ii has a README you want to preserve:"
echo "   - Download it manually from GitHub"
echo "   - Replace README.md with it"
echo "   - Commit: git add README.md && git commit -m 'Preserve phase-ii README'"
echo ""
echo "2. Push to phase-ii:"
echo "   git push ${PHASE_II_REMOTE} ${MIGRATION_BRANCH}:main --force"
echo "   git push ${PHASE_II_REMOTE} --tags"
echo ""
echo "Done!"
