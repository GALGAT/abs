# Use official Node image
FROM node:18

# Create app directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Build frontend & backend
RUN npm run build

# Start server
CMD ["npm", "run", "start"]
