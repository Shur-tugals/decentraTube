pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

contract Stream {
    address payable public owner;
    address public streamAddr;
    string public streamId;

    constructor(address payable _owner, string memory _streamId) {
        owner = _owner;
        streamAddr = address(this);
        streamId = _streamId;
    }

    function withdraw() public {
        require(owner == msg.sender, "Unauthorized");
        uint amount = address(this).balance;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to send Ether");
    }

    function tip() public payable{}

    // to support receiving ETH by default
    receive() external payable {}
    fallback() external payable {}
}