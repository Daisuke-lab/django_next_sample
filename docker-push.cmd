docker-compose -f docker-compose-pro.yaml build
aws ecr get-login-password | docker login --username AWS --password-stdin 381623038275.dkr.ecr.ap-northeast-1.amazonaws.com
docker push 381623038275.dkr.ecr.ap-northeast-1.amazonaws.com/yakuji_backend:latest
docker push 381623038275.dkr.ecr.ap-northeast-1.amazonaws.com/yakuji_backend_nginx:latest
docker push 381623038275.dkr.ecr.ap-northeast-1.amazonaws.com/yakuji_frontend:latest
docker push 381623038275.dkr.ecr.ap-northeast-1.amazonaws.com/yakuji_frontend_nginx:latest
