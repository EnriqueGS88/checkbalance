// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Editorial is ERC1155, Ownable, Pausable, ReentrancyGuard, AccessControl {
    string baseUri = "https://www.realestatechain.es/api/item/";
    uint256 public constant DOESNT_EXIST = 1;
    uint256 public constant EXISTS = 2;
    address private _owner = msg.sender;

    using Counters for Counters.Counter;
    Counters.Counter private _bookAutoId;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /**
        * @dev The Struct REATData stores all metadata for every token
        * @param REATid acts as the tokenID in the standard ERC-1155
        * @param idCatastr is the property id provided by the Catastro office
        * @param hashJsonToken created by doing keccak256 on json of property metadata
        * @param hashJsonDoc created by doing keccak256 on json of all docs submitted at Catastro office    
        * @param exists replaced "bool" with "uint128" because it consumes 5k less gas
        * @notice "exists" is initialized with 1 instead of 0 to save 20k gas
     */
    struct BookData {
        uint256 bookId;
        string hashJsonToken;
    }

    /**
        * @dev a mapping to index all BookData structs created in the contract
     */
    mapping(uint256 => BookData) public bookdata;

    /**
     * @dev Constructor of the classs
     * @param admins variable passed as array of admin addresses
     */
    constructor (address[] memory admins)
        ERC1155("https://www.editorial.es/api/item/{id}.json")
    {   
        for (uint256 i = 0; i < admins.length; ++i) {
            _setupRole(ADMIN_ROLE, admins[i]);
        }        
        if (admins.length == 0) _setupRole(ADMIN_ROLE, msg.sender); // add owner to admins role
    }

    /**
     * @dev Function to add an address to ADMIN_ROLE
     * @param newAdmin variable passed as address
     */
    function addAdmin(address newAdmin) public nonReentrant {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _setupRole(ADMIN_ROLE, newAdmin);
    }

    /**
     * @dev Function to know if an address is ADMIN_ROLE
     * @param addr variable passed as address
     */
    function isAdmin(address addr) public view returns(bool) {
        return hasRole(ADMIN_ROLE, addr);
    }

    /**
        * @dev updateMasterUri() sets a new URI for the token type passed as argument
        * @dev where is the OWNER defined ?
        * @param uri_ is the ID that will be set for the token type
        * @notice a new token type is created for every single property
        * @notice inherited modifier "nonReentrant" from ReentrancyGuard contract
     */
    function updateMasterUri(string memory uri_) public onlyOwner nonReentrant {
        _setURI(uri_);
    }


    /**
        * @dev Function to get the URI by passing the tokenId
        * @param _tokenId variable passed to assign the ID, that is the token type 
        * @notice it takes the base URI and concatenates the _tokenId and adds ".json" in the end
     */
    function getUri(uint256 _tokenId) public view returns(string memory) {
        return string(
            abi.encodePacked(
                baseUri,
                Strings.toString(_tokenId),
                ".json"
            )
        );
    
    }
    
    /**
      * @dev addBook() mints the token and updates the token counter
      * @param _hashJsonToken is the keccak256 of the property metadata
      * @notice why are we passing the parameters as calldata ?
      * @notice token minted with URI property "hashJsonDoc" empty. It'll be added later on
      * @return ID of the struct BookData that got created/updated
     */
    function addBook(
        string calldata _hashJsonToken
    ) public nonReentrant returns (uint256) {
        // Only admins can mint
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _bookAutoId.increment();
        uint256 newBookId = _bookAutoId.current();
        _mint(msg.sender, newBookId, 1, "");

        bookdata[newBookId] = BookData(
            newBookId,
            _hashJsonToken
        );
        return newBookId;
    }

    /**
     * @dev supports interface that needs to be overriden
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
}
