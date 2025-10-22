import * as XLSX from "xlsx";

const DRINKER_DEPOSIT = 50;
const NON_DRINKER_DEPOSIT = 35;

export type meritonEnjoyer = {
	name: string;
	email: string;
	bsb: string;
	accountNumber: string;
	refundAmount: number;
	isCancelled: boolean;
	isDrinking: boolean;
};

export type meritonEnjoyerOutput = {
	name: string;
	email: string;
	bsb: string;
	accountNumber: string;
	reimbursementAmount: number;
};

export type refundEnjoyer = {
	name: string;
	email: string;
	category: string;
	bsb: string;
	accountNumber: string;
	refundAmount: number;
};

export const sheetToJSON = (filePath: string, sheetNumber: number): any[] => {
	const workBook = XLSX.readFile(filePath);
	const sheetName = workBook.SheetNames[sheetNumber];
	const sheet = workBook.Sheets[sheetName!];
	return XLSX.utils.sheet_to_json(sheet!);
};

export function calculateReimbursement(
	group: meritonEnjoyer[],
	costOfMeriton: number,
	costOfDrinking: number
): meritonEnjoyerOutput[] {
	if (group.length === 0) {
		throw new Error("Group should not be empty");
	}
	if (costOfMeriton < 0) {
		throw new Error("Cost of Meriton cannot be negative");
	}
	if (costOfDrinking < 0) {
		throw new Error("Cost of Drinking cannot be negative");
	}

	const finalReimbursementList: meritonEnjoyerOutput[] = [];

	const attendees = group.filter((g) => !g.isCancelled);
	const drinkers = attendees.filter((g) => g.isDrinking);

	const costOfMeritonPerPerson =
		attendees.length > 0 ? costOfMeriton / attendees.length : 0;
	const costOfDrinkingPerPerson =
		drinkers.length > 0 ? costOfDrinking / drinkers.length : 0;

	for (const individual of group) {
		const baseDeposit = individual.isDrinking
			? DRINKER_DEPOSIT
			: NON_DRINKER_DEPOSIT;

		let reimbursementAmount = individual.isCancelled
			? baseDeposit
			: baseDeposit +
			  individual.refundAmount -
			  costOfMeritonPerPerson -
			  (individual.isDrinking ? costOfDrinkingPerPerson : 0);

		reimbursementAmount = Math.floor(reimbursementAmount * 100) / 100;

		const entry: meritonEnjoyerOutput = {
			name: individual.name,
			email: individual.email,
			bsb: individual.bsb,
			accountNumber: individual.accountNumber,
			reimbursementAmount,
		};

		finalReimbursementList.push(entry);
	}

	return finalReimbursementList;
}

export const addRefundsToRefundees = (
	guestList: meritonEnjoyer[],
	refundList: refundEnjoyer[]
): meritonEnjoyer[] => {
	for (const refundee of refundList) {
		let matchingGuest = guestList.find((guest) => guest.email === refundee.email);

		if (!matchingGuest) {
			matchingGuest = guestList.find((guest) => guest.name === refundee.name);
		}

		console.log(matchingGuest);

		if (matchingGuest) {
			matchingGuest.refundAmount += refundee.refundAmount;
		}
	}

	return guestList;
};
