
FROM node:18 AS build

WORKDIR /app

RUN npm install -g @angular/cli

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npx ng build myapp --configuration production

FROM nginx:alpine

COPY --from=build /app/dist/myapp /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

