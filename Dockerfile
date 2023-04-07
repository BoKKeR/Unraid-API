FROM node:16.13.2-buster-slim as dependency-install

# Install dependencies
WORKDIR /app
COPY package*.* ./

COPY layouts ./layouts
COPY pages ./pages
COPY mqtt ./mqtt
COPY components ./components
COPY layouts ./layouts
COPY assets ./assets
COPY static ./static
COPY utils ./utils

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
COPY  --from=dependency-install app/layouts ./layouts
COPY  --from=dependency-install app/pages ./pages
COPY  --from=dependency-install app/mqtt ./mqtt
COPY  --from=dependency-install app/components ./components
COPY  --from=dependency-install app/layouts ./layouts
COPY  --from=dependency-install app/assets ./assets
COPY  --from=dependency-install app/static ./static
COPY  --from=dependency-install app/utils ./utils


COPY --from=dependency-install app/node_modules ./node_modules
COPY --from=dependency-install app/.nuxt ./.nuxt
COPY --from=dependency-install app/package*.* ./
EXPOSE 3000
CMD ["npm" , "start"]
