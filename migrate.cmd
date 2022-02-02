aws ecs run-task ^
--cluster yakuji-prod-ecs ^
--task-definition yakuji-migrate ^
--launch-type FARGATE ^
--network-configuration awsvpcConfiguration={subnets=["subnet-0e49c8a5386593127"],securityGroups=["sg-0970e52f075849eea"],assignPublicIp="DISABLED"}