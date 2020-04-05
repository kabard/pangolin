FROM node:10.16.0

WORKDIR /server

COPY . /server

RUN cd admin_dashboard && rm -rf node_modules && yarn install && yarn build

RUN cd ../

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]