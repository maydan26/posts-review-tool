import React from 'react'
import { Paper, Typography, Button } from '@mui/material'

interface Props {
  error: string
  onRetry?: () => void
}

export const TableError: React.FC<Props> = ({ error, onRetry }) => (
  <Paper className="p-6 mt-4 text-center">
    <Typography variant="h6" color="error" className="mb-4">
      {error}
    </Typography>
    {onRetry && (
      <Button variant="contained" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </Paper>
)

export default TableError


