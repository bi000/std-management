# =======================
# Production
# =======================

FROM node:20-alpine

# Create non-root user and group
RUN addgroup -S StudentManagementGroup && \
    adduser -S StudentManagementUser -G StudentManagementGroup

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Give ownership to non-root user
RUN chown -R StudentManagementUser:StudentManagementGroup /app

# Run application as non-root user
USER StudentManagementUser

EXPOSE 5000

CMD ["node", "src/server.js"]