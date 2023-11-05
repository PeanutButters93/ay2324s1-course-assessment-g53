FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV FRONTEND_HOST=https://peerprep.jonoans.com
EXPOSE 9001
CMD [ "node", "index.js" ]