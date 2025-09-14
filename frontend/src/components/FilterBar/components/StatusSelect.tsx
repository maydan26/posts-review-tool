import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { STATUS_OPTIONS } from '../options'
import { FILTER_BAR_STYLES } from '../constants'
import type { PostStatus } from '../../../types'

interface Props {
  value: PostStatus | ''
  onChange: (value: PostStatus | '') => void
}

export const StatusSelect: React.FC<Props> = ({ value, onChange }) => (
  <FormControl 
    size="small" 
    className={`w-[${FILTER_BAR_STYLES.CONTROL_WIDTHS.STATUS}]`}
  >
    <InputLabel id="filter-status-label">Status</InputLabel>
    <Select
      label="Status"
      labelId="filter-status-label"
      value={value}
      onChange={(e) => onChange(e.target.value as PostStatus | '')}
      sx={{ height: FILTER_BAR_STYLES.CONTROL_HEIGHT }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <MenuItem key={String(opt.value)} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)
