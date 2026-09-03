# ===============
# Stage1: Build
# ===============
# Base Image
FROM node:20-alpine AS builder
#
WORKDIR /app
# copy all package.json & package-lock.json
COPY package*.json ./
# INstall all dev package
RUN npm ci
# Copy all rest of the code.
COPY . .
# build the application
RUN npm run build

# ===============
# Stage:2 Production
# ===============
# Nginx base image which works as caching able to store frontend file
FROM nginx:alpine

# copy the build application file into nginx
COPY --from=builder /app/dist /usr/share/nginx/html
#Expose it on port 80
EXPOSE 80
#nginx starting command
CMD ["nginx", "-g", "daemon off;"]
