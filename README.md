# BlueHolding-Technical-Test

# Table of Contents

1. [BlueHolding-Technical-Test](#blueholding-technical-test)
2. [Setting Up Ubuntu 20.04 on a Virtual Machine](#setting-up-ubuntu-2004-on-a-virtual-machine)
    1. [Prerequisites](#prerequisites)
    2. [Installation Steps](#installation-steps)
3. [Docker Engine Installation](#docker-engine-installation)
4. [Git Installation](#git-installation)
5. [Generate SSH Key Pair](#generate-ssh-key-pair-to-securely-connect-to-git-repositories-using-ssh)
6. [Clone the Repository](#clone-the-repository-to-my-local-machine)
7. [Next.js Application Dockerization](#nextjs-application-dockerization)
8. [PHP Laravel Application Dockerization](#php-laravel-application-dockerization)
9. [Environment Settings File Creation](#environment-settings-file-creation)
10. [Docker Compose File Creation](#docker-compose-file-creation)
11. [Applications Deployment](#applications-deployment)
12. [Configure The PHP Container And Configure The App’s Virtual Host in Apache](#configure-the-php-container-and-configure-the-apps-virtual-host-in-apache)
13. [Access the Applications in The Browser](#access-the-applications-in-the-browser)
14. [Dockerize PHP Container Again](#i-have-dockerized-the-php-container-again-so-that-i-dont-lose-all-the-previous-changes-when-the-container-stops)
15. [Author](#author)
16. [Important Note](#Important Note)

## Setting Up Ubuntu 20.04 on a Virtual Machine

### Prerequisites
Before you begin, ensure you have the following:

* A virtualization software installed ([Vmware Workstation for Linux](https://www.vmware.com/mena/products/workstation-pro/workstation-pro-evaluation.html))
* The Ubuntu 20.04 ISO image downloaded ([Ubuntu 20.04](https://releases.ubuntu.com/focal/))
* Adequate hardware resources (CPU, RAM, and storage) for your virtual machine.

### Installation Steps

1. **Create a New Virtual Machine:**

   - Open your virtualization software.
   - Click "New" to create a new virtual machine.
   - Choose "Linux" as the type and "Ubuntu (64-bit)" as the version.
   - Allocate 5GB ram and processor configuration .
   - Create a new virtual hard disk with 30GB space .

2. **Configure VM Settings:**

   - Select the newly created virtual machine in your virtualization software.
   - Go to "Settings."
   - Under the "CD/DVD" tab, select the Ubuntu 20.04 ISO image.

3. **Start the Virtual Machine:**

   - Click "Start" to launch the virtual machine.
   - The Ubuntu installation menu will appear. Choose "Install Ubuntu" and press Enter.

4. **Choose Installation Options:**

   - Select your language and click "Continue."
   - For "Updates and Other Software," choose to "Download updates while installing Ubuntu" .
  
5. **Configure Time Zone and User:**

   - Select cairo as time zone on the map and click "Continue."
   - Create a user account by providing name, username, password, and computer name.
   - Click "Continue."

6. **Install Ubuntu:**

   - The installation process will begin. Wait for it to complete.
   - Once installation is done, click "Restart Now."
  
7. **Post-Installation Setup:**

   -  update the system and install additional software using the package manager:

      sudo apt update && sudo apt upgrade

   -  install curl
  
      sudo apt-get install curl

## Docker engine installation

1. **Install docker:**

curl -fsSL https://get.docker.com -o get-docker.sh

sudo sh ./get-docker.sh 

2. **Start and enable the Docker service:**

sudo systemctl start docker

sudo systemctl enable docker

## Git installation 

1. **Install git:**

sudo apt install git

2. **configure git:**

git config --global user.name "mariohany98"

git config --global user.email "mariohany98@gmail.com"

## Generate SSH Key Pair To securely connect to Git repositories using SSH

1. **install ssh:**

sudo apt install ssh

2. **generate a private and public key pair:**

ssh-keygen -t rsa

3. **copy the public key to git server:**

copy the content of the following file: /home/mario/.ssh/id_rsa.pub

navigate to GitHub settings on the UI >>>>>> SSH and GPG keys >>>>>> Add new SSh key

paste the public key and save

## Clone the repository to my local machine

git clone git@github.com:mariohany98/BlueHolding-Technical-Test.git

## Next.js application Dockerization

1. **Navigate to the code repository:**

cd ./BlueHolding-Technical-Test/intranet-front-main

2. **Create Dockerfile for Next.js App**

vim Dockerfile

![Screenshot 2023-09-21 213146](https://github.com/mariohany98/BlueHolding-Technical-Test/assets/143083001/dbfcbc8e-27bb-4790-a4c5-35ac55bb1931)

3. **Build docker image**

sudo docker build -t next-app .

4. **login to DockerHub repository to push the image**

sudo docker login

5. **Tag the Docker image**

note:Before pushing the image to Docker Hub, I need to tag it with my Docker Hub username and the desired repository name

sudo docker tag next-app mariohany98/nextjs-app:latest

6. **Push the Docker Image to DockerHub:**

sudo docker push mariohany98/nextjs-app:latest

## PHP Laravel application Dockerization

1. **Navigate to the code repository:**

cd ./BlueHolding-Technical-Test/blue-internal-back-master

2. **Create Dockerfile for PHP App**

vim Dockerfile

![Screenshot 2023-09-23 232440](https://github.com/mariohany98/BlueHolding-Technical-Test/assets/143083001/e267c4f5-c93e-4edc-bc49-05a773f55ae3)

3. **Build docker image**

sudo docker build -t mariohany98/php-app:2 .

4. **Push the Docker Image to DockerHub:**

sudo docker push mariohany98/php-app:2

## Environment Settings File Creation

1. **Navigate to the code repository:**

cd ./BlueHolding-Technical-Test/blue-internal-back-master

2. **Create the file:**

cat .env.example > .env

3. **Only modify the highlighted lines in .env file as the following:**

![Screenshot 2023-09-23 234738](https://github.com/mariohany98/BlueHolding-Technical-Test/assets/143083001/ab2a529d-f40b-4fd0-9ae3-af62cc3d3f8e)


## Docker Compose File Creation

1. **Navigate to the code repository:**

cd ./BlueHolding-Technical-Test/blue-internal-back-master

2. **Create The Docker compose file:**

sudo vim docker-compose.yml

![Screenshot 2023-09-23 235626](https://github.com/mariohany98/BlueHolding-Technical-Test/assets/143083001/f827d156-ec3e-409d-a779-c373a29aaca7)

**Important Notes:**

1- Both the .env file and the docker-compose.yaml file must be in the same directory.

2- The service name of the mysql-db container in the docker-compose.yaml file must be the same as the value of DB_HOST in the .env file.

## Applications Deployment

1. **Navigate to the code repository:**

cd ./BlueHolding-Technical-Test/blue-internal-back-master

2. **Run the containers:**

sudo docker compose up -d

## Configure The PHP Container And Configure The App’s Virtual Host in Apache

1. **Execute an interactive shell session (/bin/sh) inside the PHP Docker container:**

sudo docker exec -it php /bin/sh

2. **Navigate to /var/www/html/ :**

cd /var/www/html

3. **Run the following commands:**

chown -R www-data:www-data /var/www/html

* This command changes the owner and group of the directory and everything in the directory to www-data. www-data is the default user web servers like Apache.

chmod -R 755 /var/www/html  

* This command gives full permission to the user on the directory and everything in the directory. Also it gives only read and execute permission to group and others.

chmod -R 777 /var/www/html/storage  

* This command gives full permissions on these directory, so that no matter what process executes the Laravel application, it will be able to read from and write to them. 

4. **Install the dependencies specified in the composer.json**

composer install

5. **Install Vim editor:**

apt-get install vim

6. **Copy the 000-default.conf file and give it a new name (laravel.conf):**

cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/laravel.conf

7. **Edit laravel.conf as follows:**

vim /etc/apache2/sites-available/laravel.conf

![Screenshot 2023-09-23 193502](https://github.com/mariohany98/BlueHolding-Technical-Test/assets/143083001/2cc5a325-c77b-4135-a186-0a39ae89545e)

8. **Disable the default Apache site:**

a2dissite 000-default.conf

9. **Enable the Laravel App’s site and mod_rewrite:**

a2enmod rewrite

a2ensite laravel.conf

10. **Reload apache service:**

service apache2 reload

11. **Install Node.JS and npm:**

apt update

apt install nodejs

apt install npm

12. **Check that the installation was successful:**

node -v

13. **Navigate to /var/www/html/ :**

cd /var/www/html

14. **Apply database migrations and seed the database:**

php artisan migrate --seed

15. **Generate JWT secret key for JWT authentication:**

php artisan jwt:secret

16. **Install all the dependencies listed in package.json and prepare the application for production use:**

npm install && npm run production

17. **Start the web server:**

php artisan serve

## Access the Applications in The Browser

1.**NextJS Application**

http://localhost:3000

![Screenshot 2023-09-23 192352](https://github.com/mariohany98/BlueHolding-Technical-Test/assets/143083001/06a25718-8ba2-417d-a5f4-f767e8fdbae0)

2. **PHP Application**

http://localhost:8000

![Screenshot 2023-09-23 192423](https://github.com/mariohany98/BlueHolding-Technical-Test/assets/143083001/128475c5-b69b-4a58-ba05-b9520ef6cfd8)

![Screenshot 2023-09-23 192616](https://github.com/mariohany98/BlueHolding-Technical-Test/assets/143083001/d12d3bf4-1c08-48b0-a411-e41c709fa11a)

## I have Dockerized the PHP container again so that i don't lose all the previous changes when the container stops

1. **Commit the changes to a new image:**

sudo docker commit e0325 mariohany98/php-vuejs-app

2. **Push the image to a GitHub repository:**

sudo docker push mariohany98/php-vuejs-app

3. **If the running PHP container has stopped unexpectedly or intentionally. Set the new Docker image (mariohany98/php-vuejs-app) in Docker Compose file before running it**

## Important Note

Running containers in single docker host my be good for development and test environment, but in production environment this is not a good idea as this is single point of failure and to To avoid it we should use an orchestration tools like Kubernetes or Docker swarm for high availability and load balancing.

## Author 

Mario Hany

Feel free to contribute, report issues, or suggest improvements. 
