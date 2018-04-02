yum -y update
yum -y install java-1.8.0-openjdk java-1.8.0-openjdk-devel
yum -y install git
yum -y install screen
mkdir -p /spigot/BuildTools
cd /spigot/BuildTools
curl -o /spigot/BuildTools/BuildTools.jar https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar
java -jar /spigot/BuildTools/BuildTools.jar --rev latest