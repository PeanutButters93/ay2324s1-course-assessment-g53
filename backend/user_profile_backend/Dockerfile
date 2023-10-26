FROM node:18
WORKDIR /src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV USER_HOST=http://peerprep-g53-fe-2022344057.ap-southeast-1.elb.amazonaws.com/api/users
EXPOSE 4000
CMD ["node", "index.js"]