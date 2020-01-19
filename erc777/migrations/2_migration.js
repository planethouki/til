const Token = artifacts.require("AToken");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Token, "100000000000000000000000000", accounts);
};
