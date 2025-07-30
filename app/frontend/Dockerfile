FROM node:18-alpine AS builder

WORKDIR /app
COPY app/frontend/package*.json ./
RUN npm install
COPY app/frontend/ .
RUN npm run build


FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./

ENV PORT=3000
EXPOSE $PORT

ENV NEXT_PUBLIC_PROXY_API=$PROXY_API
ENV NEXT_PUBLIC_PROXY_LOGIN=$PROXY_LOGIN

CMD ["npm", "start"]

