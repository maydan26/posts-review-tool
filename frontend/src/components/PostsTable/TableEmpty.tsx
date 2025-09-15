import React from 'react'
import { Paper, Typography } from '@mui/material'

export const TableEmpty: React.FC = () => (
  <Paper className="p-4 mt-4 text-center text-gray-500">
    <Typography variant="h6">No posts found.</Typography>
  </Paper>
)

export default TableEmpty


