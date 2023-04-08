FROM node:16.13.2-buster-slim as dependency-install

# Install dependencies
WORKDIR /app

COPY ./ ./
COPY nuxt.config.ts ./server/
# COPY nuxt.config.ts ./
# COPY layouts ./layouts
# COPY pages ./pages
# COPY mqtt ./mqtt
# COPY components ./components
# COPY layouts ./layouts
# COPY assets ./assets
# COPY static ./static
# COPY utils ./utils
# COPY server ./server
# COPY api ./api
# COPY tsconfig.json ./tsconfig.json


RUN apt-get update && apt-get install python3 build-essential -y
RUN npm ci --unsafe-perm
RUN npm run build
RUN npm run deprecated:build:server

# Start app
FROM node:16.13.2-buster-slim
RUN apt-get update && apt-get install curl vim -y

ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV NODE_OPTIONS="--max_old_space_size=4096"
ENV PORT 80

WORKDIR /app
COPY  --from=dependency-install app/ ./
#COPY  --from=dependency-install app/nuxt.config.ts ./server/
# COPY  --from=dependency-install app/static ./static
# COPY  --from=dependency-install app/layouts ./layouts
# COPY  --from=dependency-install app/pages ./pages
# COPY  --from=dependency-install app/mqtt ./mqtt
# COPY  --from=dependency-install app/components ./components
# COPY  --from=dependency-install app/layouts ./layouts
# COPY  --from=dependency-install app/assets ./assets
# COPY  --from=dependency-install app/server ./server
# COPY  --from=dependency-install app/static ./static
# COPY  --from=dependency-install app/utils ./utils
# COPY  --from=dependency-install app/api ./api
# COPY  --from=dependency-install app/nuxt.config.ts ./


#COPY --from=dependency-install app/node_modules ./node_modules
#COPY --from=dependency-install app/.nuxt ./.nuxt
#COPY --from=dependency-install app/package*.* ./

#RUN mkdir ./config

EXPOSE 3000
#ENTRYPOINT ["tail", "-f", "/dev/null"]
CMD ["npm" ,"run", "deprecated:start:server"]
#CMD ["npm" , "start"]
