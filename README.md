# Description

Imp Raiding API

## Project setup

```bash
$ npm install
```

### Environment variables

Create a `.env` file in the root of the project and use the file `.env.example` as a template. 

If you do not plan to run locally (outside of docker), do not bother with the `.env` file. Instead,
**just create a `.env.docker` file using the `.env.docker.example`**

### Running in Docker
This should be the preferred way to run the application, even in development! Please use Docker Engine.

```bash
npm run docker:build
npm run docker
```


### Running Locally

```bash
## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

