## Mongo

### Подключение к продовой монге

1. Создай SSH-туннель - `ssh -L 27017:localhost:27017 user@130.193.58.171`
2. В Mongo Compass: mongodb://login:pass@localhost:27017/defi?authSource=admin

## Logs

1. docker logs nestjs
2. docker logs nextjs
