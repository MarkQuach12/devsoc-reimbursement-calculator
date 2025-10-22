import { calculateReimbursement, convertToMeritonEnjoyer, sheetToJSON } from "./meriton";

const fileName = "src\/25T2 Meriton Mastersheet.xlsx";

const json = sheetToJSON(fileName)
convertToMeritonEnjoyer(json)
