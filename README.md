# Biltoki

Scaffold initial du projet **Biltoki** pour une application mobile Expo + API NestJS.

## Structure

- `/app` : application mobile React Native (Expo, TypeScript)
- `/api` : API NestJS (TypeScript) avec modules métier

## Backend (NestJS)

Modules scaffoldés :
- auth
- users
- halls
- events
- loyalty
- notifications
- producers
- admin
- prisma

Le schéma Prisma est disponible dans `/api/prisma/schema.prisma` et couvre :
- comptes clients et profil
- programme de fidélité + QR
- halles, producteurs, événements
- abonnements et notifications push

## Frontend (Expo)

Arborescence de base créée pour les fonctionnalités :
- authentification et profil
- carte fidélité
- notifications push
- événements
- annuaire des halles
