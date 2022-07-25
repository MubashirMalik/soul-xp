// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SBT {

    struct SkillSBT {
        uint id;
        string name;
        uint8 issueDay;
        uint8 issueMonth;
        uint16 issueYear;
        uint8 difficulty;
        uint8 testType;
    }

    mapping(address => mapping(address => bytes)) private pendingSBTRequests;
    mapping(address => address[]) private pendingSBTCandidate;
    mapping(address => address[]) private pendingSBTCompany;

    mapping(address => mapping(address => SkillSBT[])) private issuedSBT;

    /** 
     * @dev Tracks the count of a company's issued SBT
     * 
     * - 0 means company is not registered.
     * - 1 means company is registerd.
     * - n means company has issued n-1 SBT. 
    */
    mapping (address => uint) private countIssued;

    /** 
     * @dev Registers the caller with the contract.
     *
     * Requirements:
     *
     * - the caller (company) must not be already registered.
     */
    function registerCompany() external returns (bool) {
        if (countIssued[msg.sender] != 0) {
            return false;
        }
        countIssued[msg.sender] = 1;
        return true;
    }

    /**
     * @dev Requests a SBT from `company` for the caller's account.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Requirements:
     *
     * - `company` cannot be the zero address.
     * - `company` must be registerd with contract.
     * - the caller must not have requested the same `company` before.
     */
    function requestSBT(address company, bytes memory credentialId) external returns (bool) {
        require(company != address(0), "SBT: company address cannot be the zero address");
        require(countIssued[company] != 0, "SBT: company not registerd");

        require (pendingSBTRequests[company][msg.sender].length == 0, "SBT: request is already in pending list");

        pendingSBTRequests[company][msg.sender] = credentialId;
        pendingSBTCandidate[msg.sender].push(company);
        pendingSBTCompany[company].push(msg.sender);
        return true;
    }

    /** 
     * @dev Returns count of SBT issued by the caller (company)
     */
    function getCountIssued() external view returns (uint) {
        return countIssued[msg.sender];
    }

    /**
     * @dev Returns the Pending SBTs of the caller [Candidate]
     */
    function getPendingSBTCandidate() external view returns (bytes[] memory, address[] memory) {
        uint length = pendingSBTCandidate[msg.sender].length;
        bytes[] memory credentialIds = new bytes[](length);
        for (uint i = 0; i < length; i++) {
            credentialIds[i] = pendingSBTRequests[pendingSBTCandidate[msg.sender][i]][msg.sender];
        }
        return (credentialIds, pendingSBTCandidate[msg.sender]);
    }

    /**
     * @dev Returns the Pending SBTs of the caller [Company]
     */
    function getPendingSBTCompany() external view returns (bytes[] memory, address[] memory) {
        uint length = pendingSBTCompany[msg.sender].length;
        bytes[] memory credentialIds = new bytes[](length);
        for (uint i = 0; i < length; i++) {
            credentialIds[i] = pendingSBTRequests[msg.sender][pendingSBTCompany[msg.sender][i]];
        }
        return (credentialIds, pendingSBTCompany[msg.sender]);
    }

    /**
     * @dev Takes an address, credentialId, response and responds to the SBT
     * Request
     */
    function respondToRequest(address candidate, SkillSBT memory skillSBT, bool response) external {
        require(
            pendingSBTRequests[msg.sender][candidate].length != 0,
            "SBT: Candidate has not request the SBT"
        );
        
        if (response == true) {
            skillSBT.id = countIssued[msg.sender];
            countIssued[msg.sender]++;
            issuedSBT[msg.sender][candidate].push(skillSBT);
        }
        rejectRequest(candidate);
    }


    /**
     * @dev Removes the request from the pending requests list.
     */
    function rejectRequest(address candidate) public {
        delete pendingSBTRequests[msg.sender][candidate];
        uint length = pendingSBTCandidate[candidate].length;
        for (uint i = 0; i < length; i++) {
            if (pendingSBTCandidate[candidate][i] == msg.sender) {
                pendingSBTCandidate[candidate][i] = pendingSBTCandidate[candidate][length-1];
                pendingSBTCandidate[candidate].pop();
                break;
            }
        }

        length = pendingSBTCompany[msg.sender].length;
        for (uint i = 0; i < length; i++) {
            if (pendingSBTCompany[msg.sender][i] == candidate) {
                pendingSBTCompany[msg.sender][i] = pendingSBTCompany[msg.sender][length-1];
                pendingSBTCompany[msg.sender].pop();
                break;
            }
        }
    }
}