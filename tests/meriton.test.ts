import { meritonEnjoyer, calculateReimbursement } from '../src/meriton';
import { describe, expect, test } from '@jest/globals';

describe('calculateReimbursement — unit / integration cases (matches current implementation)', () => {
    test('basic error cases', () => {
        const user: meritonEnjoyer = {
            name: 'Drinker',
            bankAccountName: 'Bank Account',
            bsb: '111-222',
            accountNumber: 'A1',
            refundAmount: 0,
            isCancelled: false,
            isDrinking: true,
        };
        
        expect(() => calculateReimbursement([], 1000, 500)).toThrow('Group should not be empty');
        expect(() => calculateReimbursement([user], -500, 500)).toThrow('Cost of Meriton cannot be negative');
        expect(() => calculateReimbursement([user], 1000, -500)).toThrow('Cost of Drinking cannot be negative');
    });

    
    test('single drinker (not cancelled) — costOfDrinking deducted twice per current logic', () => {
        const costOfMeriton = 2500;
        const costOfDrinking = 750;

        const user: meritonEnjoyer = {
            name: 'Drinker',
            bankAccountName: 'Bank Account',
            bsb: '111-222',
            accountNumber: 'A1',
            refundAmount: 0,
            isCancelled: false,
            isDrinking: true,
        };

        const result = calculateReimbursement([user], costOfMeriton, costOfDrinking);
        expect(result).toHaveLength(1);
        expect(result[0]!.accountNumber).toBe('A1');
        expect(result[0]!.reimbursementAmount).toBe(50 - costOfMeriton - costOfDrinking);
    });

    test('single non-drinker (not cancelled)', () => {
        const costOfMeriton = 2500;
        const costOfDrinking = 750;

        const user: meritonEnjoyer = {
            name: 'NonDrinker',
            bankAccountName: 'Bank Account',
            bsb: '111-222',
            accountNumber: 'B1',
            refundAmount: 0,
            isCancelled: false,
            isDrinking: false,
        };

        const result = calculateReimbursement([user], costOfMeriton, costOfDrinking);
        expect(result).toHaveLength(1);
        expect(result[0]!.accountNumber).toBe('B1');
        expect(result[0]!.reimbursementAmount).toBe(35 - costOfMeriton);
    });

    test('cancelled participants return base deposit (drinker/non-drinker)', () => {
        const costOfMeriton = 2500;
        const costOfDrinking = 750;

        const cancelledDrinker: meritonEnjoyer = {
            name: 'CancelledDrinker',
            bankAccountName: 'Bank Account',
            bsb: '111-222',
            accountNumber: 'C1',
            refundAmount: 0,
            isCancelled: true,
            isDrinking: true,
        };

        const cancelledNonDrinker: meritonEnjoyer = {
            name: 'CancelledNonDrinker',
            bankAccountName: 'Bank Account',
            bsb: '111-222',
            accountNumber: 'C2',
            refundAmount: 0,
            isCancelled: true,
            isDrinking: false,
        };

        const result = calculateReimbursement([cancelledDrinker, cancelledNonDrinker], costOfMeriton, costOfDrinking);
        const rDrinker = result.find(r => r.accountNumber === 'C1')!;
        const rNonDrinker = result.find(r => r.accountNumber === 'C2')!;

        expect(rDrinker.reimbursementAmount).toBe(50);
        expect(rNonDrinker.reimbursementAmount).toBe(35);
    });

    test('mixed group allocation (one drinker, one non-drinker)', () => {
        const costOfMeriton = 2000;
        const costOfDrinking = 600;

        const drinker: meritonEnjoyer = {
            name: 'Drinker',
            bankAccountName: 'Bank Account',
            bsb: '111-222',
            accountNumber: 'D1',
            refundAmount: 0,
            isCancelled: false,
            isDrinking: true,
        };

        const nonDrinker: meritonEnjoyer = {
            name: 'NonDrinker',
            bankAccountName: 'Bank Account',
            bsb: '111-222',
            accountNumber: 'D2',
            refundAmount: 0,
            isCancelled: false,
            isDrinking: false,
        };

        const result = calculateReimbursement([drinker, nonDrinker], costOfMeriton, costOfDrinking);
        const rDrinker = result.find(r => r.accountNumber === 'D1')!;
        const rNonDrinker = result.find(r => r.accountNumber === 'D2')!;

        expect(rDrinker.reimbursementAmount).toBe(50 - (costOfMeriton / 2) - costOfDrinking);
        expect(rNonDrinker.reimbursementAmount).toBe(35 - (costOfMeriton / 2));
    });

    test('mixed group allocation (two drinker, two non-drinker) with refund', () => {
        const costOfMeriton = 2000;
        const costOfDrinking = 600;

        const drinker1: meritonEnjoyer = {
            name: 'Drinker1',
            bankAccountName: 'Bank Account',
            bsb: '111-222',
            accountNumber: 'D1',
            refundAmount: 0,
            isCancelled: false,
            isDrinking: true,
        };

        const drinker2: meritonEnjoyer = {
            name: 'Drinker2',
            bankAccountName: 'Bank Account',
            bsb: '111-222',
            accountNumber: 'D2',
            refundAmount: 70,
            isCancelled: false,
            isDrinking: true,
        };

        const nonDrinker1: meritonEnjoyer = {
            name: 'NonDrinker1',
            bankAccountName: 'Bank Account',
            bsb: '111-222',
            accountNumber: 'D3',
            refundAmount: 0,
            isCancelled: false,
            isDrinking: false,
        };

        const nonDrinker2: meritonEnjoyer = {
            name: 'NonDrinker2',
            bankAccountName: 'Bank Account',
            bsb: '111-222',
            accountNumber: 'D4',
            refundAmount: 0,
            isCancelled: false,
            isDrinking: false,
        };

        const result = calculateReimbursement([drinker1, drinker2, nonDrinker1, nonDrinker2], costOfMeriton, costOfDrinking);
        const rDrinker1 = result.find(r => r.accountNumber === 'D1')!;
        const rDrinker2 = result.find(r => r.accountNumber === 'D2')!;
        const rNonDrinker1 = result.find(r => r.accountNumber === 'D3')!;
        const rNonDrinker2 = result.find(r => r.accountNumber === 'D4')!;

        expect(rDrinker1.reimbursementAmount).toBe(50 - (costOfMeriton / 4) - (costOfDrinking / 2));
        expect(rDrinker2.reimbursementAmount).toBe(50 + 70 - (costOfMeriton / 4) - (costOfDrinking / 2));
        expect(rNonDrinker1.reimbursementAmount).toBe(35 - (costOfMeriton / 4));
        expect(rNonDrinker2.reimbursementAmount).toBe(35 - (costOfMeriton / 4));
    });

    test('precision check for non integer splits uses toBeCloseTo', () => {
        const costOfMeriton = 1000;
        const costOfDrinking = 1000;

        const a: meritonEnjoyer = {
            name: 'a',
            bankAccountName: 'Bank',
            bsb: '111-222',
            accountNumber: 'P1',
            refundAmount: 0,
            isCancelled: false,
            isDrinking: true,
        };
        
        const b: meritonEnjoyer = {
            name: 'b',
            bankAccountName: 'Bank',
            bsb: '111-222',
            accountNumber: 'P2',
            refundAmount: 0,
            isCancelled: false,
            isDrinking: false,
        };

        const c: meritonEnjoyer = {
            name: 'c',
            bankAccountName: 'Bank',
            bsb: '111-222',
            accountNumber: 'P3',
            refundAmount: 0,
            isCancelled: false,
            isDrinking: true,
        };

        const result = calculateReimbursement([a, b, c], costOfMeriton, costOfDrinking);
        const perMeriton = 1000 / 3;
        const perDrink = 1000 / 2;

        const rA = result.find(r => r.accountNumber === 'P1')!;
        const rB = result.find(r => r.accountNumber === 'P2')!;
        const rC = result.find(r => r.accountNumber === 'P3')!;
        expect(rA.reimbursementAmount).toBeCloseTo(50 - perMeriton - perDrink, 10);
        expect(rB.reimbursementAmount).toBeCloseTo(35 - perMeriton, 10);
        expect(rC.reimbursementAmount).toBeCloseTo(50 - perMeriton - perDrink, 10);
    });

    test('zero costs produce base deposits plus refunds only', () => {
        const costOfMeriton = 0;
        const costOfDrinking = 0;

        const d: meritonEnjoyer = {
            name: 'D',
            bankAccountName: 'Bank',
            bsb: '111-222',
            accountNumber: 'Z1',
            refundAmount: 5,
            isCancelled: false,
            isDrinking: true,
        };
        const n: meritonEnjoyer = {
            name: 'N',
            bankAccountName: 'Bank',
            bsb: '111-222',
            accountNumber: 'Z2',
            refundAmount: -2,
            isCancelled: false,
            isDrinking: false,
        };

        const result = calculateReimbursement([d, n], costOfMeriton, costOfDrinking);
        const rD = result.find(r => r.accountNumber === 'Z1')!;
        const rN = result.find(r => r.accountNumber === 'Z2')!;

        expect(rD.reimbursementAmount).toBe(50 + 5);
        expect(rN.reimbursementAmount).toBe(35 - 2);
    });
});