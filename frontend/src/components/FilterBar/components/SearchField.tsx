import React from 'react'
import { TextField } from '@mui/material'
import { TEXT_FIELD_PROPS } from '../constants'

interface Props {
  value: string
  onChange: (value: string) => void
}

export const SearchField: React.FC<Props> = ({ value, onChange }) => (
  <TextField
    label="Search"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-[240px]"
    {...TEXT_FIELD_PROPS}
  />
)
