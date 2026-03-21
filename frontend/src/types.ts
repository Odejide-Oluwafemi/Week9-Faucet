export type Tab = 'faucet' | 'transfer' | 'mint' | 'info';

export interface TokenDetails {
	name: string;
	symbol: string;
	decimals: number;
	currentSupply: string;
	maxSupply: string;
}

export interface AddressAmountAction {
	(address: string, amount: string): Promise<void>;
}
