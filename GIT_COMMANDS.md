# Git Commands Reference

Quick reference guide for common Git operations.

---

## Initial Setup

```bash
# Configure your identity (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Check current configuration
git config --list
```

---

## Cloning & Initializing

```bash
# Clone an existing repository
git clone https://github.com/username/repository.git

# Clone into a specific folder
git clone https://github.com/username/repository.git my-folder

# Initialize a new Git repository
git init
```

---

## Basic Workflow

```bash
# Check status of your working directory
git status

# Add files to staging area
git add filename.txt              # Add specific file
git add .                         # Add all changes
git add *.js                      # Add all JS files
git add src/                      # Add entire directory

# Commit staged changes
git commit -m "Your commit message"

# Add and commit in one step (tracked files only)
git commit -am "Your commit message"

# Amend the last commit (change message or add forgotten files)
git add forgotten-file.txt
git commit --amend -m "Updated commit message"
```

---

## Viewing History

```bash
# View commit history
git log

# View compact history
git log --oneline

# View history with graph
git log --oneline --graph --all

# View changes in last N commits
git log -3

# View changes for a specific file
git log -- filename.txt

# Show changes in a commit
git show commit-hash
```

---

## Branches

### Creating & Switching

```bash
# List all branches
git branch                        # Local branches
git branch -a                     # All branches (local + remote)

# Create a new branch
git branch feature-branch

# Switch to a branch
git checkout feature-branch

# Create and switch to a new branch in one command
git checkout -b feature-branch

# Switch branches (modern syntax)
git switch feature-branch
git switch -c new-branch          # Create and switch
```

### Deleting Branches

```bash
# Delete a local branch (safe - prevents deletion if unmerged)
git branch -d branch-name

# Force delete a local branch
git branch -D branch-name

# Delete a remote branch
git push origin --delete branch-name
```

---

## Pushing & Pulling

### Push

```bash
# Push to remote repository (current branch)
git push

# Push and set upstream tracking (first time)
git push -u origin branch-name

# Push specific branch
git push origin branch-name

# Push all branches
git push --all origin

# Force push (⚠️ use with caution - overwrites remote)
git push --force
git push -f
```

### Pull

```bash
# Pull changes from remote (fetch + merge)
git pull

# Pull from specific branch
git pull origin branch-name

# Pull with rebase instead of merge
git pull --rebase

# Fetch without merging
git fetch
git fetch origin
```

---

## Merging

```bash
# Merge a branch into current branch
git merge feature-branch

# Merge with a commit message
git merge feature-branch -m "Merge feature-branch"

# Abort a merge (if conflicts arise)
git merge --abort

# Continue merge after resolving conflicts
git add resolved-file.txt
git commit
```

---

## Rebasing

```bash
# Rebase current branch onto another
git rebase main

# Interactive rebase (rewrite history)
git rebase -i HEAD~3              # Last 3 commits

# Continue rebase after resolving conflicts
git add resolved-file.txt
git rebase --continue

# Abort rebase
git rebase --abort

# Skip current commit during rebase
git rebase --skip
```

---

## Stashing (Temporary Storage)

```bash
# Stash current changes
git stash

# Stash with a message
git stash save "WIP: feature description"

# List all stashes
git stash list

# Apply most recent stash (keep in stash list)
git stash apply

# Apply specific stash
git stash apply stash@{2}

# Apply and remove from stash list
git stash pop

# Remove specific stash
git stash drop stash@{1}

# Clear all stashes
git stash clear
```

---

## Undoing Changes

### Unstaging & Discarding

```bash
# Unstage a file (keep changes in working directory)
git reset HEAD filename.txt
git restore --staged filename.txt # Modern syntax

# Discard changes in working directory
git checkout -- filename.txt
git restore filename.txt          # Modern syntax

# Discard all local changes
git reset --hard HEAD
```

### Reverting Commits

```bash
# Create a new commit that undoes a previous commit
git revert commit-hash

# Revert last commit
git revert HEAD

# Revert without creating a commit immediately
git revert --no-commit commit-hash
```

### Resetting

