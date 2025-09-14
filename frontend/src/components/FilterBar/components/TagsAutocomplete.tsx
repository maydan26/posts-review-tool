import React from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { TAG_OPTIONS } from '../options'
import { formatTag } from '../../../utils/format'
import { TEXT_FIELD_PROPS } from '../constants'

interface Props {
  value: string
  onChange: (value: string) => void
}

export const TagsAutocomplete: React.FC<Props> = ({ value, onChange }) => {
  return (
    <Autocomplete
      size="small"
      options={TAG_OPTIONS}
      value={value || null}
      onChange={(_, val) => {
        onChange(val || '')
      }}
      getOptionLabel={(opt) => formatTag(opt)}
      className="w-[200px]"
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="Tag" 
          {...TEXT_FIELD_PROPS}
        />
      )}
    />
  )
}
