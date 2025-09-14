import React from 'react'
import {
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material'

interface Props {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export const PaginationBar: React.FC<Props> = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(total / pageSize)

  return (
    <Box className="flex items-center justify-center gap-4 mt-4">
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, newPage) => onPageChange(newPage)}
        color="primary"
        showFirstButton
        showLastButton
      />
      
      <Box className="flex items-center gap-2">
        <Typography variant="body2" color="text.secondary">
          Show:
        </Typography>
        <FormControl size="small" className="min-w-[80px]">
          <InputLabel>Per page</InputLabel>
          <Select
            value={pageSize}
            label="Per page"
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}

export default PaginationBar
