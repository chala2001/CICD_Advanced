FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend files
COPY . .

# Expose port 5000 for the Node API
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
