var ABI = [{ "constant": true, "inputs": [], "name": "getIncomingRequests", "outputs": [{ "name": "", "type": "uint256[]" }, { "name": "", "type": "address[]" }, { "name": "", "type": "bytes32[]" }, { "name": "", "type": "uint256[]" }, { "name": "", "type": "uint256[]" }, { "name": "", "type": "uint256[]" }, { "name": "", "type": "bytes32[]" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "reqid", "type": "uint256" }], "name": "rejectRequest", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "reqid", "type": "uint256" }], "name": "acceptRequest", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [{ "name": "name", "type": "bytes32" }, { "name": "min_amount", "type": "uint256" }, { "name": "max_amount", "type": "uint256" }, { "name": "interest", "type": "bytes32" }], "name": "newLender", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "userId", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "duration", "type": "uint256" }, { "name": "purpose", "type": "bytes32" }], "name": "borrowRequest", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getSender", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "getAllLenders", "outputs": [{ "name": "", "type": "address[]" }, { "name": "", "type": "bytes32[]" }, { "name": "", "type": "uint256[]" }, { "name": "", "type": "uint256[]" }, { "name": "", "type": "bytes32[]" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getBorrowerName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getlenderName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "name", "type": "bytes32" }], "name": "newBorrower", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "checkAccountExists", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "reqId", "type": "uint256" }, { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }], "name": "RequestMoney", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "reqId", "type": "uint256" }, { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }], "name": "AcceptRequest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "reqid", "type": "uint256" }, { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }], "name": "RejectRequest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "reqId", "type": "uint256" }, { "indexed": false, "name": "from", "type": "address" }, { "indexed": false, "name": "data", "type": "bytes32" }], "name": "Testing", "type": "event" }];
var contractAddress = '0x1e2d54b53ddadc5ab35b4e8953f1734e5abec6ab';

var contractInstance = web3.eth.contract(ABI).at(contractAddress);
var listOfLenders = [];
var listOfRequests = [];


// Accept Borrow Request
status.command({
    name: "acceptRequest",
    title: "acceptRequest",
    description: "Accept Borrow Request - specify request Id",
    color: "#CCCCCC",
    params: [{
        name: "requestId",
        type: status.types.NUMBER,
        placeholder: 'Request',
        suggestions: borrowRequestSuggestions
    },
    {
        name: "amount",
        placeholder: 'Amount (Ether)',
        type: status.types.NUMBER
    }],
    preview: function (params) {
        var text = status.components.text(
            {
                style: {
                    marginTop: 5,
                    marginHorizontal: 0,
                    fontSize: 14,
                    fontFamily: "font",
                    color: "black"
                }
            }, acceptRequest(params));

        return { markup: status.components.view({}, [text]) };
    }
});

function acceptRequest(params) {
    return contractInstance.acceptRequest(params.requestId, { from: web3.eth.accounts[0], value: web.toWei(params.amount, 'ether') });
}

// Borrow
status.command({
    name: "borrow",
    title: "Borrow",
    description: "Borrow - specify amount, duration, purpose, lenderId",
    color: "#CCCCCC",
    sequentialParams: true,
    params: [{
        name: "amount",
        placeholder: 'Amount (Ether)',
        type: status.types.NUMBER
    },
    {
        name: "duration",
        placeholder: 'Duration (days)',
        type: status.types.NUMBER
    },
    {
        name: "purpose",
        placeholder: 'Purpose (eg. Healthcare)',
        type: status.types.TEXT
    },
    {
        name: "lenderId",
        placeholder: 'Lender',
        type: status.types.TEXT,
        suggestions: lenderSuggestions
    }],
    preview: function (params) {
        var text = status.components.text(
            {
                style: {
                    marginTop: 5,
                    marginHorizontal: 0,
                    fontSize: 14,
                    fontFamily: "font",
                    color: "black"
                }
            }, borrowAmount(params));

        return { markup: status.components.view({}, [text]) };
    }
});

