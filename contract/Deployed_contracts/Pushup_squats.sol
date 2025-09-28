// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Contest {
    struct ContestInfo {
        string name;
        uint256 stakeAmount;
        uint256 startTime;
        uint256 endTime;
        uint256 maxParticipants;
        uint256 minParticipants;
        address[] participants; 
        mapping(address => bool) hasJoined;
    }

    ContestInfo[] public contests;

    function createContest(
        string memory _name,
        uint256 _stakeAmount,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxParticipants,
        uint256 _minParticipants
    ) external {
        ContestInfo storage c = contests.push();
        c.name = _name;
        c.stakeAmount = _stakeAmount;
        c.startTime = _startTime;
        c.endTime = _endTime;
        c.maxParticipants = _maxParticipants;
        c.minParticipants = _minParticipants;
    }

    function joinContest(uint256 contestId) external payable {
        require(contestId < contests.length, "Invalid contest");
        ContestInfo storage c = contests[contestId];
        require(msg.value == c.stakeAmount, "Send exact stake amount");
        require(!c.hasJoined[msg.sender], "Already joined");
        require(c.participants.length < c.maxParticipants, "Max participants reached");

        c.participants.push(msg.sender);
        c.hasJoined[msg.sender] = true;
    }

    function getContests()
        external
        view
        returns (
            string[] memory names,
            uint256[] memory stakeAmounts,
            uint256[] memory startTimes,
            uint256[] memory endTimes,
            uint256[] memory maxParticipants,
            uint256[] memory minParticipants,
            uint256[] memory participantCounts
        )
    {
        uint256 len = contests.length;
        names = new string[](len);
        stakeAmounts = new uint256[](len);
        startTimes = new uint256[](len);
        endTimes = new uint256[](len);
        maxParticipants = new uint256[](len);
        minParticipants = new uint256[](len);
        participantCounts = new uint256[](len);

        for (uint256 i; i < len; i++) {
            ContestInfo storage c = contests[i];
            names[i] = c.name;
            stakeAmounts[i] = c.stakeAmount;
            startTimes[i] = c.startTime;
            endTimes[i] = c.endTime;
            maxParticipants[i] = c.maxParticipants;
            minParticipants[i] = c.minParticipants;
            participantCounts[i] = c.participants.length;
        }
    }

    function hasJoined(uint256 contestId, address participant) external view returns (bool) {
        require(contestId < contests.length, "Invalid contest");
        return contests[contestId].hasJoined[participant];
    }
}