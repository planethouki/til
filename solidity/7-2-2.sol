pragma solidity ^4.0.0;

contract DataLocation {
    uint[] x;  // ローカル変数の宣言 -> storage

    // memoryArrayは関数内で使用される -> memory
    function f(uint[] memoryArray) {
        x = memoryArray;    // storageにmemoryArrayがコピーされます
        var y = x;          // xのポインタが入ります。yはstorageを指しています
        y[7];
        y.length = 2;       // y経由でxの長さ変更
        delete x;           // xを削除するとyも削除されます
        // y = memoryArray; 動作しない。yはstorageとして静的に確保されている
        // delete y;        動作しない。
        g(x);               // xへの参照をgへ渡す
        h(x);               // xはstorageなのでmemoryをコピーしてhを実行

    }

    function g(uint[] storage storageArray) internal {}
    function h(uint[] memoryArray) {}
}
