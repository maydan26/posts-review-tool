import React from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton } from '@mui/material'
import { TABLE_HEADERS } from './constants'

export const TableSkeleton: React.FC = () => {
  return (
    <TableContainer component={Paper} className="mt-4">
      <Table stickyHeader aria-label="posts table">
        <TableHead className="bg-gray-100">
          <TableRow>
            {TABLE_HEADERS.map(({ key, label, className }) => (
              <TableCell key={key} className={className}>{label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index} className="h-16">
              <TableCell><Skeleton variant="text" width="100%" height={20} /></TableCell>
              <TableCell><Skeleton variant="text" width={80} height={20} /></TableCell>
              <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
              <TableCell><Skeleton variant="text" width={120} height={20} /></TableCell>
              <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableSkeleton


