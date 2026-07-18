import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { SORT_OPTIONS, type JobSort } from "../types/job";

interface SortSelectProps {
  value: "" | JobSort;
  onChange: (value: "" | JobSort) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const handleChange = (event: SelectChangeEvent<"" | JobSort>) => {
    onChange(event.target.value as "" | JobSort);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="sort-select-label">Sort</InputLabel>
      <Select
        labelId="sort-select-label"
        id="sort-select"
        label="Sort"
        value={value}
        onChange={handleChange}
      >
        <MenuItem value="">Default</MenuItem>
        {SORT_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
