import React from 'react'
import { TextField } from '@mui/material'
import { TEXT_FIELD_PROPS, FILTER_BAR_STYLES } from '../constants'

interface Props {
  value: string
  onChange: (value: string) => void
}

export const SearchField: React.FC<Props> = ({ value, onChange }) => (
  <TextField
    label="Search"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-[${FILTER_BAR_STYLES.CONTROL_WIDTHS.SEARCH}]`}
    {...TEXT_FIELD_PROPS}
  />
)
