FROM node:14

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y ffmpeg

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

CMD [ "yarn", "start" ]
