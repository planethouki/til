pragma solidity ^0.5.0;

contract Box {
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }

    function increment() public {
        value = value + 1;
        emit ValueChanged(value);
    }
}

//
//// contracts/Box.sol
//pragma solidity ^0.5.0;
//
//// Import Auth from the access-control subdirectory
//import "./access-control/Auth.sol";
//import "@openzeppelin/upgrades/contracts/Initializable.sol";
//
//contract Box is Initializable {
//    uint256 private value;
//    Auth private auth;
//
//    event ValueChanged(uint256 newValue);
//
//    function initialize(Auth _auth) initializer public {
//        auth = _auth;
//    }
//
//    function store(uint256 newValue) public {
//        // Require that the caller is registered as an administrator in Auth
//        require(auth.isAdministrator(msg.sender), "Unauthorized");
//
//        value = newValue;
//        emit ValueChanged(newValue);
//    }
//
//    function retrieve() public view returns (uint256) {
//        return value;
//    }
//}
