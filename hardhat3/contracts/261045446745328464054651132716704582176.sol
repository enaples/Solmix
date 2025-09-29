// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleContract {
    string public message;
    address public owner;
    
    constructor() {
        message = "Hello, World!";
        owner = msg.sender;
    }
    
    function setMessage(string memory newMessage) public {
        require(msg.sender == owner, "Only the owner can change the message");
        message = newMessage;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}