// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract registerAIGeneratedContent {
    struct Contents {
        string prompt;
        string response;
        address creator;
        string ipfsID;
        uint256 timeStamp;
    }

    // Lookup by keccak256(content + metadata)
    mapping(bytes32 => Contents) public contentByHash;

    // Enables verification by content string (AI response)
    mapping(string => bytes32) public hashByContent;

    // 🔍 Track all content hashes for explorer
    bytes32[] public contentHashes;

    event ContentRegistered(
        bytes32 indexed contentHash,
        address indexed creator,
        string prompt,
        string response,
        string ipfsID,
        uint256 timeStamp
    );

    function registerAIContent(
        bytes32 contentHash,
        string calldata prompt,
        string calldata response,
        string calldata ipfsID
    ) external {
        require(contentByHash[contentHash].timeStamp == 0, "Content already exists");

        contentByHash[contentHash] = Contents({
            prompt: prompt,
            response: response,
            creator: msg.sender,
            ipfsID: ipfsID,
            timeStamp: block.timestamp
        });

        hashByContent[response] = contentHash;
        contentHashes.push(contentHash); // ✅ track all hashes

        emit ContentRegistered(contentHash, msg.sender, prompt, response, ipfsID, block.timestamp);
    }

    function getContentByHash(
        bytes32 contentHash
    )
        external
        view
        returns (
            string memory prompt,
            string memory response,
            address creator,
            string memory ipfsID,
            uint256 timeStamp
        )
    {
        Contents storage content = contentByHash[contentHash];
        return (
            content.prompt,
            content.response,
            content.creator,
            content.ipfsID,
            content.timeStamp
        );
    }

    function contentExists(bytes32 contentHash) external view returns (bool) {
        return contentByHash[contentHash].timeStamp != 0;
    }

    function getHashByContent(string calldata response) external view returns (bytes32) {
        return hashByContent[response];
    }

    // 📚 For block explorer: return all stored hashes
    function allContentHashes() external view returns (bytes32[] memory) {
        return contentHashes;
    }
}
