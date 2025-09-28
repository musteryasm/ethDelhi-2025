// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Contest {
    address public owner;

    struct ContestInfo {
        string name;
        uint256 stakeAmount;
        uint256 startTime;
        uint256 endTime;
        uint256 maxParticipants;
        uint256 minParticipants;
        address[] participants;
        bool rewardsDistributed;
        mapping(address => bool) hasJoined;
    }

    mapping(uint256 => ContestInfo) private contests;
    uint256 public contestCount;

    event ContestCreated(uint256 indexed contestId, string name);
    event ParticipantJoined(uint256 indexed contestId, address participant);
    event RewardsDistributed(uint256 indexed contestId);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function createContest(
        string memory _name,
        uint256 _stakeAmount,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxParticipants,
        uint256 _minParticipants
    ) external onlyOwner {
        // require(_startTime < _endTime, "Invalid time range");
        // require(_minParticipants > 0, "Min participants must be > 0");
        // require(_maxParticipants >= _minParticipants, "Max must be >= min");

        contestCount++;
        ContestInfo storage c = contests[contestCount];
        c.name = _name;
        c.stakeAmount = _stakeAmount;
        c.startTime = _startTime;
        c.endTime = _endTime;
        c.maxParticipants = _maxParticipants;
        c.minParticipants = _minParticipants;

        emit ContestCreated(contestCount, _name);
    }

    function joinContest(uint256 contestId) external payable {
        // require(contestId > 0 && contestId <= contestCount, "Invalid contest");
        ContestInfo storage c = contests[contestId];
        // require(block.timestamp >= c.startTime, "Contest not started");
        // require(block.timestamp < c.endTime, "Contest ended");
        // require(msg.value == c.stakeAmount, "Incorrect stake");
        // require(!c.hasJoined[msg.sender], "Already joined");
        // require(c.participants.length < c.maxParticipants, "Contest full");

        c.participants.push(msg.sender);
        c.hasJoined[msg.sender] = true;

        emit ParticipantJoined(contestId, msg.sender);
    }

    function distributeRewards(
        uint256 contestId,
        address winner1,
        address winner2,
        address winner3
    ) external onlyOwner {
        // require(contestId > 0 && contestId <= contestCount, "Invalid contest");
        ContestInfo storage c = contests[contestId];
        // require(block.timestamp > c.endTime, "Contest still active");
        // require(!c.rewardsDistributed, "Already distributed");
        // require(
        //     c.participants.length >= c.minParticipants,
        //     "Not enough participants"
        // );

        // require(c.hasJoined[winner1], "Winner1 not participant");
        // require(c.hasJoined[winner2], "Winner2 not participant");
        // require(c.hasJoined[winner3], "Winner3 not participant");

        uint256 total = c.participants.length * c.stakeAmount;
        // require(total > 0, "No funds");
        // require(
        //     address(this).balance >= total,
        //     "Insufficient contract balance"
        // );

        c.rewardsDistributed = true;

        uint256 firstPrize = (total * 40) / 100;
        uint256 secondPrize = (total * 30) / 100;
        uint256 thirdPrize = (total * 20) / 100;
        uint256 adminCut = total - (firstPrize + secondPrize + thirdPrize); // 10%

        // Using call to send Ether and prevent reentrancy
        (bool sent1, ) = payable(winner1).call{value: firstPrize}("");
        require(sent1, "Failed to send reward to winner1");

        (bool sent2, ) = payable(winner2).call{value: secondPrize}("");
        require(sent2, "Failed to send reward to winner2");

        (bool sent3, ) = payable(winner3).call{value: thirdPrize}("");
        require(sent3, "Failed to send reward to winner3");

        (bool sentOwner, ) = payable(owner).call{value: adminCut}("");
        require(sentOwner, "Failed to send admin cut");

        emit RewardsDistributed(contestId);
    }

    function getParticipants(
        uint256 contestId
    ) external view returns (address[] memory) {
        require(contestId > 0 && contestId <= contestCount, "Invalid contest");
        return contests[contestId].participants;
    }

    function isParticipant(
        uint256 contestId,
        address user
    ) external view returns (bool) {
        require(contestId > 0 && contestId <= contestCount, "Invalid contest");
        return contests[contestId].hasJoined[user];
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}