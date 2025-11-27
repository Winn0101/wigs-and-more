# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache build-base python3

RUN npm install
RUN apk del build-base python3

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]