pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract AToken is ERC777 {
    constructor(
        uint256 initialSupply,
        address[] memory defaultOperators
    )
    ERC777("AToken", "ATN", defaultOperators)
    public
    {
        _mint(msg.sender, msg.sender, initialSupply, "", "");
    }
}