function borrowAmount(params) {
    return contractInstance.borrowRequest(params.lenderId, web.toWei(params.amount, 'ether'), params.duration, params.purpose, { from: web3.eth.accounts[0] });
}


// List borrow requests
status.command({
    name: "listBorrowRequests",
    title: "ListBorrowRequests",
    description: "List all requests for loans",
    color: "#CCCCCC",
    preview: function (params) {
        var text = status.components.text(
            {
                style: {
                    marginTop: 5,
                    marginHorizontal: 0,
                    fontSize: 14,
                    fontFamily: "font",
                    color: "black"
                }
            }, getBorrowRequests());

        return { markup: status.components.view({}, [text]) };
    }
});

function getBorrowRequests() {
    var returnString = '';
    // (id,from,status,date,amount,duration,purpose)
    listOfRequests = contractInstance.getIncomingRequests({ from: web3.eth.accounts[0] });

    if (listOfRequests[0].length === 0) {
        return 'No requests found.';
    }

    listOfRequests = transposeArray(listOfRequests);

    listOfRequests.map(function (request, index) {
        returnString += 'Request: ' + (++index) + " : \n\tAmount: " + request[4] + ", \n\tDuration: " + request[5] + " days, \n\tPurpose: " + web3.toAscii(request[6]).replace(/\u0000/g, '') + ", \n\tStatus: " + web3.toAscii(request[2]).replace(/\u0000/g, '') + ", \n\tEthAccount:" + request[1] + "\n\n";
    });
    return returnString;
}


// List lenders
status.command({
    name: "listLenders",
    title: "ListLenders",
    description: "List all valid lenders for an amount",
    color: "#CCCCCC",
    sequentialParams: true,
    params: [{
        name: "amount",
        placeholder: 'Amount (Ether)',
        type: status.types.NUMBER
    }],
    preview: function (params) {
        var text = status.components.text(
            {
                style: {
                    marginTop: 5,
                    marginHorizontal: 0,
                    fontSize: 14,
                    fontFamily: "font",
                    color: "black"
                }
            }, getLenders(params));

        return { markup: status.components.view({}, [text]) };
    }
});

function getLenders(params) {
    var returnString = '';
    listOfLenders = contractInstance.getAllLenders(params.amount, { from: web3.eth.accounts[0] });

    if (listOfLenders[0].length === 0) {
        return 'No lenders found for amount: ' + params.amount;
    }

    listOfLenders = transposeArray(listOfLenders);

    listOfLenders.map(function (lender, index) {
        returnString += (++index) + ' : ' + web3.toAscii(lender[1]).replace(/\u0000/g, '') + ' , ' + web3.toAscii(lender[4]).replace(/\u0000/g, '') + ' ; ' + lender[0] + "\n\n";
    });

    return returnString;
}


// Register as Borrower
status.command({
    name: "registerAsBorrower",
    title: "RegisterBorrower",
    description: "Register as a Borrower",
    color: "#CCCCCC",
    sequentialParams: true,
    params: [{
        name: "borrowerName",
        placeholder: 'First Name',
        type: status.types.TEXT
    }],
    preview: function (params) {
        var text = status.components.text(
            {
                style: {
                    marginTop: 5,
                    marginHorizontal: 0,
                    fontSize: 14,
                    fontFamily: "font",
                    color: "black"
                }
            }, registerAsBorrower(params));

        return { markup: status.components.view({}, [text]) };
    }
});

function registerAsBorrower(params) {
    return contractInstance.newBorrower.sendTransaction(params.borrowerName, { from: web3.eth.accounts[0] });
}

