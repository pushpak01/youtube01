// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UserProfileDebug {
    struct Profile {
        string storjProfileUrl;
        bytes32 legalNameHash;
        bool legalNameChanged;
        uint256 createdAt;
        uint256 nonce;
    }

    mapping(address => Profile) public profiles;
    mapping(string => address) public nicknameToAddress;

    event ProfileCreated(address indexed user, string storjUrl, uint256 timestamp);
    event Debug(string message, bytes32 data, address addr);
    event DebugMessage(string message);
    event DebugHash(bytes32 hash);
    event DebugSignature(bytes32 r, bytes32 s, uint8 v, address recovered);

    function createProfile(
        string calldata storjUrl,
        bytes32 legalNameHash,
        string calldata nickname,
        bytes calldata signature
    ) external {
        emit Debug("Starting profile creation", legalNameHash, msg.sender);

        // Check if profile already exists
        if (profiles[msg.sender].createdAt != 0) {
            emit Debug("Profile already exists", 0, msg.sender);
            revert("Profile already exists");
        }

        // Check if nickname is taken
        if (nicknameToAddress[nickname] != address(0)) {
            emit Debug("Nickname taken", 0, msg.sender);
            revert("Nickname taken");
        }

        // Create the EXACT message that frontend signs
        string memory message = string(abi.encodePacked(
            "Create Profile - ",
            storjUrl,
            " - ",
            toHexString(legalNameHash),
            " - ",
            nickname,
            " - ",
            toHexString(msg.sender)
        ));

        emit DebugMessage(message);

        // Hash the message (same as frontend's ethers.hashMessage)
        bytes32 messageHash = keccak256(abi.encodePacked(message));
        emit DebugHash(messageHash);

        // Create Ethereum signed message hash (EIP-191)
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n", uintToString(bytes(message).length), message)
        );
        emit DebugHash(ethSignedMessageHash);

        // Split signature
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        emit DebugSignature(r, s, v, address(0));

        // Recover signer
        address recovered = ecrecover(ethSignedMessageHash, v, r, s);
        emit DebugSignature(r, s, v, recovered);

        if (recovered != msg.sender) {
            emit Debug("Invalid signature", 0, msg.sender);
            revert("Invalid signature");
        }

        // Create profile
        profiles[msg.sender] = Profile({
            storjProfileUrl: storjUrl,
            legalNameHash: legalNameHash,
            legalNameChanged: false,
            createdAt: block.timestamp,
            nonce: 0
        });

        nicknameToAddress[nickname] = msg.sender;
        emit ProfileCreated(msg.sender, storjUrl, block.timestamp);
    }

    // Helper function to convert uint to string
    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function toHexString(bytes32 data) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(66); // 0x + 64 chars
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 32; i++) {
            str[2+i*2] = alphabet[uint8(data[i] >> 4)];
            str[3+i*2] = alphabet[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }

    function toHexString(address addr) internal pure returns (string memory) {
        bytes20 addrBytes = bytes20(addr);
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42); // 0x + 40 chars
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(addrBytes[i] >> 4)];
            str[3+i*2] = alphabet[uint8(addrBytes[i] & 0x0f)];
        }
        return string(str);
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
        // Handle EIP-155 and legacy v values
        if (v < 27) {
            v += 27;
        }
        require(v == 27 || v == 28, "Invalid signature v value");
    }

    function profileExists(address user) external view returns (bool) {
        return profiles[user].createdAt > 0;
    }

    function getProfile(address user) external view returns (Profile memory) {
        return profiles[user];
    }

    function testMessage(
        string calldata storjUrl,
        bytes32 legalNameHash,
        string calldata nickname
    ) external view returns (string memory) {
        return string(abi.encodePacked(
            "Create Profile - ",
            storjUrl,
            " - ",
            toHexString(legalNameHash),
            " - ",
            nickname,
            " - ",
            toHexString(msg.sender)
        ));
    }

    // Test function to verify signature recovery
    function testSignatureRecovery(
        string calldata message,
        bytes calldata signature
    ) external view returns (address recovered) {
        bytes32 messageHash = keccak256(abi.encodePacked(message));
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n", uintToString(bytes(message).length), message)
        );

        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        recovered = ecrecover(ethSignedMessageHash, v, r, s);
        return recovered;
    }
}