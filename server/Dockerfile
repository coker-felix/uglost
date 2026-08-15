FROM node:20-slim AS build

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

ENV npm_config_build_from_source=true
RUN npm ci --omit=dev

COPY . .

FROM node:20-slim

WORKDIR /app

COPY --from=build /app /app

RUN mkdir -p /app/data /app/uploads

EXPOSE 5050
CMD ["sh", "docker-entrypoint.sh"]
