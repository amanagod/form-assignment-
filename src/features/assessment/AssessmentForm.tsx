import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { MOBILITY_OPTIONS } from './mobilityOptions';
import { SAMPLE_PATIENT } from './sampleData';
import { type Assessment, assessmentSchema } from './schema';

/**
 * The form's in-progress shape. Derived from Assessment so the two cannot drift.
 * Checkboxes always hold a real boolean; any other field may still be empty.
 */
type AssessmentDraft = {
  [K in keyof Assessment]: Assessment[K] extends boolean ? boolean : Assessment[K] | '';
};

const EMPTY_ASSESSMENT: AssessmentDraft = {
  mrn: '',
  patientName: '',
  dateOfBirth: '',
  assessmentDate: '',
  mobility: '',
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: '',
  consentObtained: false,
};

const SAVE_DELAY_MS = 800;

/** Today as 'YYYY-MM-DD', for the assessment date's upper bound. */
const today = () => new Date().toISOString().slice(0, 10);

export interface AssessmentFormProps {
  /** Called with the parsed values once a valid submit finishes. */
  onSave?: (values: Assessment) => void;
}

export function AssessmentForm({ onSave }: AssessmentFormProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Assessment | null>(null);

  const form = useForm<AssessmentDraft>({
    mode: 'uncontrolled',
    initialValues: EMPTY_ASSESSMENT,
    validate: schemaResolver(assessmentSchema, { sync: true }),
    validateInputOnBlur: true,
  });

  const loadSample = () => {
    form.setValues(SAMPLE_PATIENT);
    form.setInitialValues(SAMPLE_PATIENT);
    setSaved(null);
  };

  const handleSubmit = async (values: AssessmentDraft) => {
    // Validation has already passed, so parse() gives us the typed, parsed output.
    const parsed = assessmentSchema.parse(values);

    setSaving(true);
    setSaved(null);
    await new Promise((resolve) => setTimeout(resolve, SAVE_DELAY_MS));
    setSaving(false);

    setSaved(parsed);
    onSave?.(parsed);
  };

  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="sm" p="lg" radius="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>Geriatric Care Assessment</Title>
          <Button type="button" variant="default" onClick={loadSample}>
            Load sample patient
          </Button>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Medical record number"
              placeholder="MRN-004821"
              key={form.key('mrn')}
              {...form.getInputProps('mrn')}
            />

            <TextInput
              label="Patient name"
              key={form.key('patientName')}
              {...form.getInputProps('patientName')}
            />

            <DateInput
              label="Date of birth"
              valueFormat="YYYY-MM-DD"
              key={form.key('dateOfBirth')}
              {...form.getInputProps('dateOfBirth')}
            />

            <DateInput
              label="Assessment date"
              valueFormat="YYYY-MM-DD"
              maxDate={today()}
              key={form.key('assessmentDate')}
              {...form.getInputProps('assessmentDate')}
            />

            <Select
              label="Mobility"
              data={MOBILITY_OPTIONS}
              allowDeselect={false}
              key={form.key('mobility')}
              {...form.getInputProps('mobility')}
            />

            <NumberInput
              label="Barthel Index"
              step={5}
              min={0}
              max={100}
              clampBehavior="none"
              key={form.key('barthelIndex')}
              {...form.getInputProps('barthelIndex')}
            />

            <NumberInput
              label="Regular medications"
              min={0}
              max={30}
              clampBehavior="none"
              key={form.key('medicationCount')}
              {...form.getInputProps('medicationCount')}
            />

            <Checkbox
              label="Pharmacist review requested"
              key={form.key('pharmacistReviewRequested')}
              {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
            />

            <DateInput
              label="Next review date"
              valueFormat="YYYY-MM-DD"
              key={form.key('followUpDate')}
              {...form.getInputProps('followUpDate')}
            />

            <Checkbox
              label="Patient or representative has given consent"
              key={form.key('consentObtained')}
              {...form.getInputProps('consentObtained', { type: 'checkbox' })}
            />

            <Group justify="flex-end">
              <Button type="submit" loading={saving} disabled={saving}>
                Save assessment
              </Button>
            </Group>
          </Stack>
        </form>

        {saved && (
          <Alert color="green" title="Assessment saved" mt="lg">
            <Code block>{JSON.stringify(saved, null, 2)}</Code>
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
