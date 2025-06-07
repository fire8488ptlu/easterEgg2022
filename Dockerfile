FROM node:16-alpine

#create folder and enter the folder
WORKDIR /2022easteregg

#copy local folder to docker
# COPY app  ./app
COPY express ./express
COPY frontend/build ./express/build

# change enterpoint & npm install & npm start
WORKDIR /2022easteregg/express
RUN npm install
EXPOSE 3000
CMD ["npm","run","start"]
