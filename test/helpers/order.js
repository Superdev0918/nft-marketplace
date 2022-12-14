const EIP712 = require("./EIP712");
const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");

function AssetType(tp, data) {
	return { tp, data }
}

function Asset(tp, assetData, amount) {
	return { assetType: AssetType(tp, assetData), amount };
}

function Order(maker, makeAsset, taker, takeAsset, salt, start, end, dataType, data) {
	return { maker, makeAsset, taker, takeAsset, salt, start, end, dataType, data };
}

const Types = {
	AssetType: [
	  { name: "tp", type: "bytes4" },
	  { name: "data", type: "bytes" },
	],
	Asset: [
	  { name: "assetType", type: "AssetType" },
	  { name: "amount", type: "uint256" },
	],
	Order: [
	  { name: "maker", type: "address" },
	  { name: "makeAsset", type: "Asset" },
	  { name: "taker", type: "address" },
	  { name: "takeAsset", type: "Asset" },
	  { name: "salt", type: "uint256" },
	  { name: "start", type: "uint256" },
	  { name: "end", type: "uint256" },
	  { name: "dataType", type: "bytes4" },
	  { name: "data", type: "bytes" },
	],
  };

async function sign(order, account, verifyingContract) {
	const chainId = Number(await web3.eth.getChainId());
	const data = EIP712.createTypeData({
		name: "NFT-Marketplace",
		version: "1",
		chainId,
		verifyingContract
	}, 'Order', order, Types);
	return (await EIP712.signTypedData(web3, account, data)).sig;
}
module.exports = { AssetType, Asset, Order, sign }