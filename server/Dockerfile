# Use an official Node.js runtime as a parent image
FROM node:18-alpine As builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json ./
COPY package-lock.json* ./
# If you are using yarn, uncomment the next line and comment out the npm ci line
# COPY yarn.lock ./

# Install app dependencies
# Using ci for reproducible builds
RUN npm ci --only=production && npm cache clean --force
# If you are using yarn, uncomment the next line and comment out the npm ci line
# RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy the rest of the application code
COPY . .

# Transpile TypeScript to JavaScript
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# Second stage: Production environment
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy built assets and production dependencies from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the application
# This will depend on how your application is started, e.g., node dist/index.js or npm start
# Assuming your compiled output is in 'dist' and main file is 'index.js' or 'server.js'
CMD [ "node", "dist/index.js" ]
