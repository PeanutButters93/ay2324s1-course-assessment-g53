FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV FRONTEND_HOST=https://peerprep.jonoans.com
ENV MONGODB_URI=mongodb://mongodb_container/document_db
EXPOSE 9000
CMD [ "node", "index.js" ]