// バージョンプラグマの指定
pragma solidity ^0.4.0;

// コントラクトの宣言
contract SimpleStorage {
    uint storedData;
    function set(uint x) {
        storedData = x;
    }
    function get() constant returns (uint) {
        return storedData;
    }
}
