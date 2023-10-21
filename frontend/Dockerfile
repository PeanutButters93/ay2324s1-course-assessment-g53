FROM node:18
WORKDIR /src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV REACT_APP_USER_HOST=https://peerprep.jonoans.com/api/users
ENV REACT_APP_QUESTION_HOST=https://peerprep.jonoans.com/api/questions
RUN npm run build
RUN npm i -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]