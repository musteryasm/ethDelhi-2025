// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FitnessChallenge {
    struct Challenge {
        address user;
        uint amount;
        bool completed;
    }
    mapping(address => Challenge) public challenges;

    function joinChallenge() external payable {
        require(msg.value > 0, "Stake some ETH");
        challenges[msg.sender] = Challenge(msg.sender, msg.value, false);
    }

    function completeChallenge(address user) external {
        require(challenges[user].amount > 0, "No challenge found");
        require(!challenges[user].completed, "Already completed");
        challenges[user].completed = true;
        payable(user).transfer(challenges[user].amount);
    }
}
