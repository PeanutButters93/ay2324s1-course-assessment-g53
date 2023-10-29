FROM node:18
WORKDIR /src/app
COPY package*.json ./
RUN npm install
COPY . .
# ENV REACT_APP_USER_HOST=https://peerprep.jonoans.com/api/users
# ENV REACT_APP_QUESTION_HOST=https://peerprep.jonoans.com/api/questions
# ENV REACT_APP_MATCHING_HOST=ws://peerprep.jonoans.com:8443
# ENV REACT_APP_COLLAB_HOST=https://peerprep.jonoans.com
# ENV REACT_APP_COMMUNICATION_HOST=https://peerprep.jonoans.com:2096
RUN npm run build
RUN npm i -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]