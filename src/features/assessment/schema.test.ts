import { SAMPLE_PATIENT } from './sampleData';
import { assessmentSchema } from './schema';

describe('assessmentSchema age rule', () => {
  // The assessment is dated 2026-08-07, so the 60th birthday falls on 1966-08-07.
  it('accepts a patient who turns 60 on the assessment date', () => {
    const result = assessmentSchema.safeParse({
      ...SAMPLE_PATIENT,
      dateOfBirth: '1966-08-07',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a patient one day short of 60, on the dateOfBirth field', () => {
    const result = assessmentSchema.safeParse({
      ...SAMPLE_PATIENT,
      dateOfBirth: '1966-08-08',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toHaveLength(1);
    expect(result.error?.issues[0]?.path).toEqual(['dateOfBirth']);
    expect(result.error?.issues[0]?.message).toBe('This pathway is for patients aged 60 and over');
  });
});
