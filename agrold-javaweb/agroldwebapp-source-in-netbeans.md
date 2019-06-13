### Installation du code source dans Netbeans
*  OS: Ubuntu (18.10) ou Windows 10
*  installer Java SE et JDK 1.8 ou plus
*  installer apache Tomcat 8.5: [https://tomcat.apache.org/download-80.cgi](https://tomcat.apache.org/download-80.cgi)
*  créer un utilisateur Tomcat avec les rôles d'administrateur dans le fichier conf/tomcat-users.xml (`<user password="tomcat" roles="manager-script,admin,manager-gui" username="tomcat"/>`)
*  Ajouter le serveur Tomcat dans Netbeans: à partir de l'onglet *Services* de Netbeans: clic-droit sur *Servers* puis *Add Server...*
*  télécharger et décompresser Netbeans 11: [https://www.apache.org/dyn/closer.cgi/incubator/netbeans/incubating-netbeans/incubating-11.0/incubating-netbeans-11.0-bin.zip](https://www.apache.org/dyn/closer.cgi/incubator/netbeans/incubating-netbeans/incubating-11.0/incubating-netbeans-11.0-bin.zip)
*  exécuter netbeans11: `netbeans/bin/netbeans`
*  cloner la branche *dev* du dépôt GitHub de l'appi web d'AgroLD: `git clone -b dev https://github.com/SouthGreenPlatform/AgroLD_webapp.git`
*  ouvrir avec Netbeans le projet Maven *agrold-javaweb-dev* qui se trouve dans le dossier *AgroLD_webapp*
*  remplacer le chemin de configuration de la connexion au serveur MySQL pour la gestion de l'historique utilisateur dans le fichier `agrold.ogust.config.MySQLProperties`: variable `configFilePath` (le fichier doit être en local); le contenu de ce fichier est:
```
fruges.cirad.fr:3306/agrold?useSSL=false
agrold
G4sVsURNh3tZcZ22
```
*  faire un clic-droit sur le projet, puis aller à `Set configuration`, puis cliquer sur `<default config>`
*  Exécuter l'application