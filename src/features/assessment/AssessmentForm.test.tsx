import { render, screen, userEvent, waitFor } from '@test-utils';
import { AssessmentForm } from './AssessmentForm';
import { SAMPLE_PATIENT } from './sampleData';

describe('AssessmentForm', () => {
  it('submits the parsed values when the sample patient is loaded', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<AssessmentForm onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: /load sample patient/i }));
    await user.click(screen.getByRole('button', { name: /save assessment/i }));

    // The component waits 800ms to fake a save, and driving Mantine through
    // userEvent in jsdom is slow, so this assertion needs a longer leash.
    await waitFor(() => expect(onSave).toHaveBeenCalledWith(SAMPLE_PATIENT), { timeout: 15000 });

    expect(await screen.findByText(/assessment saved/i)).toBeInTheDocument();
  }, 15000);
});
