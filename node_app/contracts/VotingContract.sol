 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProjectVoting {
    struct Vote {
        address voter;
        bytes32 voteHash;
        uint256 timestamp;
    }

    struct Project {
        string title;
        bytes32 projectId;
        uint256 totalVotes;
        bool isActive;
        mapping(address => bool) hasVoted;
        Vote[] votes;
    }

    mapping(bytes32 => Project) public projects;
    address public owner;

    event ProjectCreated(bytes32 indexed projectId, string title);
    event VoteCast(bytes32 indexed projectId, address indexed voter, bytes32 voteHash);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function createProject(string memory _title) public onlyOwner returns (bytes32) {
        bytes32 projectId = keccak256(abi.encodePacked(_title, block.timestamp));
        Project storage newProject = projects[projectId];
        newProject.title = _title;
        newProject.projectId = projectId;
        newProject.isActive = true;
        
        emit ProjectCreated(projectId, _title);
        return projectId;
    }

    function castVote(bytes32 _projectId, bytes32 _voteHash) public {
        Project storage project = projects[_projectId];
        require(project.isActive, "Project is not active");
        require(!project.hasVoted[msg.sender], "Already voted");

        project.hasVoted[msg.sender] = true;
        project.totalVotes++;
        
        Vote memory newVote = Vote({
            voter: msg.sender,
            voteHash: _voteHash,
            timestamp: block.timestamp
        });
        
        project.votes.push(newVote);
        emit VoteCast(_projectId, msg.sender, _voteHash);
    }

    function getProjectVotes(bytes32 _projectId) public view returns (uint256) {
        return projects[_projectId].totalVotes;
    }

    function hasVoted(bytes32 _projectId, address _voter) public view returns (bool) {
        return projects[_projectId].hasVoted[_voter];
    }
}