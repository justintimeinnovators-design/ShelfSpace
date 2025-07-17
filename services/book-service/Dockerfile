FROM node:24.2-alpine

WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-timeout 600000
RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000
RUN npm install

COPY . .

EXPOSE 3002
# CMD ["node", "index.js"]
CMD ["npm", "run", "dev"]
