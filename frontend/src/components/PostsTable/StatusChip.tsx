import React from 'react'
import { Chip } from '@mui/material'
import { formatFromSnakeCase, getStatusColor } from '../../utils/format'
import type { PostStatus } from '../../types'

interface Props {
  status: PostStatus
}

export const StatusChip: React.FC<Props> = ({ status }) => {
  const label = formatFromSnakeCase(status)
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
