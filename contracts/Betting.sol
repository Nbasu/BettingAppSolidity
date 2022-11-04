//SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;
import "hardhat/console.sol";

contract Betting{

    address payable[] public players;
    address public owner;


    constructor(){
        owner = msg.sender;
    }

    function deposit() external payable{
      //  require(msg.value == 1 ether);
        players.push(payable(msg.sender));
    }

    function getBalance() public view returns(uint){
        require(msg.sender == owner,"You are not the owner");
        return address(this).balance;
    }

    function random() internal view returns(uint){
       return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players.length)));
    }


    function pickWinner() public{

        require(msg.sender == owner);
        require (players.length >= 2);

        uint r = random();
        address payable winner;

        uint index = r % players.length;

        winner = players[index];
        console.log("The winner is :", winner);
        winner.transfer(getBalance());
        players = new address payable[](0);
    }

}
