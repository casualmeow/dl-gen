

set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 {backendv2|backendv3|backend|frontend} [extra flyctl args...]"
  exit 1
fi

SERVICE="$1"; shift
case "$SERVICE" in
  backendv2)
    APP="dl-gen-backendv2"
    DOCKERFILE="backendv2/Dockerfile"
    PORT=8000
    ;;
  backendv3)
    APP="dl-gen-backendv3"
    DOCKERFILE="backendv3/Dockerfile"
    PORT=8001
    ;;
  backend)
    APP="dl-gen-backend"
    DOCKERFILE="backend/Dockerfile"
    PORT=8080
    ;;
  frontend)
    APP="dl-gen-frontend"
    DOCKERFILE="frontend/Dockerfile"
    PORT=80
    ;;
  *)
    echo "Unknown service: $SERVICE"
    exit 1
    ;;
esac

echo "Deploying $SERVICE → app=$APP, dockerfile=$DOCKERFILE"
flyctl deploy \
  --app "$APP" \
  --primary-region iad \
  --dockerfile "$DOCKERFILE" \
  --env PORT="$PORT" \
  "$@"
