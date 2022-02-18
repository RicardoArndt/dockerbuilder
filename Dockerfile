FROM node:lts-alpine3.14

WORKDIR /app

COPY package.json package.json  
RUN npm cache verify
RUN npm install --only=production

COPY lib lib
COPY app.js app.js

RUN touch apps.data

ENV PORT=80

EXPOSE 80
CMD ["node", "app.js"]
