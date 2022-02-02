
if %1 neq frontend (
    aws ecs update-service ^
    --cluster yakuji-prod-ecs ^
    --service yakuji-backend-service ^
    --task-definition yakuji-backend ^
    --force-new-deployment
)


if %1 neq backend (
    aws ecs update-service ^
    --cluster yakuji-prod-ecs ^
    --service yakuji-frontend-service ^
    --task-definition yakuji-frontend ^
    --force-new-deployment
)
