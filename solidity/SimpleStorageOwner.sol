pragma solidity ^0.4.0;

contract SimpleStorageOwner {
    uint storedData;
    address owner;

    // Constructor
    function SimpleStorageOwner() {
        owner = msg.sender;
    }
    modifier onlyOwner {
        // コントラクトへの呼び出しがコントラクトの作成者かを確認する
        // 違ったらrevertが発生します
        require(msg.sender == owner);
        // _は修飾子が付けられた関数を実行するという意味
        _;
    }
    function set(uint x) onlyOwner {
        storedData = x;
    }
    function get() constant returns (uint) {
        return storedData;
    }
}