// Register as Lender
status.command({
    name: "registerAsLender",
    title: "RegisterLender",
    description: "Register as a Lender",
    color: "#CCCCCC",
    sequentialParams: true,
    params: [{
        name: "lenderName",
        placeholder: 'First name',
        type: status.types.TEXT
    },
    {
        name: "minAmount",
        placeholder: 'Min lending amount(Eth)',
        type: status.types.NUMBER
    },
    {
        name: "maxAmount",
        placeholder: 'Max lending amount(Eth)',
        type: status.types.NUMBER
    },
    {
        name: "interestRate",
        placeholder: 'Interest Rate',
        type: status.types.TEXT
    }],
    preview: function (params) {
        var text = status.components.text(
            {
                style: {
                    marginTop: 5,
                    marginHorizontal: 0,
                    fontSize: 14,
                    fontFamily: "font",
                    color: "black"
                }
            }, registerAsLender(params));

        return { markup: status.components.view({}, [text]) };
    }
});

function registerAsLender(params) {
    var name = params.lenderName;
    var min = parseInt(params.minAmount);
    var max = parseInt(params.maxAmount);
    var interestRate = params.interestRate + '%'; // cannot pass only digits; fuck status
    return contractInstance.newLender.sendTransaction(name, min, max, interestRate, { from: web3.eth.accounts[0] });
}


// load app
status.addListener("init", function (params, context) {
    var result = {
        err: null,
        data: null,
        messages: []
    };
    try {
        result["text-message"] = 'Hi there!';
    } catch (e) {
        result.err = e;
    }
    return result;
});

// unknown text
status.addListener("on-message-send", function (params, context) {
    var result = {
        err: null,
        data: null,
        messages: []
    };
    try {
        result["text-message"] = 'Sorry, I didn\'t get that!';
    } catch (e) {
        result.err = e;
    }
    return result;
});

// helpers
function borrowRequestSuggestions() {
    var suggestions = listOfRequests.map(function (request, index) {
        return status.components.touchable(
            { onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT, [0, request[0] + ' ' + request[4]]]) },
            status.components.view(
                suggestionsContainerStyle,
                [status.components.view(
                    suggestionSubContainerStyle,
                    [
                        status.components.text(
                            { style: valueStyle },
                            'Req Id : ' + request[0] + ' ; Amount : ' + request[4] + ' ; Duration : ' + request[5] + ' days'
                        )
                    ]
                )]
            )
        );
    });

    // Let's wrap those two touchable buttons in a scrollView
    var view = status.components.scrollView(
        suggestionsContainerStyle(2),
        suggestions
    );

    // Give back the whole thing inside an object.
    return { markup: view };
}


function lenderSuggestions() {
    var suggestions = listOfLenders.map(function (lender, index) {
        return status.components.touchable(
            { onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT, [3, lender[0]]]) },
            status.components.view(
                suggestionsContainerStyle,
                [status.components.view(
                    suggestionSubContainerStyle,
                    [
                        status.components.text(
                            { style: valueStyle },
                            'Lender : ' + (index + 1) + ' ; Rate : ' + web3.toAscii(lender[4]).replace(/\u0000/g, '') + ' ; EthAccount : ' + lender[0]
                        )
                    ]
                )]
            )
        );
    });

    // Let's wrap those two touchable buttons in a scrollView
    var view = status.components.scrollView(
        suggestionsContainerStyle(2),
        suggestions
    );

    // Give back the whole thing inside an object.
    return { markup: view };
}

function suggestionsContainerStyle(suggestionsCount) {
    return {
        marginVertical: 1,
        marginHorizontal: 0,
        keyboardShouldPersistTaps: "always",
        height: Math.min(150, (56 * suggestionsCount)),
        backgroundColor: "white",
        borderRadius: 5,
        flexGrow: 1
    };
}

var suggestionSubContainerStyle = {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#0000001f"
};

function transposeArray(arr) {
    return arr[0].map(function (col, i) {
        return arr.map(function (row) {
            return row[i];
        });
    });
}

var valueStyle = {
    marginTop: 9,
    fontSize: 14,
    fontFamily: "font",
    color: "#000000de"
};