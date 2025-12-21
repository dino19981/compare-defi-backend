## Mongo

### Подключение к продовой монге

1. Создай SSH-туннель - `ssh -N -L 27018:127.0.0.1:27017 dino19983@130.193.58.171`
2. В Mongo Compass: mongodb://login:pass@localhost:27017/defi?authSource=admin

## Logs

1. docker logs nestjs
2. docker logs nextjs

## Перезагрузка nginx

sudo nginx -t
sudo systemctl reload nginx

## Чистка места

docker system prune -af
docker volume prune -f
