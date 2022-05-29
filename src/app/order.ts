export interface Order {
    id: number;
    buyerAddress: String;
    sellerAddress: String;
    amount: number;
    state: String;
}

export enum State {
    created,
	shipped,
	confirmed,
	deleted,
	refundAsked,
	refunded
}