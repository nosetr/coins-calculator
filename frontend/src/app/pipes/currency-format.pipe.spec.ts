import { CurrencyFormatPipe } from './currency-format.pipe';

describe('CurrencyFormatPipe', () => {
    let pipe: CurrencyFormatPipe;

    beforeEach(() => {
        pipe = new CurrencyFormatPipe();
    });

    it('should be created', () => {
        expect(pipe).toBeTruthy();
    });

    it('should format integer amounts correctly', () => {
        const result = pipe.transform(150);
        expect(result).toBe('150,00 €');
    });

    it('should format float amounts correctly', () => {
        const result = pipe.transform(8.88);
        expect(result).toBe('8,88 €');
    });

    it('should format zero correctly', () => {
        const result = pipe.transform(0);
        expect(result).toBe('0,00 €');
    });

    it('should format negative amounts correctly', () => {
        const result = pipe.transform(-25.5);
        expect(result).toBe('-25,50 €');
    });
});