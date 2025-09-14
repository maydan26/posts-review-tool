import React from 'react'
import { Box, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Button, Autocomplete, Chip } from '@mui/material'
import type { Filters } from './types'
import { STATUS_OPTIONS, PLATFORM_OPTIONS, TAG_OPTIONS, getPlatformLabel } from './options'
import { formatTag } from '../../utils/format'

interface Props {
  filters: Filters
  onFiltersChange: (next: Filters) => void
}

export const FilterBar: React.FC<Props> = ({ filters, onFiltersChange }) => {
  const handleChange = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleClear = () => {
    onFiltersChange({ status: '', platform: '', tag: [], search: '' })
  }

  return (
    <Paper elevation={1} className="p-4 bg-white">
      {/* Clean horizontal layout with consistent spacing */}
      <Box className="flex flex-row items-center gap-4 flex-wrap">
        {/* Search: consistent width and height */}
        <TextField
          label="Search"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          size="small"
          className="w-[240px]"
          sx={{ '& .MuiInputBase-root': { height: '40px' } }}
        />

        {/* Status: consistent width */}
        <FormControl size="small" className="w-[160px]">
          <InputLabel id="filter-status-label">Status</InputLabel>
          <Select
            label="Status"
            labelId="filter-status-label"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value as Filters['status'])}
            sx={{ height: '40px' }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={String(opt.value)} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Platform: consistent width */}
        <FormControl size="small" className="w-[160px]">
          <InputLabel id="filter-platform-label">Platform</InputLabel>
          <Select
            label="Platform"
            labelId="filter-platform-label"
            value={filters.platform}
            onChange={(e) => handleChange('platform', e.target.value as string)}
            sx={{ height: '40px' }}
          >
            {PLATFORM_OPTIONS.map((p) => (
              <MenuItem key={p || 'all'} value={p}>
                {getPlatformLabel(p)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Tags: consistent width with better chip handling */}
        <Autocomplete
          multiple
          size="small"
          options={TAG_OPTIONS}
          value={filters.tag}
          onChange={(_, val) => handleChange('tag', val as string[])}
          getOptionLabel={(opt) => formatTag(opt)}
          limitTags={1}
          className="w-[200px]"
          renderTags={(value, getTagProps) => (
            <Box className="flex items-center gap-1 overflow-hidden">
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
            </Box>
          )}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Tags" 
              size="small"
              sx={{ '& .MuiInputBase-root': { height: '40px' } }}
            />
          )}
        />

        {/* Clear button with consistent height */}
        <Button 
          variant="outlined" 
          onClick={handleClear} 
          size="small" 
          className="h-10 px-4"
        >
          Clear
        </Button>
      </Box>
    </Paper>
  )
}

export default FilterBar
