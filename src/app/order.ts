export interface Order {
    id: number;
    buyerAddress: string;
    sellerAddress: string;
    amount: number;
    state: string;
}

export enum State {
    created,
	shipped,
	confirmed,
	deleted,
	refundAsked,
	refunded
}