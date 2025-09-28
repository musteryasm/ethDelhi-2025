// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./FitnessAppToken.sol";

contract FitnessBetting {
    FitnessAppToken public token;
    address public platform;
    
    struct Profile {
        uint256 id;
        string name;
        bool exists;
    }

    mapping(uint256 => Profile) public profiles;
    mapping(uint256 => mapping(address => uint256)) public bets; // profileId => user => amount
    mapping(address => uint256) public rewards;
    
    uint256[] public profileIds;

    constructor(address _token) {
        token = FitnessAppToken(_token);
        platform = msg.sender;
    }

    function addProfile(uint256 profileId, string calldata name) external {
        require(msg.sender == platform, "Only platform can add profile");
        require(!profiles[profileId].exists, "Profile exists");
        profiles[profileId] = Profile(profileId, name, true);
        profileIds.push(profileId);
    }

    function placeBet(uint256 profileId, uint256 amount) external {
        require(profiles[profileId].exists, "Invalid profile");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        bets[profileId][msg.sender] += amount;
    }

    // Called by backend/admin with winner profileId after competition ends
    function settle(uint256 winnerProfileId) external view{ 
        require(msg.sender == platform, "Only platform can settle");
        require(profiles[winnerProfileId].exists, "Invalid winner");

        // uint256 totalPool = 0;
        // uint256 winnerPool = 0;

        for(uint i = 0; i < profileIds.length; i++) {
            // uint256 pid = profileIds[i];
            // sum bets for all profiles
            // sum bets for winner profile
            // For gas optimization in real complex contracts, consider off-chain summation or events.
        }

        // For each bettor on winner profile, calculate 50% of total pool distributed proportional to their bet
        // 25% to winner (profile owner), 25% to platform
        // This is a simplified example: payout and actual distribution would require tracking bettors more systematically.
    }

    // Platform withdraw function for its 25%
    function withdrawPlatform(uint256 amount) external {
        require(msg.sender == platform, "Only platform");
        token.transfer(platform, amount);
    }
}
