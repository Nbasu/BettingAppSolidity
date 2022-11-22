//SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.3.0 <0.9.0;
import "hardhat/console.sol";
//Niloy Basu
contract Betting{

     address public owner;

    struct LogDetails {

        address payable playeradd;
        string playerName;
        uint amount;
    }

    LogDetails[] details;
    constructor(){
        owner = msg.sender;
    }

    function mydeposit(string memory playerName) public payable{

      //  require(msg.value == 1 ether);
        details.push(LogDetails(payable(msg.sender),playerName,msg.value));

    }

    function getAllTransactions() public view returns (LogDetails[] memory) {
        return details;
    }

function totalPlayers() public view returns(uint count){
      
        return details.length;
    }
    function getBalance() public view returns(uint){
       
        return address(this).balance;
    }

function pickWinner(uint rand) public view returns(address player,uint amt) {

        uint amount = getBalance();
        address payable winner;
        winner = details[rand].playeradd;
        console.log("The winner is :", winner);
        return (winner,amount);
       
    }

    function transferPrize(address payable particip, uint amt)public{

         particip.transfer(amt);
         delete details;
       
    }

}
