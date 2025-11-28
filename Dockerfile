# Step 1: Run
FROM node:22-alpine
WORKDIR /app

COPY . .

# EXPOSE agar Docker Desktop bisa detect port
EXPOSE 3000

# Next.js dev server must listen 0.0.0.0 inside docker
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
