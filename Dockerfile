# Etapa 1: Construcción
FROM node:24.14.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Compila el proyecto a archivos estáticos (crea la carpeta dist)
RUN npm run build

# Etapa 2: Servidor de Producción
FROM nginx:alpine
# Pasamos los archivos compilados de la etapa anterior al servidor web
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos la configuración de Nginx para servir la SPA correctamente
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Exponemos el puerto web estándar
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]