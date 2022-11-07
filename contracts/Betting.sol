//SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;
import "hardhat/console.sol";
//Niloy Basu
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

function totalPlayers() public view returns(uint count){
       // require(msg.sender == owner,"You are not the owner");
        return players.length;
    }
    function getBalance() public view returns(uint){
        require(msg.sender == owner,"You are not the owner");
        return address(this).balance;
    }

    function random() internal view returns(uint){
       return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players.length)));
    }


    function pickWinner() public view returns(address player,uint amt) {

        require(msg.sender == owner);
        require (players.length >= 2);
        uint amount = getBalance();
        uint r = random();
        address payable winner;

        uint index = r % players.length;

        winner = players[index];
        console.log("The winner is :", winner);
        return (winner,amount);
        //winner.transfer(getBalance());
       
    }

    function transferPrize(address payable player, uint amt)public{

        player.transfer(amt);
         players = new address payable[](0);
    }

}
