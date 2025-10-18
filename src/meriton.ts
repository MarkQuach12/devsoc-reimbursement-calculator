export type meritonEnjoyer = {
	name: string;
	bankAccountName: string;
	bsb: string;
	accountNumber: string;
	refundAmount: number;
	isCancelled: boolean;
	isDrinking: boolean;
};

export type meritonEnjoyerOutput = {
	name: string;
	bankAccountName: string;
	bsb: string;
	accountNumber: string;
	reimbursementAmount: number;
};

export function calculateReimbursement(
	group: meritonEnjoyer[],
	costOfMeriton: number,
	costOfDrinking: number
): meritonEnjoyerOutput[] {
	if (group.length === 0) {
		throw new Error("Group should not be empty");
	} else if (costOfMeriton < 0) {
		throw new Error("Cost of Meriton cannot be negative");
	} else if (costOfDrinking < 0) {
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
		const baseDeposit = individual.isDrinking ? 50 : 35;

		const reimbursementAmount = individual.isCancelled
			? baseDeposit
			: baseDeposit +
			  individual.refundAmount -
			  costOfMeritonPerPerson -
			  (individual.isDrinking ? costOfDrinkingPerPerson : 0);

		const user: meritonEnjoyerOutput = {
			name: individual.accountNumber,
			bankAccountName: individual.bankAccountName,
			bsb: individual.bsb,
			accountNumber: individual.accountNumber,
			reimbursementAmount: reimbursementAmount,
		};

		finalReimbursementList.push(user);
	}

	return finalReimbursementList;
}