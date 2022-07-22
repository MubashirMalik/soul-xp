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
        return true;
    }

    /** 
    * @dev Returns count of SBT issued by the caller (company)
    */
    function getCountIssued() external view returns (uint) {
        return countIssued[msg.sender];
    }
}