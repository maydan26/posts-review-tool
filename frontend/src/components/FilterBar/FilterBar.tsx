import React from 'react'
import { Box, Paper } from '@mui/material'
import type { Filters } from './types'
import { SearchField, StatusSelect, PlatformSelect, TagsAutocomplete, ClearButton } from './components'

interface Props {
  filters: Filters
  onFiltersChange: (next: Filters) => void
}

export const FilterBar: React.FC<Props> = ({ filters, onFiltersChange }) => {
  const handleChange = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleClear = () => {
    onFiltersChange({ status: '', platform: '', tag: '', search: '' })
  }

  return (
    <Paper elevation={1} className="p-6 bg-white">
      <Box className="flex flex-row items-center justify-center gap-6 flex-wrap">
        <SearchField 
          value={filters.search} 
          onChange={(value) => handleChange('search', value)} 
        />
        
        <StatusSelect 
          value={filters.status} 
          onChange={(value) => handleChange('status', value)} 
        />
        
        <PlatformSelect 
          value={filters.platform} 
          onChange={(value) => handleChange('platform', value)} 
        />
        
        <TagsAutocomplete 
          value={filters.tag} 
          onChange={(value) => handleChange('tag', value)} 
        />
        
        <ClearButton onClick={handleClear} />
      </Box>
    </Paper>
  )
}

export default FilterBar
