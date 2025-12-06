# -----------------------------
# 1. Base image
# -----------------------------
FROM node:19-alpine

# -----------------------------
# 2. Set working directory
# -----------------------------
WORKDIR /app

# -----------------------------
# 3. Copy package files first
# -----------------------------
# Copy only package.json and package-lock.json first for caching
COPY package*.json ./

# -----------------------------
# 4. Install dependencies
# -----------------------------
RUN npm install

# -----------------------------
# 5. Copy project files
# -----------------------------
COPY . .

# -----------------------------
# 6. Expose port
# -----------------------------
EXPOSE 8000

# -----------------------------
# 7. Set environment variable (optional)
# -----------------------------
# NODE_ENV=production improves performance
ENV NODE_ENV=production

# -----------------------------
# 8. Start the application
# -----------------------------
CMD ["npm", "start"]