```bash
# Soft reset (keep changes staged)
git reset --soft HEAD~1

# Mixed reset (keep changes unstaged) - default
git reset HEAD~1
git reset --mixed HEAD~1

# Hard reset (⚠️ discard all changes)
git reset --hard HEAD~1

# Reset to specific commit
git reset --hard commit-hash
```

---

## Remote Repositories

```bash
# List remote repositories
git remote -v

# Add a remote repository
git remote add origin https://github.com/username/repo.git

# Change remote URL
git remote set-url origin https://github.com/username/new-repo.git

# Remove a remote
git remote remove origin

# Rename a remote
git remote rename old-name new-name

# Fetch from remote
git fetch origin

# Fetch and prune deleted remote branches
git fetch --prune
```

---

## Tagging

```bash
# List all tags
git tag

# Create a lightweight tag
git tag v1.0.0

# Create an annotated tag
git tag -a v1.0.0 -m "Version 1.0.0 release"

# Tag a specific commit
git tag v1.0.0 commit-hash

# Push tag to remote
git push origin v1.0.0

# Push all tags
git push --tags

# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0
```

---

## Viewing Differences

```bash
# Show unstaged changes
git diff

# Show staged changes
git diff --staged
git diff --cached

# Show changes between branches
git diff main..feature-branch

# Show changes between commits
git diff commit1 commit2

# Show changes for specific file
git diff filename.txt
```

---

## Typical Workflows

### Feature Branch Workflow

```bash
# 1. Create and switch to feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push feature branch to remote
git push -u origin feature/new-feature

# 4. Switch back to main and pull latest
git checkout main
git pull origin main

# 5. Merge feature branch
git merge feature/new-feature

# 6. Push merged changes
git push origin main

# 7. Delete feature branch (optional)
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

### Sync Fork with Upstream

```bash
# 1. Add upstream remote (once)
git remote add upstream https://github.com/original-owner/repo.git

# 2. Fetch upstream changes
git fetch upstream

# 3. Switch to main branch
git checkout main

# 4. Merge upstream changes
git merge upstream/main

# 5. Push to your fork
git push origin main
```

### Fix Conflicts

```bash
# 1. Attempt merge/pull (conflicts arise)
git pull origin main
# or
git merge feature-branch

# 2. View conflicted files
git status

# 3. Open and manually resolve conflicts in files
# Look for conflict markers: <<<<<<<, =======, >>>>>>>

# 4. Stage resolved files
git add resolved-file.txt

# 5. Complete the merge
git commit

# Or abort if needed
git merge --abort
```

---

## Useful Aliases (Optional)

Add these to your `~/.gitconfig` or run as commands:

```bash
# View aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.lg "log --oneline --graph --all"

# Now you can use shortcuts
git st        # instead of git status
git co main   # instead of git checkout main
git lg        # pretty log
```

---

## Tips & Best Practices

1. **Commit Often**: Make small, focused commits with clear messages.
2. **Pull Before Push**: Always pull latest changes before pushing.
3. **Branch Names**: Use descriptive names like `feature/login`, `bugfix/header-style`.
4. **Commit Messages**: Use imperative mood ("Add feature" not "Added feature").
5. **Don't Force Push**: Avoid `git push --force` on shared branches.
6. **Review Before Commit**: Use `git diff` and `git status` before committing.
7. **Keep Main Clean**: Never commit directly to main; use feature branches.

---

## Quick Reference Card

| Command | Description |
|---------|-------------|
| `git status` | Check working directory status |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Commit staged changes |
| `git push` | Push to remote |
| `git pull` | Fetch and merge from remote |
| `git checkout -b branch` | Create and switch to new branch |
| `git merge branch` | Merge branch into current |
| `git branch -d branch` | Delete local branch |
| `git log --oneline` | View compact history |
| `git diff` | Show unstaged changes |
| `git stash` | Temporarily store changes |
| `git reset --hard HEAD` | Discard all local changes |

---

## Getting Help

```bash
# General help
git help

# Help for specific command
git help commit
git commit --help

# Quick command synopsis
git commit -h
```

---

**Happy Git-ing!** 🚀
