FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS test-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run test

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npx prisma generate
RUN npm run build
RUN npm run build:server

FROM node:20-alpine
COPY ./package.json package-lock.json server.js /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/server_build /app/server_build
COPY --from=build-env /app/prisma /app/prisma
WORKDIR /app
EXPOSE 3000
EXPOSE 3030
ENV NODE_OPTIONS="--require dotenv/config"
ENV NODE_ENV="production"
CMD ["npm", "run", "start"]