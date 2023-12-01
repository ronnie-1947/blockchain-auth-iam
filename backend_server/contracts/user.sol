// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

contract User {
  // Structure to represent user data
  struct UserData {
    string name;
    string email;
    string publicKey;
  }

  // Mapping to store user data by user address
  mapping(address => UserData) public users;

  // Event emitted when a new user is added
  event UserAdded(address indexed userAddress, string name, string email, string publicKey);

  // Event emitted when user data is updated
  event UserUpdated(address indexed userAddress, string name, string email);

  // Event emitted when public key is updated
  event PublicKeyUpdated(address indexed userAddress, string publicKey);

  // Function to add a new user
  function addUser(string memory _name, string memory _email, string memory _publicKey) external {
    require(bytes(_name).length > 0, "Name cannot be empty");
    require(bytes(_email).length > 0, "Email cannot be empty");

    users[msg.sender] = UserData(_name, _email, _publicKey);
    emit UserAdded(msg.sender, _name, _email, _publicKey);
  }

  // Function to get user data
  function getUserPublicKey(
    address _userAddress
  ) external view returns (string memory) {
    return users[_userAddress].publicKey;
  }
  function getUserName(
    address _userAddress
  ) external view returns (string memory) {
    return users[_userAddress].name;
  }
  function getUserEmail(
    address _userAddress
  ) external view returns (string memory) {
    return users[_userAddress].email;
  }

  // Function to update user data (name and email)
  function updateUserData(string memory _name, string memory _email) external {
    require(bytes(_name).length > 0, "Name cannot be empty");
    require(bytes(_email).length > 0, "Email cannot be empty");

    users[msg.sender].name = _name;
    users[msg.sender].email = _email;
    emit UserUpdated(msg.sender, _name, _email);
  }

  // Function to update public key
  function updatePublicKey(string memory _publicKey) external {
    require(bytes(_publicKey).length > 0, "Public key cannot be empty");

    users[msg.sender].publicKey = _publicKey;
    emit PublicKeyUpdated(msg.sender, _publicKey);
  }
}
