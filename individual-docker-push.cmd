set docker_file=None
if %1==frontend-nginx (
    set docker_file=./Dockerfile.frontend_nginx
    set image_name=381623038275.dkr.ecr.ap-northeast-1.amazonaws.com/yakuji_frontend_nginx:latest
)
if %1==backend-nginx (
    set docker_file=./Dockerfile.backend_nginx
    set image_name=381623038275.dkr.ecr.ap-northeast-1.amazonaws.com/yakuji_backend_nginx:latest
)
if %1==next (
    set docker_file=./Dockerfile.node
    set image_name=381623038275.dkr.ecr.ap-northeast-1.amazonaws.com/yakuji_frontend:latest
)
if %1==gunicorn (
    set docker_file=./Dockerfile.python
    set image_name=381623038275.dkr.ecr.ap-northeast-1.amazonaws.com/yakuji_backend:latest
)
if %docker_file%==None (
    echo please specify valid application name
) else (
    docker build . -f %docker_file% -t %image_name%
    aws ecr get-login-password | docker login --username AWS --password-stdin 381623038275.dkr.ecr.ap-northeast-1.amazonaws.com
    docker push %image_name%
)
