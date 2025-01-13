# Utiliser l'image officielle de Node.js comme base
FROM node:18-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le reste du code de l'application
COPY . .

# Exposer le port sur lequel l'application sera accessible
EXPOSE 8888

# Définir la commande pour démarrer l'application
CMD ["node", "server.js"]