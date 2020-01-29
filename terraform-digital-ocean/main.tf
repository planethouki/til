provider "digitalocean" {
  token = "42932ca0d4ef1bd0b9388029c1219e413e1c7e698dcbc22b4fc07ed9c321186e"
}

resource "digitalocean_droplet" "web" {
  image = "ubuntu-14-04-x64"
  name = "web-1"
  region = "sgp1"
  size = "512mb"
  ssh_keys = [26396379]
}