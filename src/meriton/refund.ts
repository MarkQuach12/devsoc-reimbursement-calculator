import { refundEnjoyer } from "./meriton";

export const convertToRefundList = (rows: any[]): refundEnjoyer[] => {
	const refundArray: refundEnjoyer[] = [];

	for (const input of rows) {
		if (input["Email address"] === undefined) {
			continue;
		}

		if (input["Screenshot of Purchases(s)"] === undefined) {
			continue;
		}

		const user: refundEnjoyer = {
			name: input["Full Name"].toLowerCase().trim(),
			email: input["Email address"].toLowerCase().trim(),
			category: input["Description of items bought"],
			bsb: String(input["What is your BSB? (For refunds)"]).replace(/\D/g, ""),
			accountNumber: String(
				input["What is your bank account number? (For refunds)"]
			).replace(/\D/g, ""),
			refundAmount: Math.floor(Number(input["Reimbursement amount"]) * 100) / 100,
		};

		refundArray.push(user);
	}

	return refundArray;
};

export const nonAlcoholCostCalculator = (
	refundList: refundEnjoyer[]
): number => {
	return refundList.reduce(
		(sum, item) => (item.category !== "Alcohol" ? sum + item.refundAmount : sum),
		0
	);
};

export const alcoholCostCalculator = (refundList: refundEnjoyer[]): number => {
	return refundList.reduce(
		(sum, item) => (item.category === "Alcohol" ? sum + item.refundAmount : sum),
		0
	);
};
