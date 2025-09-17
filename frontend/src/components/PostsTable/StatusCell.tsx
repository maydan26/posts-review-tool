import React from 'react'
import { IconButton, Menu, MenuItem } from '@mui/material'
import StatusChip from './StatusChip'
import type { PostStatus } from '../../types'
import { STATUS_VALUES } from '../../constants/status'
import { formatFromSnakeCase } from '../../utils/format'

interface Props {
  postId: number
  status: PostStatus
  busy: boolean
  onChange: (postId: number, next: PostStatus) => Promise<void> | void
}

const STATUS_OPTIONS: PostStatus[] = STATUS_VALUES

export const StatusCell: React.FC<Props> = ({ postId, status, busy, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    if (busy) return
    setAnchorEl(e.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)

  const handleSelect = async (next: PostStatus) => {
    handleClose()
    if (next === status) return
    await onChange(postId, next)
  }

  return (
    <div className="flex items-center gap-2">
      <StatusChip status={status} />
      <IconButton size="small" aria-label="Edit status" onClick={handleOpen} disabled={busy}>
        <span className="text-sm">✎</span>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {STATUS_OPTIONS.map((opt) => {
          const label = formatFromSnakeCase(opt)
          return (
            <MenuItem key={opt} onClick={() => handleSelect(opt)} disabled={busy}>
              {label}
            </MenuItem>
          )
        })}
      </Menu>
    </div>
  )
}

export default StatusCell


