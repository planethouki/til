cd $(dirname $0)
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get update | sudo apt-get upgrade
sudo apt-get -y install git
# sudo apt-get -y install build-essential
# sudo apt-get -y install libssl-dev
# sudo apt-get -y install libffi-dev
# sudo apt-get -y install python-pip
# sudo apt-get -y install python-dev
sudo apt-get -y install nodejs
sudo apt-get -y install yarn