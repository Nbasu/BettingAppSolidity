
let provider = new ethers.providers.Web3Provider(window.ethereum)
let signer
const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ContractAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getAllTransactions",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address payable",
						"name": "playeradd",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "playerName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"internalType": "struct Betting.LogDetails[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "playerName",
				"type": "string"
			}
		],
		"name": "mydeposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "rand",
				"type": "uint256"
			}
		],
		"name": "pickWinner",
		"outputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalPlayers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "particip",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amt",
				"type": "uint256"
			}
		],
		"name": "transferPrize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
// 1. Connect Metamask with Dapp
async function connectMetamask() {
	$('#procced').hide();
	$('div#maindiv').show();
    const loginButton = document.getElementById('loginButton')
    const userWallet = document.getElementById('userWallet')
    const userAdd = document.getElementById('userAdd')
	//$('div#procced').show();
    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();
    let Signeraddress = await signer.getAddress(); 
    console.log("Account addressss:", Signeraddress);
    userAdd.innerText = Signeraddress;
    // loginButton.innerText = 'SignOut'
    
     const balance = await signer.getBalance()
     const convertToEth = 1e18;
     const acc_bal = balance.toString() / convertToEth
     console.log("account's balance in ether:", acc_bal);
     userWallet.innerText = acc_bal;                              
	console.log(acc_bal)
}
function signOutOfMetaMask() {
    window.userWalletAddress = null
    userWallet.innerText = ''
    loginButton.innerText = 'Sign in with MetaMask'

    loginButton.removeEventListener('click', signOutOfMetaMask)
    setTimeout(() => {
      loginButton.addEventListener('click', connectMetamask                             )
    }, 200)
  }                
// 2. Get balance
async function getBalance() {
    const balance = await signer.getBalance()
    const convertToEth = 1e18;
    console.log("account's balance in ether:", balance.toString() / convertToEth);
}



async function depositEther() {
  //  const UpdatedBal = document.getElementById('UpdatedBal');
  	const pname = $('#pname').val();
    const getval = $('#sendEther').val();
    console.log(pname);
    const myContract = new ethers.Contract(ContractAddress, ContractAbi, provider);
    const options = {value: ethers.utils.parseEther(getval)}
    const txResponse = await myContract.connect(signer).mydeposit(pname,options)
    await txResponse.wait();
	swal("Deposit!", "You deposit ether in contract", "success");  
	$('#sendEther').val('');
    $('#pname').val('');
}

async function totalBalance(){

    const myContract = new ethers.Contract(ContractAddress, ContractAbi, provider);
    let p1 = await myContract.getBalance();
    let bal = p1.toString();
	bal = bal /1000000000000000000;
    $('h3#updatedBal').text(bal);
   // console.log('1st player',p1);

}

async function getPlayers() {

    const myContract = new ethers.Contract(ContractAddress, ContractAbi, provider);
	let tot_balance = await myContract.getBalance();
    let bal = tot_balance.toString();
	bal = bal /1000000000000000000;
	$('#tot_balance').html(bal);
	$('#tamount').val(bal)
   $('tbody#playerDetails').html('');
	let p1 = await myContract.getAllTransactions();
	console.log(p1[0]);
	let i=0;
	$('tbody#playerDetails').empty();
	let optin = '<option value="-1">Please Select Participants</option>';                            
	$.each(p1, function (index, value) { 
		i++;
		optin += '<option value="' + value.playeradd + '">' + value.playerName + '</option>';  
		$('tbody#playerDetails').append(
		'<tr>' +
				  '<td><p style="font-size:small;">' + i + '</p></td>' +
				  '<td><p style="font-size:small;">' + value.playerName + '</p></td>' +
				  '<td><p style="font-size:small;">' + value.playeradd + '</p></td>' +
				  '<td><p style="font-size:small;">' + (value.amount/1000000000000000000) + '</p></td>' +
				  '</tr>');
	});
    $('#tot_senders').html(i);
	console.log(optin);
	$('select#drop_senders').html(optin);
	//$('tbody#playerDetails').html(p1[0]['playerName']); 	
}

async function next(){


	$('#loginButton').hide();
}

async function transfer(){
	let amt = $('#tamount').val();
	let address = $('select#drop_senders').val()
	alert(address);
	let receiver = ethers.utils.getAddress(address);
    amt = ethers.utils.parseEther(amt);
	console.log('receuver',receiver);
	console.log('amt===',amt)
    const myContract = new ethers.Contract(ContractAddress, ContractAbi, provider);
	try {
		await myContract.connect(signer).transferPrize(receiver,amt);
	} catch (error) {
		console.log('errrrr',error)
	}

}

async function pickWinner(){

	let rand = Math.floor(Math.random()*3);
	console.log('random = ',rand);
	$('#receiver_add').val('');
    const myContract = new ethers.Contract(ContractAddress, ContractAbi, provider);
    const txResponse = await myContract.pickWinner(rand);
    let winner =  txResponse.player + ' and Prize '+(txResponse.amt)/1000000000000000000 +' ether';
	$('#receiver_add').val(txResponse.player);
	$('#receiver_amt').val(txResponse.amt);
    $('#WinnerDetails').text(winner);
    console.log('txResponse winner',txResponse);
   // let winner = await myContract.pickWinner();
   // console.log(`txResponse =`,txResponse);
}

async function transferPrize(){

	//let add = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
	let add = $('#receiver_add').val();
	let amt = $('#receiver_amt').val();
	amt = ethers.utils.formatUnits(amt,18);
    let receiver = ethers.utils.getAddress(add);
    amt = ethers.utils.parseEther(amt);
	console.log('receuver',receiver);
	console.log('amt===',amt)
    const myContract = new ethers.Contract(ContractAddress, ContractAbi, provider);
	try {
		await myContract.connect(signer).transferPrize(receiver,amt);
		swal("Winner!", "Prize transfer into account", "success");  
	} catch (error) {
		console.log('errrrr',error)
	}
    
    

}