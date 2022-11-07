
let provider = new ethers.providers.Web3Provider(window.ethereum)
let signer
const ContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const ContractAbi =  [
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
      "outputs": [],
      "stateMutability": "nonpayable",
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
    }
  ]
// 1. Connect Metamask with Dapp
async function connectMetamask() {
    const loginButton = document.getElementById('loginButton')
    const userWallet = document.getElementById('userWallet')
    const userAdd = document.getElementById('userAdd')
    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();
    let Signeraddress = await signer.getAddress(); 
    console.log("Account addressss:", Signeraddress);
    userAdd.innerText = Signeraddress;
     loginButton.innerText = 'SignOut'
    
     const balance = await signer.getBalance()
     const convertToEth = 1e18;
     const acc_bal = balance.toString() / convertToEth
     console.log("account's balance in ether:", acc_bal);
     userWallet.innerText = acc_bal;                              
      loginButton.removeEventListener('click', connectMetamask)
      setTimeout(() => {
        loginButton.addEventListener('click', signOutOfMetaMask)
      }, 200)
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


async function readDataFromSmartContract() {

    const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, provider);
    
    const name = await usdtContract.name()
    const symbol = await usdtContract.symbol()
    const decimals = await usdtContract.decimals()
    const totalSupply = await usdtContract.totalSupply()
    const myBalance = await usdtContract.balanceOf("0x06214f2E1e1896739D92F3526Bd496DC028Bd7F9")

    console.log(`name = ${name}`)
    console.log(`symbol = ${symbol}`)
    console.log(`decimals = ${decimals}`)
    console.log(`totalSupply = ${totalSupply / 1e6 }`)
    console.log(`myBalance = ${myBalance / 1e6}`)
}


// 6. Call function on smart contract and wait for it to finish (to be mined)NB
async function readSmartContract() {
  //  const UpdatedBal = document.getElementById('UpdatedBal');
    const getval = $('#sendEther').val();
    alert(getval);
    const myContract = new ethers.Contract(ContractAddress, ContractAbi, provider);

    const options = {value: ethers.utils.parseEther(getval)}

    const txResponse = await myContract.connect(signer).deposit(options)

    await txResponse.wait()

    const balance = await myContract.getBalance()
    let bal = balance.toString();
    console.log(`balance = ${balance.toString()}`)
    alert('updatedbalance');
    alert(bal);
    $('h4#UpdatedBal').text(bal);
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
    alert('Total balance');
    alert(bal);
   // console.log('1st player',p1);

}

async function getPlayers() {
    const myContract = new ethers.Contract(ContractAddress, ContractAbi, provider);

    let p1 = await myContract.players(0);
    let players = p1.toString();
    console.log('1st player'+players);
   // console.log('Total Players',myContract.players.length())

    
    

}

// 7. Emit event and Print out the event immediately after being emmited
async function emitAnEvent() {
    const numberContractAddress = "0xf1f3298bc741a5801ac08f2be84f822de2312c97";

    const numberContractAbi = [
        "function emitAnEvent() external",
    ];

    const numberContract = new ethers.Contract(numberContractAddress, numberContractAbi, provider);

    const tx = await numberContract.connect(signer).emitAnEvent()
    const txReceipt = await tx.wait()

    console.log("event was emmited")

    console.log(txReceipt.events[0])
}

// 8. Listen for events being emmited in the background
// listening for an event to be emitted, and to do a task based on that.

async function listenToEvents() {
    // Subscribe to event calling listener when the event occurs.
    const numberContractAddress = "0xb2f3ebf53ad585ccaefeb4960ff54329ebf2007a";
    const numberContractAbi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "randomNumber",
                    "type": "uint256"
                }
            ],
            "name": "MyEvent",
            "type": "event"
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
            "name": "emitAnEvent",
            "outputs": [],
            "stateMutability": "nonpayable",
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
            "name": "incrementNumber",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "number",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    // The Contract object
    const numberContract = new ethers.Contract(numberContractAddress, numberContractAbi, provider);

    numberContract.on("MyEvent", (from, number) => {
        console.log(`address emiting the event = ${from}`)
        console.log(`number from event = ${number}`)
    })
}

async function sendEtherWhenCallingFunction() {
    const numberContractAddress = "0xb2f3ebf53ad585ccaefeb4960ff54329ebf2007a";
    const numberContractAbi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "randomNumber",
                    "type": "uint256"
                }
            ],
            "name": "MyEvent",
            "type": "event"
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
            "name": "emitAnEvent",
            "outputs": [],
            "stateMutability": "nonpayable",
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
            "name": "incrementNumber",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "number",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    // The Contract object
    const numberContract = new ethers.Contract(numberContractAddress, numberContractAbi, provider);

    const options = {value: ethers.utils.parseEther("0.005")}

    const txResponse = await numberContract.connect(signer).deposit(options)

    await txResponse.wait()

    const balance = await numberContract.getBalance()
    console.log(`balance = ${balance.toString()}`)
}


async function readFromSCOnctractStorage() {
    const storageSlot = 0 // 1 means 2 storage slot because we are starting from 0
    const contractAddress = "0x9d6F5181065e3beD0e29de393165b43B7fF9E33B"
    const data = await provider.getStorageAt(contractAddress, storageSlot);
    console.log(data)
}