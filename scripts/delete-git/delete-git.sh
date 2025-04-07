
SOURCE_FOLDER=${1:-backendv3}
TARGET_FOLDER=${2:-backendv3}
REPO_ROOT=$(pwd)
PATCH_PATH="/tmp/${SOURCE_FOLDER}.patch"
REMOVE_NESTED_GIT=${3:-false}

SOURCE_PATH="$REPO_ROOT/$SOURCE_FOLDER"

if [ "$REMOVE_NESTED_GIT" = true ] && [ -d "$SOURCE_PATH/.git" ]; then
  rm -rf "$SOURCE_PATH/.git"
  echo "⚠️ Removed nested .git from $SOURCE_FOLDER"
fi

cd "$SOURCE_PATH"
git diff > "$PATCH_PATH"

cd "$REPO_ROOT"
git apply --directory="$TARGET_FOLDER" "$PATCH_PATH"

echo "✅ Patch from '$SOURCE_FOLDER' applied into '$TARGET_FOLDER'"
