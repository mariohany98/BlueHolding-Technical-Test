# BlueHolding-Technical-Test

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

