apt-get -y update
apt-get install -y ubuntu-desktop
apt-get install -y ruby ruby-dev
apt-get install -y python-pip
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
apt-get install -y nodejs
gem install selenium-webdriver
pip install --upgrade pip
pip install selenium
wget https://github.com/mozilla/geckodriver/releases/download/v0.19.1/geckodriver-v0.19.1-linux64.tar.gz
tar -zxvf geckodriver-v0.19.1-linux64.tar.gz
cp ./geckodriver /usr/local/bin
reboot
