import {
	calculateReimbursement,
	sheetToJSON,
	addRefundsToRefundees,
} from "./meriton/meriton";
import { convertToMeritonEnjoyer } from "./meriton/guest";
import {
	convertToRefundList,
	nonAlcoholCostCalculator,
	alcoholCostCalculator,
} from "./meriton/refund";
import * as XLSX from "xlsx";

const DEPOSIT_SHEET: number = 0;
const REFUND_SHEET: number = 1;

const fileName = "src/25T2 Meriton Mastersheet.xlsx";

const meritonReimbursement = (fileName: string): void => {
	const depositSheetJSON = sheetToJSON(fileName, DEPOSIT_SHEET);
	const guestList = convertToMeritonEnjoyer(depositSheetJSON);

	const refundSheetJSON = sheetToJSON(fileName, REFUND_SHEET);
	const refundList = convertToRefundList(refundSheetJSON);
	const baseCost = nonAlcoholCostCalculator(refundList);
	const alcoholCost = alcoholCostCalculator(refundList);

	const addRefunds = addRefundsToRefundees(guestList, refundList);

	const reimbursementList = calculateReimbursement(
		guestList,
		baseCost,
		alcoholCost
	);

	var ws = XLSX.utils.json_to_sheet(reimbursementList);
	var wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "MyDataSheet");
	XLSX.writeFile(wb, "reimbursements.xlsx");
};

meritonReimbursement(fileName);
