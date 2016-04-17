# Local Docker

```
docker-machine create dev2 --driver virtualbox --virtualbox-disk-size "10000" --virtualbox-cpu-count 2 --virtualbox-memory "4112"
docker-machine env dev2
docker build -t test999 .
docker run -p 4500:4500 test999
```


Useful stuff:


# Delete all containers

```
docker rm $(docker ps -a -q)
```

# Delete all images

```
docker rmi $(docker images -q)
```