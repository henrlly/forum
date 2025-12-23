import { Chip, Stack } from "@mui/material";

interface ControlSummaryChipProps {
  label: string;
}

function ControlSummaryChip({ label }: ControlSummaryChipProps) {
  return (
    <Chip
      key={label}
      label={label}
      size="small"
      variant="outlined"
      color="default"
      sx={{
        fontSize: "0.75rem",
        height: 20,
        opacity: 0.75,
      }}
    />
  );
}

export interface ControlsSummaryProps {
  searchValue?: string;
  searchLabel?: string;

  filterValue?: boolean;
  filterValueLabel?: string;
  filterLabel?: string;

  sortValueLabel: string;
  sortLabel?: string;

  isVisible: boolean;
  maxWidth?: number;
}

export function ControlsSummary({
  searchValue,
  searchLabel = "Search",
  filterValue,
  filterValueLabel,
  filterLabel = "Filter",
  sortValueLabel,
  sortLabel = "Sort",
  isVisible,
}: ControlsSummaryProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <Stack
      direction="column"
      alignItems="flex-end"
      justifyContent="flex-end"
      spacing={0.5}
    >
      {/* sortValueLabel is never nullish */}
      <ControlSummaryChip label={`${sortLabel}: ${sortValueLabel}`} />
      {filterValue && filterValueLabel && (
        <ControlSummaryChip label={`${filterLabel}: ${filterValueLabel}`} />
      )}
      {searchValue && searchLabel && (
        <ControlSummaryChip label={`${searchLabel}: ${searchValue}`} />
      )}
    </Stack>
  );
}
