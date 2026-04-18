# Stage 1: Build the React Application
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json to cache dependencies
COPY package*.json ./
RUN npm install

# Copy all source code and build it
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Overwrite default nginx config with our custom one to fix React router 404s
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (HTTP)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
