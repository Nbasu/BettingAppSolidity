
let provider = new ethers.providers.Web3Provider(window.ethereum)
let signer
const ContractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const ContractAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
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
		"inputs": [],
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
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
				"name": "player",
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
]
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



//  Call function on smart contract and wait for it to finish (to be mined)NB
async function readSmartContract() {
  //  const UpdatedBal = document.getElementById('UpdatedBal');
    const getval = $('#sendEther').val();
    //alert(getval);
    const myContract = new ethers.Contract(ContractAddress, ContractAbi, provider);

    const options = {value: ethers.utils.parseEther(getval)}

    const txResponse = await myContract.connect(signer).deposit(options)

    await txResponse.wait()

    ////const balance = await myContract.getBalance()
   // let bal = balance.toString();
  //  console.log(`balance = ${balance.toString()}`)
    alert('balance updated successfuly');
   // alert(bal);
   $('#sendEther').val('');
  //  const tx = await Contract.transfer("0x2546BcD3c84621e976D8185a91A922aE77ECEc30", "500000000")
   //const tx = await usdcContract.transfer(receiver, amount, { gasPrice: 20e9 });
  // console.log(`Transaction hash: ${tx.hash}`);
    /*const txResponse = await numberContract.connect(signer).incrementNumber()
    await txResponse.wait()
    number = await numberContract.number()
    console.log("updated number = ", number.toString())*/

}

async function totalBalance(){

    const myContract = new ethers.Contract(ContractAddress, ContractAbi, provider);
    let p1 = await myContract.getBalance();
    let bal = p1.toString();
    $('h3#updatedBal').text(bal);
   // console.log('1st player',p1);

}

async function getPlayers() {
  //  alert('Inside')
    const myContract = new ethers.Contract(ContractAddress, ContractAbi, provider);
    let length = await myContract.totalPlayers();
   // alert(length);
    $('#totalPlayers').html('');
    let details = '';
    for (let index = 0; index < length; index++) {
        let p1 = await myContract.players(index);
        //alert(p1);
        details += p1.toString()+'<br>';
    }
   
    //let players = p1.toString();
    console.log('details player'+details);
    let dhtml = 'Total participants = '+length;
    $('p#totalPlayers').html(dhtml);
    $('#playerDetail').html(details)
   // console.log('Total Players',myContract.players.length())
}

async function next(){


	$('#loginButton').hide();
}

async function pickWinner(){

    const myContract = new ethers.Contract(ContractAddress, ContractAbi, provider);
    const txResponse = await myContract.pickWinner();
    let winner = 'The winner is = '+ txResponse.player + ' and total prize money '+txResponse.amt;
	$('#receiver_add').val(txResponse.player);
	$('#receiver_amt').val(txResponse.amt);
    $('h3#WinnerDetails').text(winner);
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
	} catch (error) {
		console.log('errrrr',error)
	}
    
    

}