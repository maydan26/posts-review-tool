import React from 'react'
import { Button } from '@mui/material'

interface Props {
  onClick: () => void
}

export const ClearButton: React.FC<Props> = ({ onClick }) => (
  <Button 
    variant="outlined" 
    onClick={onClick} 
    size="small" 
    className="h-10 px-6 min-w-[100px]"
  >
    Clear
  </Button>
)
