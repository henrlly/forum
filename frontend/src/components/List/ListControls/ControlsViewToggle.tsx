import { ExpandLess, ExpandMore, Tune } from "@mui/icons-material";
import { Button, Chip } from "@mui/material";

export interface ControlsViewToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
  activeControlsCount: number;
}

export function ControlsViewToggle({
  isExpanded,
  onToggle,
  activeControlsCount,
}: ControlsViewToggleProps) {
  const hasActiveFilters = activeControlsCount > 0;

  return (
    <Button
      onClick={onToggle}
      variant="outlined"
      size="small"
      startIcon={<Tune />}
      endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
      color="primary"
    >
      {isExpanded ? "Hide" : "Show"}
      {!isExpanded && hasActiveFilters && (
        <Chip
          size="small"
          label={activeControlsCount}
          color="primary"
          variant="filled"
          sx={{
            ml: 1,
            height: 16,
            fontSize: "0.75rem",
            "& .MuiChip-label": {
              px: 0.5,
            },
          }}
        />
      )}
    </Button>
  );
}
