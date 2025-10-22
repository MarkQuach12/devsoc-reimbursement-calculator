import * as XLSX from "xlsx";

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

const DRINKER_DEPOSIT = 50;
const NON_DRINKER_DEPOSIT = 35;

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

  const attendees = group.filter(g => !g.isCancelled);
  const drinkers = attendees.filter(g => g.isDrinking);

  const costOfMeritonPerPerson = attendees.length > 0 ? costOfMeriton / attendees.length : 0;
  const costOfDrinkingPerPerson = drinkers.length > 0 ? costOfDrinking / drinkers.length : 0;

  for (const individual of group) {
    const baseDeposit = individual.isDrinking ? DRINKER_DEPOSIT : NON_DRINKER_DEPOSIT;

    const reimbursementAmount = individual.isCancelled
      ? baseDeposit
      : baseDeposit
        + individual.refundAmount
        - costOfMeritonPerPerson
        - (individual.isDrinking ? costOfDrinkingPerPerson : 0);

    const entry: meritonEnjoyerOutput = {
      name: individual.name,
      bankAccountName: individual.bankAccountName,
      bsb: individual.bsb,
      accountNumber: individual.accountNumber,
      reimbursementAmount,
    };

    finalReimbursementList.push(entry);
  }

  return finalReimbursementList;
}

export const sheetToJSON = (sheetPath: string): any[] => {
  const workBook = XLSX.readFile(sheetPath);
  const sheetName = workBook.SheetNames[0];
  const sheet = workBook.Sheets[sheetName!];
  return XLSX.utils.sheet_to_json(sheet!);
};

// Example converter, adjust keys to match your sheet headers
export const convertToMeritonEnjoyer = (rows: any[]): meritonEnjoyer[] => {
  return rows.map((r: any) => ({
    name: String(r.name ?? r.Name ?? ""),
    bankAccountName: String(r.bankAccountName ?? r["Bank Account Name"] ?? ""),
    bsb: String(r.bsb ?? r.BSB ?? ""),
    accountNumber: String(r.accountNumber ?? r["Account Number"] ?? ""),
    refundAmount: Number(r.refundAmount ?? r["Refund Amount"] ?? 0),
    isCancelled: Boolean(r.isCancelled ?? r.Cancelled ?? false),
    isDrinking: Boolean(r.isDrinking ?? r.Drinking ?? false),
  }));
};
