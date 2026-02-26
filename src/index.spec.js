import { sum } from './index.js';
describe('sum function', () => {
  test('adds positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  test('adds negative numbers', () => {
    expect(sum(-2, -3)).toBe(-5);
  });

  test('adds mixed numbers', () => {
    expect(sum(-2, 5)).toBe(3);
  });
});
