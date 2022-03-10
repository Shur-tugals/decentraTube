pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT
import "./Stream.sol";

contract StreamFactory {
    mapping(address => Stream) public streams;

    function create(address payable _owner, string memory _streamId) public {
        Stream stream = new Stream(_owner, _streamId);
        streams[stream.owner()] = stream;
    }

    function getStream(address _owner)
        public
        view
        returns (
            address owner,
            address streamAddr,
            string memory streamId,
            uint balance
        )
    {
        Stream stream = streams[_owner];

        return (stream.owner(), stream.streamAddr(), stream.streamId(), address(stream).balance);
    }
}