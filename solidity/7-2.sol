pragma solidity ^0.4.0;

contract Booleans {
  function getTrue() constant returns (bool) {
    bool a = true;
    bool b = false;
    return a || b;
  }
  function getFalse() constant returns (bool) {
    bool a = false;
    bool b = true;
    return a && b;
  }
}

contract Integers {
  function getTwo() constant returns (uint) {
    uint a = 3;
    uint b = 2;
    return a / b * 2; // 切り捨てにより、a/b=1, 1*2=2が返る
  }
  function getThree() constant returns (uint) {
    return 3 / 2 * 2; // 両辺がリテラルの場合は、切り捨てされない 3/2=1.5
  }
  function divByZero() constant returns (uint) {
    return 3 / 0; // コンパイルが通らない
  }
  function shift() constant returns (uint[2]) {
    uint[2] a;
    // 16 * 2 ** 2 = 64
    a[0] = 16 << 2;
    // 16 / 2 ** 2 = 4
    a[1] = 16 >> 2;
    return a;
  }
}

contract Address {
  function () payable {}
  function getBalance(address _t) constant returns (uint) {
    if (_t == address(0)) {
      _t = this;
    }
    return _t.balance;
  }
  function transfer(address _to, uint _amount) {
  _to.transfer(_amount);
  }
  function send(address _to, uint _amount) {
    if (!_to.send(_amount)) {
      throw;
    }
  }
  function call(address _to, uint _amount) {
    if(!_to.call.value(_amount).gas(1000000)()) {
      throw;
    }
  }
  function withDraw() {
    address to = msg.sender;
    to.transfer(this.balance);
  }
  function withDraw2() {
    address to = msg.sender;
    if(!to.call.value(this.balance).gas(1000000)()) {
      throw;
    }
  }
}

contract Bytes {
  function bybb() returns (bytes2) {
    bytes2 b = "ba";
    return b;
  }
  function bybb() returns (bytes)  {
    bytes memory a = 'baaaaaaaaaa'; // bytes は動的で、参照型
    return a;
  }
}

contract Enum {
  enum Colors { Red, Blue, Green }
  Colors color;
  Colors constant defaultColor = Colors.Green;
  function setColor() {
    color = Colors.Blue;
  }
  function getColor() returns (Colors) {
    return color;
  }
  function getDefaultColor() returns (uint) {
    return uint(defaultColor);
  }
}

contract Selector {
  function e() returns (bytes4) {
    // thisがつくと外部呼出し
    return this.e.eseletor;
  }
  function f() returns (uint) {
    // 内部呼び出しでselectorがないのでエラー
    //return f.selector;
    return g();
  }
  function g() internal returns (uint) {
    return 0;
  }
}
