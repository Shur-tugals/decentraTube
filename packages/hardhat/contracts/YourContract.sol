pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract YourContract is ERC721 {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping (address => uint256) public balances;
  mapping (uint256 => string) private _tokenURIs;
  
  event NewVideo(uint256 id, address owner, string tokenURI);
  event NewTip(address from, address to, uint256 amount, uint256 tokenId);
  event NewWithdraw(address user, uint256 amount);

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

      emit NewVideo(newNFTId, _owner, tokenURI);

      return newNFTId;
  }

  function tip(uint256 _tokenId) public payable {
      balances[ownerOf(_tokenId)] += msg.value;
      emit NewTip(msg.sender, ownerOf(_tokenId), msg.value, _tokenId);
  }

  function withdraw(uint256 _amount) public {
      require(balances[msg.sender] >= _amount, "You are trying withdraw more than your available balance");
      (bool success, ) = msg.sender.call{value: _amount}("");
      require(success, "Failed to send Ether");
      balances[msg.sender] -= _amount;
      emit NewWithdraw(msg.sender, _amount);
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
