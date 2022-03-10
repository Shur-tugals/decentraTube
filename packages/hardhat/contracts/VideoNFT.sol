pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VideoNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping (address => uint256) public balances;
    mapping (uint256 => string) private _tokenURIs;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

     function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function createVideoNFT(address _owner, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newNFTId = _tokenIds.current();
        _mint(_owner, newNFTId);
        _setTokenURI(newNFTId, tokenURI);

        return newNFTId;
    }

    function tip(uint256 _tokenId) public payable {
        balances[ownerOf(_tokenId)] += msg.value;
    }

    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "You are trying withdraw more than your available balance");
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Failed to send Ether");
        balances[msg.sender] -= _amount;
    }
}