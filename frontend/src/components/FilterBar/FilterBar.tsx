import React from 'react'
import { Box, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Button, Autocomplete, Chip, Typography } from '@mui/material'
import type { Filters } from './types'
import { STATUS_OPTIONS, PLATFORM_OPTIONS, TAG_OPTIONS, getPlatformLabel } from './options'
import { formatStatusLabel, formatTag } from '../../utils/format'

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
    <Paper elevation={1} className="p-4">
      <Box className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <TextField
          label="Search"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          size="small"
          className="w-full md:w-80"
        />

        {/* Status */}
        <FormControl size="small" className="w-full md:w-40">
          <InputLabel id="filter-status-label">Status</InputLabel>
          <Select
            label="Status"
            labelId="filter-status-label"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value as Filters['status'])}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={String(opt.value)} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Platform */}
        <FormControl size="small" className="w-full md:w-40">
          <InputLabel id="filter-platform-label">Platform</InputLabel>
          <Select
            label="Platform"
            labelId="filter-platform-label"
            value={filters.platform}
            onChange={(e) => handleChange('platform', e.target.value as string)}
          >
            {PLATFORM_OPTIONS.map((p) => (
              <MenuItem key={p || 'all'} value={p}>
                {getPlatformLabel(p)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Tags */}
        <Autocomplete
          multiple
          options={TAG_OPTIONS}
          value={filters.tag}
          onChange={(_, val) => handleChange('tag', val as string[])}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip variant="outlined" label={formatTag(option)} {...getTagProps({ index })} key={`${option}-${index}`} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Tags" size="small" />
          )}
          className="w-full md:w-80"
        />

        <Button variant="outlined" onClick={handleClear} size="small" className="w-full md:w-auto">
          Clear
        </Button>
      </Box>

      {/* Active summary */}
      <Box className="mt-3 flex flex-wrap gap-2">
        <Typography variant="body2" color="text.secondary">
          Active:
        </Typography>
        {!!filters.status && (
          <Chip label={`Status: ${formatStatusLabel(filters.status)}`} size="small" />
        )}
        {!!filters.platform && (
          <Chip label={`Platform: ${getPlatformLabel(filters.platform)}`} size="small" />
        )}
        {filters.tag.map((t) => (
          <Chip key={t} label={`Tag: ${formatTag(t)}`} size="small" />
        ))}
        {!!filters.search && <Chip label={`Search: ${filters.search}`} size="small" />}
      </Box>
    </Paper>
  )
}

export default FilterBar
