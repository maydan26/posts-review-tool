import React from 'react'
import { Chip } from '@mui/material'
import { formatStatusLabel, getStatusColor } from '../../utils/format'
import type { PostStatus } from '../../types'

interface Props {
  status: PostStatus
}

export const StatusChip: React.FC<Props> = ({ status }) => {
  const label = formatStatusLabel(status)
  const color = getStatusColor(status)

  return (
    <Chip
      label={label}
      color={color}
      size="small"
      className="min-w-[100px]"
    />
  )
}

export default StatusChip
