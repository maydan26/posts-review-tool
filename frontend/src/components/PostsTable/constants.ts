export interface TableHeaderDef {
  key: string
  label: string
  className: string
}

export const TABLE_HEADERS: TableHeaderDef[] = [
  { key: 'text', label: 'Text', className: 'w-1/3 font-semibold text-gray-800' },
  { key: 'platform', label: 'Platform', className: 'w-1/6 font-semibold text-gray-800' },
  { key: 'status', label: 'Status', className: 'w-1/6 font-semibold text-gray-800' },
  { key: 'tags', label: 'Tags', className: 'w-1/6 font-semibold text-gray-800' },
  { key: 'date', label: 'Date', className: 'w-1/6 font-semibold text-gray-800' },
]


