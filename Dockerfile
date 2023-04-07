FROM node:16.13.2-buster-slim as dependency-install

# Install dependencies
WORKDIR /app
COPY package*.* ./

COPY layouts ./
COPY pages ./
COPY mqtt ./
COPY components ./
COPY layouts ./
COPY assets ./
COPY static ./
COPY utils ./

RUN apt-get update && apt-get install python3 build-essential -y
RUN npm ci --unsafe-perm
RUN npm run build

# Start app
FROM node:16.13.2-buster-slim

ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV NODE_OPTIONS="--max_old_space_size=4096"
ENV PORT 80

WORKDIR /app
COPY  --from=dependency-install layouts ./
COPY  --from=dependency-install pages ./
COPY  --from=dependency-install mqtt ./
COPY  --from=dependency-install components ./
COPY  --from=dependency-install layouts ./
COPY  --from=dependency-install assets ./
COPY  --from=dependency-install static ./
COPY  --from=dependency-install utils ./


COPY --from=dependency-install app/node_modules ./node_modules
COPY --from=dependency-install app/.nuxt ./.nuxt
COPY --from=dependency-install app/package*.* ./
EXPOSE 3000
CMD ["npm" , "start"]
