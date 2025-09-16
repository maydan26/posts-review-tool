import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getPosts } from '../api/posts'
import type { TagOptionsContextType } from '../types'

const TagOptionsContext = createContext<TagOptionsContextType | undefined>(undefined)

interface TagOptionsProviderProps {
  children: ReactNode
}

export const TagOptionsProvider: React.FC<TagOptionsProviderProps> = ({ children }) => {
  const [tagOptions, setTagOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isMountedRef = React.useRef(true)

  // Normalize tag: trim whitespace and convert to lowercase for comparison
  const normalizeTag = (tag: string): string => {
    return tag.trim().toLowerCase()
  }

  // Load initial tag options from existing posts
  useEffect(() => {
    const loadTagOptions = async () => {
      try {
        if (!isMountedRef.current) return
        setIsLoading(true)
        // Fetch all posts to get existing tags
        const response = await getPosts({ limit: 1000, offset: 0 })
        const allTags = response.data.flatMap(post => post.tags)
        
        // Normalize and deduplicate tags
        const uniqueTags = Array.from(new Set(allTags.map(normalizeTag)))
          .sort() // Sort alphabetically for better UX
        
        if (!isMountedRef.current) return
        setTagOptions(uniqueTags)
      } catch (error) {
        console.error('Failed to load tag options:', error)
        if (!isMountedRef.current) return
        setTagOptions([])
      } finally {
        if (!isMountedRef.current) return
        setIsLoading(false)
      }
    }

    loadTagOptions()
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const addTagOption = (tag: string) => {
    const normalizedTag = normalizeTag(tag)
    
    // Only add if not already present
    setTagOptions(prev => {
      if (prev.includes(normalizedTag)) {
        return prev
      }
      
      // Add new tag and sort alphabetically
      return [...prev, normalizedTag].sort()
    })
  }

  const value: TagOptionsContextType = {
    tagOptions,
    addTagOption,
    isLoading
  }

  return (
    <TagOptionsContext.Provider value={value}>
      {children}
    </TagOptionsContext.Provider>
  )
}

export const useTagOptions = (): TagOptionsContextType => {
  const context = useContext(TagOptionsContext)
  if (context === undefined) {
    throw new Error('useTagOptions must be used within a TagOptionsProvider')
  }
  return context
}
