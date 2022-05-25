// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/utils/Counters.sol";

contract ShopChain {

	using Counters for Counters.Counter;

	/**
	 *  STATES FLOW:
	 *  - created
	 *  - confirmed IFF created
	 *  - deleted IFF created
	 *  - refundAsked IFF created || confirmed
	 *  - refunded IFF refundAsked
	 */
	enum State { 
		created,
		shipped,
		confirmed,
		deleted,
		refundAsked,
		refunded
	}

    struct Log {
        State state;
		uint256 timestamp;
    }

	struct Order {
		uint256 id;
		address payable buyer;
		address payable seller;
		uint256 amount;
		State state;
	}

	/***********************************
	 ****** CUSTOM PARAMETERS END ******
	 ***********************************/

	address public immutable contractAddress = address(this);
	address public immutable owner;

	Counters.Counter private totalSellers;
	Counters.Counter private totalOrders;

	mapping(uint256 => Order) private orders;
	mapping(address => bool) private buyers;
	mapping(address => bool) private sellers;
	mapping(uint256 => address) private sellersIterable;
	mapping(address => uint[]) private ordersBuyers;
	mapping(address => uint[]) private ordersSellers;
	mapping(uint256 => Log[]) private logs;

    modifier onlyOwner {
		require(
            msg.sender == owner,
            "ERROR: Only the owner of this smart contract can perform this action."
        );
		_;
	}

	modifier orderExists(uint256 orderId) {
		require(
            orderId <= totalOrders.current(),
            "ERROR: This order does not exist."
        );
		_;
	}

	modifier sellerExists(address seller) {
		require(
			sellers[seller], 
			"ERROR: This seller isn't registered in our platform."
		);
		_;
	}

	modifier sellerIsOwner(uint256 orderId) {
		require(
            orders[orderId].seller == msg.sender,
            "ERROR: You're not the seller of this order."
        );
		_;
	}

	modifier buyerIsOwner(uint256 orderId) {
		require(
            orders[orderId].buyer == msg.sender,
            "ERROR: You're not the buyer of this order."
        );
		_;
	}

	event OrderCreated(Order);
	event OrderConfirmed(Order);
	event OrderDeleted(Order);
	event OrderShipped(Order);
	event RefundAsked(Order);
	event OrderRefunded(Order);
	event SellerRegistered(address);
	event DataFeedSet(address);

	constructor() {
		owner = msg.sender;
	}

    /**************************
	 ***** MAIN FUNCTIONS *****
	 **************************/

    /**
     *  The buyer makes an order and sends his funds to the smart contract (inside the object Order)
     */
	function createOrder(address payable seller, uint256 amount)
		external
		payable
		sellerExists(seller)
	{
		require(
			amount > 0 && msg.value > 0, 
			"ERROR: The order amount can't be null."
		);

		address payable buyer = payable(msg.sender);
		if (!buyers[buyer]) {
			buyers[buyer] = true;
		}
		uint256 orderId = totalOrders.current();
		logs[orderId].push(
			Log(State.created, block.timestamp)
		);
		Order memory newOrder = Order(orderId, buyer, seller, amount, State.created);
		orders[orderId] = newOrder;
		ordersBuyers[buyer].push(orderId);
		ordersSellers[seller].push(orderId);
		totalOrders.increment();
		emit OrderCreated(newOrder);
	}

	/*
	 *	The buyer confirms the specified order, and the smart contract 
	 *  sends the funds (from the object orderToConfirm) to the seller.
	 */
	function shipOrder(uint256 orderId) external orderExists(orderId) sellerIsOwner(orderId) {
		Order memory orderToShip = orders[orderId];
		require(
			orderToShip.state == State.created, 
			"ERROR: You can't ship this order."
		);
		orderToShip.state = State.shipped;
		orders[orderId] = orderToShip;
		emit OrderShipped(orderToShip);
		logs[orderId].push(
			Log(State.shipped, block.timestamp)
		);
	}

	/*
	 *	The buyer confirms the specified order, and the smart contract 
	 *  sends the funds (from the object orderToConfirm) to the seller.
	 */
	function confirmOrder(uint256 orderId) external orderExists(orderId) buyerIsOwner(orderId) {
		Order memory orderToConfirm = orders[orderId];
		require(
			orderToConfirm.state == State.shipped, 
			"ERROR: You can't confirm this order."
		);
		uint256 amount = orderToConfirm.amount;
		address payable seller = orderToConfirm.seller;
		orderToConfirm.state = State.confirmed;
		orders[orderId] = orderToConfirm;
		emit OrderConfirmed(orderToConfirm);
		logs[orderId].push(
			Log(State.confirmed, block.timestamp)
		);
    	seller.transfer(amount);
	}

	/*
	 *	The seller can delete the order if it's not been already confirmed
	 *	Money goes from contract to buyer
	 */
	function deleteOrder(uint256 orderId) external orderExists(orderId) sellerIsOwner(orderId) {
		Order memory orderToDelete = orders[orderId];
		require(
			orderToDelete.state == State.created || orderToDelete.state == State.shipped,
			"ERROR: You can't delete this order."
		);	
		uint256 amount = orderToDelete.amount;
		orderToDelete.state = State.deleted;
		orders[orderId] = orderToDelete;
		emit OrderDeleted(orderToDelete);
		logs[orderId].push(
			Log(State.deleted, block.timestamp)
		);
    	orderToDelete.buyer.transfer(amount);
	}

	/*
	 *	The buyer can ask for a refund. IF:
	 *	- confirmed: money from the seller to the buyer;
	 *	- not confirmed: money from the smart contract to the buyer, immediately;
	 */
	function askRefund(uint256 orderId) external orderExists(orderId) buyerIsOwner(orderId) {
		Order memory orderToAskRefund = orders[orderId];
		require(
			orderToAskRefund.state == State.created || 
			orderToAskRefund.state == State.shipped ||
			orderToAskRefund.state == State.confirmed,
			"ERROR: You can't ask refund for this order."
		);
		// if order has just been created and user wants a refund, he gets it instantly
		if (orderToAskRefund.state == State.created) {
			orderToAskRefund.state = State.refunded;
			orders[orderId] = orderToAskRefund;
			emit OrderRefunded(orderToAskRefund);
			logs[orderId].push(
				Log(State.refundAsked, block.timestamp)
			);
			logs[orderId].push(
				Log(State.refunded, block.timestamp)
			);
    		
            orderToAskRefund.buyer.transfer(orderToAskRefund.amount);
		} else {	// else, it can be a shipped/confirmed order so seller has to refund the buyer later with refundBuyer(_orderID)
			orderToAskRefund.state = State.refundAsked;
			orders[orderId] = orderToAskRefund;
			emit RefundAsked(orderToAskRefund);
			logs[orderId].push(
				Log(State.refundAsked, block.timestamp)
			);
		}
	}
	
	/**
	 * 	The seller can refund the buyer if he asked a refund
	 *  and the order has already been shipped/confirmed.
	 * 	- Money from buyer to seller
	 */ 
	function refundBuyer(uint256 orderId, uint256 amount)
		external
		payable
		orderExists(orderId)
		sellerIsOwner(orderId)
	{
		Order memory orderToRefund = orders[orderId];
		require(
			orderToRefund.state == State.refundAsked, 
			"ERROR: You can't perform a refund for this order."
		);
		require(
			amount == orderToRefund.amount, 
			"ERROR: The amount you wanted to send is not equal to the order's price."
		);
		orderToRefund.state = State.refunded;
		orders[orderId] = orderToRefund;
		emit OrderRefunded(orderToRefund);
		logs[orderId].push(
			Log(State.refunded, block.timestamp)
		);
		orderToRefund.buyer.transfer(amount);
	}

	/**
	 *  In order to use the platform, sellers must register
	 *	to this smart contract using this function
	 */
	function registerAsSeller() external {
		require(
			!sellers[msg.sender],
			"ERROR: You are already a seller."
		);
		sellers[msg.sender] = true;
		sellersIterable[totalSellers.current()] = msg.sender;
		totalSellers.increment();
		emit SellerRegistered(msg.sender);
	}

    /**
     *  receive() has to be declared in order to receive money 
     *  back from other smartcontracts (swapXFor'Exact'Tokens)
     */
    receive() external payable {}

	/**************************
	 ******** GETTERS *********
	 **************************/ 

	function getBalance() external view returns(uint256) {
		return contractAddress.balance;
	}

	function getOrders() external view returns(Order[] memory) {
		Order[] memory result = new Order[](totalOrders.current());
		for (uint i = 0; i<totalOrders.current(); ++i) {
        	result[i] = orders[i];
    	}
    	return result;
	}

	function getSellers() external view returns(address[] memory) {
		address[] memory result = new address[](totalSellers.current());
		for (uint i = 0; i<totalSellers.current(); ++i) {
        	result[i] = sellersIterable[i];
    	}
    	return result;
	}

	function getOrdersOfUser(address user) external view returns(Order[] memory) {
		Order[] memory result = new Order[](0);
		if (buyers[user]) {
			result = new Order[](ordersBuyers[user].length);
			for (uint i = 0; i<ordersBuyers[user].length; ++i) {
				result[i] = orders[ordersBuyers[user][i]];
			}
		} else {
			if (sellers[user]) {
				result = new Order[](ordersSellers[user].length);
				for (uint i = 0; i<ordersSellers[user].length; ++i) {
					result[i] = orders[ordersSellers[user][i]];
				}
			} else {
				revert("ERROR: This user is not registered in our platform.");
			}
		}
		return result;
	}

	function getOrder(uint256 id) external view orderExists(id) returns(Order memory) {
		return orders[id];
	}

	function getTotalOrders() external view returns(uint256) {
		return totalOrders.current();
	}

	function getTotalSellers() external view returns(uint256) {
		return totalSellers.current();
	}

	function getLogsOfOrder(uint256 orderId) external view orderExists(orderId) returns(Log[] memory) {
		return logs[orderId];
	}
}