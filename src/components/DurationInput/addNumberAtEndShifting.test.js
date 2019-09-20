import { addNumberAtEndShifting } from './addNumberAtEndShifting';

describe('addNumberAtEndShifting', () => {
  it('should shift numbers correctly', () => {
    expect(addNumberAtEndShifting('00', '2')).toBe('02');
    expect(addNumberAtEndShifting('02', '2')).toBe('22');
    expect(addNumberAtEndShifting('26', '2')).toBe('02');
    expect(addNumberAtEndShifting('26', 'a')).toBe('26');
  });
});
