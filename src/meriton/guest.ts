import { meritonEnjoyer } from "./meriton";

export const convertToMeritonEnjoyer = (rows: any[]): meritonEnjoyer[] => {
	const guestArray: meritonEnjoyer[] = [];

	for (const input of rows) {
		const bsbInput = String(input["What is your BSB? (For refunds)"]).replace(
			/\D/g,
			""
		);
		const accountNumberInput = String(
			input["What is your bank account number? (For refunds)"]
		).replace(/\D/g, "");

		if (input["Email address"] === undefined) {
			continue;
		}

		const guest: meritonEnjoyer = {
			name: input["Full Name"].toLowerCase().trim(),
			email: input["Email address"].toLowerCase().trim(),
			bsb: bsbInput,
			accountNumber: accountNumberInput,
			refundAmount: 0,
			isCancelled: input["Cancelled?"] ? true : false,
			isDrinking:
				input[
					"Are you opting in to the shared alcohol pool? (This means you will pay $50 instead of $35)\r\n\r\n- Alcohol from the shared pool will be limited to 7:30pm onwards."
				] == "Yes"
					? true
					: false,
		};

		guestArray.push(guest);
	}

	return guestArray;
};
