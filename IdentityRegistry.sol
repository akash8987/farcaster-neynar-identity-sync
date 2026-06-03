// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title IdentityRegistry
 * @dev Anchors authenticated off-chain Farcaster social identity records to on-chain state vectors.
 */
contract IdentityRegistry {
    address public operator;

    struct IdentityRecord {
        uint256 fid;
        address custodyWallet;
        bool verified;
    }

    mapping(address => IdentityRecord) public addressToIdentity;
    mapping(uint256 => address) public fidToPrimaryAddress;

    event IdentityAnchored(uint256 indexed fid, address indexed custodyWallet);

    constructor() {
        operator = msg.sender;
    }

    /**
     * @notice Maps an verified off-chain Farcaster structural identity directly to an EVM address.
     */
    function anchorIdentity(uint256 fid, address custodyWallet) external {
        require(msg.sender == operator, "IdentityError: Unauthorized indexing entity");
        require(custodyWallet != address(0), "IdentityError: Invalid address target");

        addressToIdentity[custodyWallet] = IdentityRecord({
            fid: fid,
            custodyWallet: custodyWallet,
            verified: true
        });
        
        fidToPrimaryAddress[fid] = custodyWallet;

        emit IdentityAnchored(fid, custodyWallet);
    }
}
