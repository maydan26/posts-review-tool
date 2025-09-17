import { describe, it, expect } from 'vitest'
import { formatFromSnakeCase, formatPlatform, formatTag, formatDate, getStatusColor } from '../../src/utils/format'

describe('utils/format', () => {
  it('formatFromSnakeCase', () => {
    expect(formatFromSnakeCase('UNDER_REVIEW')).toBe('Under Review')
    expect(formatFromSnakeCase('FLAGGED')).toBe('Flagged')
    expect(formatFromSnakeCase('DISMISSED')).toBe('Dismissed')
  })

  it('formatPlatform capitalizes', () => {
    expect(formatPlatform('twitter')).toBe('Twitter')
    expect(formatPlatform('')).toBe('')
  })

  it('formatTag pretty prints dash-separated', () => {
    expect(formatTag('social-media')).toBe('Social Media')
    expect(formatTag('fake')).toBe('Fake')
  })

  it('formatDate renders MMM dd, yyyy HH:mm in UTC', () => {
    expect(formatDate('2025-09-14T14:30:00Z')).toBe('Sep 14, 2025 14:30')
  })

  it('getStatusColor maps statuses', () => {
    expect(getStatusColor('FLAGGED')).toBe('success')
    expect(getStatusColor('DISMISSED')).toBe('error')
    expect(getStatusColor('UNDER_REVIEW')).toBe('warning')
  })
})
