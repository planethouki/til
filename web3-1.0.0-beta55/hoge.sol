pragma solidity ^0.5.0;

contract crypton {

    struct Crypton {
        address owner;
        uint8 color;
        uint8 pattern;
    }

    Crypton[] cryptons;

    function fusion(uint256 _left, uint256 _right) external returns (uint256) {
        Crypton memory left = cryptons[_left];
        Crypton memory right = cryptons[_right];
        cryptons.push(Crypton(
                msg.sender,
                left.color + right.color,
                left.pattern + right.pattern
            ));
        return cryptons.length;
    }

    function bid(uint256 _tokenId) external payable {
        cryptons[_tokenId].owner = msg.sender;
    }

}
