import React, { useState } from 'react'
import { Autocomplete, TextField, Chip } from '@mui/material'
import { TAG_OPTIONS } from '../options'
import { formatTag } from '../../../utils/format'
import { TEXT_FIELD_PROPS } from '../constants'

interface Props {
  value: string[]
  onChange: (value: string[]) => void
}

export const TagsAutocomplete: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)

  return (
    <Autocomplete
      multiple
      size="small"
      options={TAG_OPTIONS}
      value={value}
      onChange={(_, val) => {
        onChange(val as string[])
        // Keep dropdown open after selection
        setOpen(true)
      }}
      getOptionLabel={(opt) => formatTag(opt)}
      limitTags={1}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={(event, reason) => {
        // Only close on blur, not on selection
        if (reason === 'blur') {
          setOpen(false)
        }
      }}
      className="w-[200px]"
      renderTags={(value, getTagProps) => (
        <>
          {value.slice(0, 1).map((option, index) => (
            <Chip
              variant="outlined"
              label={formatTag(option)}
              {...getTagProps({ index })}
              key={`${option}-${index}`}
              size="small"
            />
          ))}
          {value.length > 1 && (
            <Chip
              label={`+${value.length - 1}`}
              size="small"
              variant="outlined"
              color="default"
            />
          )}
        </>
      )}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="Tags" 
          {...TEXT_FIELD_PROPS}
        />
      )}
    />
  )
}
