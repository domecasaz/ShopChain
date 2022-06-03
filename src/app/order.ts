export interface Order {
    id: number;
    buyerAddress: string;
    sellerAddress: string;
    amount: number;
    state: string;
}

export enum State {
    Created,
	Shipped,
	Confirmed,
	Deleted,
	RefundAsked,
	Refunded
}