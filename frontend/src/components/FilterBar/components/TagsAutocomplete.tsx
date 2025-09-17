import React from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { formatTag } from '../../../utils/format'
import { TEXT_FIELD_PROPS } from '../constants'
import { useTagOptions } from '../../../contexts/TagOptionsContext'
import { TAG_OPTIONS } from '../options'

interface Props {
  value: string
  onChange: (value: string) => void
}

export const TagsAutocomplete: React.FC<Props> = ({ value, onChange }) => {
  const { tagOptions, isLoading } = useTagOptions()

  return (
    <Autocomplete
      size="small"
      options={[...new Set([...TAG_OPTIONS, ...tagOptions])]} 
      value={value || null}
      onChange={(_, val) => {
        onChange(val || '')
      }}
      getOptionLabel={(opt) => (typeof opt === 'string' ? formatTag(opt) : '')}
      className="w-[200px]"
      loading={isLoading}
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
