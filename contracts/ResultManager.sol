// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract ResultManager is AccessControlEnumerable {
    struct Value {
        int8 power;
        uint16 collectionId;
        bytes32 name;
        uint256 value;
        uint256 lastUpdatedTimestamp;
    }

    bytes32 public constant RESULT_MANAGER_ADMIN_ROLE =
        keccak256("RESULT_MANAGER_ADMIN_ROLE");
    bytes32 public constant FORWARDER_ROLE = keccak256("FORWARDER_ROLE");

    address public signerAddress;

    /// @notice mapping for CollectionID -> Value Info
    mapping(bytes32 => Value) private _collectionResults;

    event SignerUpdated(
        address sender,
        address indexed prevSigner,
        address indexed newSigner
    );

    event ResultUpdated(Value value);

    error InvalidSignature();
    error InvalidMerkleProof();
    error ZeroResult();

    constructor(address _signerAddress) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        signerAddress = _signerAddress;
    }

    /**
     * @notice Updates the signer address
     */
    function updateSignerAddress(
        address _signerAddress
    ) external onlyRole(RESULT_MANAGER_ADMIN_ROLE) {
        emit SignerUpdated(msg.sender, signerAddress, _signerAddress);
        signerAddress = _signerAddress;
    }

    /**
     * @notice deletes the result of a collection
     * @param name The name of the collection
     */
    function deleteResult(bytes32 name) external onlyRole(RESULT_MANAGER_ADMIN_ROLE) {
        delete _collectionResults[name];
    }

    /**  @notice Updates the result based on the provided Merkle proof and decoded result. Regardless of whether the result
     * is updated, a result will be returned.
     * @param merkleRoot The root of the Merkle tree
     * @param proof The Merkle proof for the result
     * @param result The decoded result
     * @param signature The signature for the result
     * @return result of the collection, its power and timestamp
    */
    function updateResult(
        bytes32 merkleRoot,
        bytes32[] memory proof,
        Value memory result,
        bytes memory signature
    ) external onlyRole(FORWARDER_ROLE) returns (uint256, int8, uint256) {
        if (result.lastUpdatedTimestamp > _collectionResults[result.name].lastUpdatedTimestamp) {
            if (!_checkSignature(merkleRoot, signature)) revert InvalidSignature();

            if (!_checkMerkle(result, merkleRoot, proof)) revert InvalidMerkleProof();

            _collectionResults[result.name] = result;

            emit ResultUpdated(result);
        }

        return _getResult(result.name);
    }

    /**
     * @dev validates the result based on the provided data and returns the validity
     * @param merkleRoot The root of the Merkle tree
     * @param proof The Merkle proof for the result
     * @param result The decoded result
     * @param signature The signature for the result
     * @return validity of the result
     */
    function validateResult(
        bytes32 merkleRoot,
        bytes32[] memory proof,
        Value memory result,
        bytes memory signature
    ) external view onlyRole(FORWARDER_ROLE) returns (bool) {
        if (!_checkSignature(merkleRoot, signature)) return false;

        if (!_checkMerkle(result, merkleRoot, proof)) return false;

        return true;
    }

    /**
     * @dev using the hash of collection name, clients can query the result of that collection
     * @param _name bytes32 hash of the collection name
     * @return result of the collection and its power
     */
    function getResult(
        bytes32 _name
    ) external view onlyRole(FORWARDER_ROLE) returns (uint256, int8, uint256) {
        return _getResult(_name);
    }

    /**
     * @dev internal function to check the signature of the result
     * @param merkleRoot The root of the Merkle tree
     * @param signature The signature for the result
     * @return validity of the signature
     */
    function _checkSignature(bytes32 merkleRoot, bytes memory signature) internal view returns (bool) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(merkleRoot)
        );

        if (
            ECDSA.recover(
                ECDSA.toEthSignedMessageHash(messageHash),
                signature
            ) != signerAddress
        ) return false;

        return true;
    }

    /**
     * @dev internal function to check the Merkle proof of the result
     * @param result The decoded result
     * @param merkleRoot The root of the Merkle tree
     * @param proof The Merkle proof for the result
     */
    function _checkMerkle(
        Value memory result, 
        bytes32 merkleRoot, 
        bytes32[] memory proof
    ) internal pure returns (bool) {
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(result)))
        );
        if (!MerkleProof.verify(proof, merkleRoot, leaf)) return false;

        return true;
    }

    /**
     * @dev internal function where using the hash of collection name, clients can query the
     * result of that collection
     * @param _name bytes32 hash of the collection name
     * @return result of the collection and its power
     */
    function _getResult(
        bytes32 _name
    ) internal view returns (uint256, int8, uint256) {
        Value memory result = _collectionResults[_name];
        if (result.value == 0) revert ZeroResult();
        return (result.value, result.power, result.lastUpdatedTimestamp);
    }
}
