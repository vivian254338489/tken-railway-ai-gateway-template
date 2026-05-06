FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
ENV PORT=8792
EXPOSE 8792
CMD ["npm", "start"]
