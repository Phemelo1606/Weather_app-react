import { Card, PageHeading, SegmentedControl, SettingRow } from '../components';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import type { Theme, Units } from '../types/weather';

const UNIT_OPTIONS: { value: Units; label: string }[] = [
  { value: 'metric', label: '°C · km/h' },
  { value: 'imperial', label: '°F · mph' },
];
const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function SettingsPage() {
  const { units, setUnits, theme, setTheme } = useSettings();
  const { showToast } = useToast();

  return (
    <>
      <PageHeading title="Settings" subtitle="Choose how Nimbus looks and measures." />
      <Card>
        <SettingRow label="Units" description="Applies to temperature, wind and distance.">
          <SegmentedControl
            options={UNIT_OPTIONS}
            value={units}
            ariaLabel="Display units"
            onChange={(value) => { setUnits(value); showToast('Units updated.', 'success'); }}
          />
        </SettingRow>
        <SettingRow label="Theme" description="Choose a light or dark appearance.">
          <SegmentedControl
            options={THEME_OPTIONS}
            value={theme}
            ariaLabel="Theme"
            onChange={(value) => { setTheme(value); showToast('Theme updated.', 'success'); }}
          />
        </SettingRow>
      </Card>
    </>
  );
}
