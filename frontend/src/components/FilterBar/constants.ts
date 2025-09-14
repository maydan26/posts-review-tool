// Styling constants for consistent FilterBar appearance
export const FILTER_BAR_STYLES = {
  CONTROL_HEIGHT: '40px',
  CONTROL_WIDTHS: {
    SEARCH: '240px',
    STATUS: '160px', 
    PLATFORM: '160px',
    TAGS: '200px',
  },
  SPACING: {
    GAP: '1rem', // gap-4
    PADDING: '1rem', // p-4
  },
} as const

// Form control props for consistency
export const FORM_CONTROL_PROPS = {
  size: 'small' as const,
  sx: { height: FILTER_BAR_STYLES.CONTROL_HEIGHT },
} as const

export const TEXT_FIELD_PROPS = {
  size: 'small' as const,
  sx: { '& .MuiInputBase-root': { height: FILTER_BAR_STYLES.CONTROL_HEIGHT } },
} as const
