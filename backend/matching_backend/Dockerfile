FROM node:18
WORKDIR /src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV RABBIT_MQ_HOST=
ENV USER_HOST=http://peerprep-g53-fe-2022344057.ap-southeast-1.elb.amazonaws.com/api/users
ENV FRONTEND_HOST=https://peerprep.jonoans.com
ENV REACT_APP_COLLAB_HOST=
EXPOSE 3001
CMD ["npm", "start"]
