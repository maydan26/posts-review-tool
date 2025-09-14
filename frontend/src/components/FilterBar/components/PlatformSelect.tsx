import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { PLATFORM_OPTIONS, getPlatformLabel } from '../options'
import { FILTER_BAR_STYLES } from '../constants'

interface Props {
  value: string
  onChange: (value: string) => void
}

export const PlatformSelect: React.FC<Props> = ({ value, onChange }) => (
  <FormControl 
    size="small" 
    className={`w-[${FILTER_BAR_STYLES.CONTROL_WIDTHS.PLATFORM}]`}
  >
    <InputLabel id="filter-platform-label">Platform</InputLabel>
    <Select
      label="Platform"
      labelId="filter-platform-label"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ height: FILTER_BAR_STYLES.CONTROL_HEIGHT }}
    >
      {PLATFORM_OPTIONS.map((p) => (
        <MenuItem key={p || 'all'} value={p}>
          {getPlatformLabel(p)}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)
