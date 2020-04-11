Linux vm 42 :
lancer le daemon docker
Sudo dockerd

lancer le conteneur dans le dossier /server/db
sudo docker-compose exec -f docker-compose.yml up

lancer le back-end à la racine
sudo npm run setupServeur

lancer le front-end à la racine
sudo npm run setupFront

Mac:
lancer le conteneur dans le dossier /server/db
sudo docker-compose exec -f docker-compose.yml up

lancer le back-end à la racine
sudo npm run setupServeur

lancer le front-end à la racine
sudo npm run setupFront

Probleme si les host ont déja mysql d'installer sur le pc
