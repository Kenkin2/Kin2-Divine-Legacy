// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SoulToken {
  mapping(uint256 => string) public indigenousBlessing;
  event BlessingForged(uint256 tokenId, string blessing, string language);

  function forgeBlessing(uint256 tokenId, string memory blessing, string memory language) public {
    indigenousBlessing[tokenId] = blessing;
    emit BlessingForged(tokenId, blessing, language);
  }
}
