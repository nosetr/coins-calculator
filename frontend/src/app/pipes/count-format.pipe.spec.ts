import { CountFormatPipe } from './count-format.pipe';
import { TableTypeEnum } from '../shared/enums';

describe('CountFormatPipe', () => {
    let pipe: CountFormatPipe;

    beforeEach(() => {
        pipe = new CountFormatPipe();
    });

    it('should be created', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return string for NEW_DENOMINATION', () => {
        const result = pipe.transform(5, TableTypeEnum.NEW_DENOMINATION);
        expect(result).toBe('5');
    });

    it('should return positive value and add plus with DIFFERENCE type', () => {
        const result = pipe.transform(3, TableTypeEnum.DIFFERENCE);
        expect(result).toBe('+3');
    });

    it('should return zero with DIFFERENCE type', () => {
        const result = pipe.transform(0, TableTypeEnum.DIFFERENCE);
        expect(result).toBe('0');
    });

    it('should return negative value as string with DIFFERENCE type', () => {
        const result = pipe.transform(-2, TableTypeEnum.DIFFERENCE);
        expect(result).toBe('-2');
    });
});