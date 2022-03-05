
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

## Building and running into containerized version

``` bash
# Build image
$ docker build -t nuxtjs-dashboard .

# Run image in detached mode
$ docker run -p 3000:3000 -d nuxtjs-dashboard

# Get container ID
$ docker ps

# Print application output (continuously)
$ docker logs <container id> -f

# Enter the container
$ docker exec -it <container id> /bin/bash

# Quit the container
$ docker stop <container id>
```
