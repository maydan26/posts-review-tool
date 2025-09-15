import React from 'react'
import { Chip, TextField, Snackbar, CircularProgress, IconButton } from '@mui/material'
import { formatTag } from '../../utils/format'
import { addTag, removeTag } from '../../api/posts'

interface Props {
  postId: string
  tags: string[]
  onTagsChange: (tags: string[]) => void
}

export const TagsCell: React.FC<Props> = ({ postId, tags, onTagsChange }) => {
  const [adding, setAdding] = React.useState(false)
  const [newTag, setNewTag] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<Record<string, boolean>>({})

  const handleAddTag = async () => {
    if (!newTag.trim()) return

    try {
      await addTag(Number(postId), newTag.trim())
      // Refresh tags by calling the parent callback
      onTagsChange([...tags, newTag.trim()])
      setNewTag('')
      setAdding(false)
    } catch (err) {
      setError('Failed to add tag')
    }
  }

  const handleRemoveTag = async (tagToRemove: string) => {
    setLoading(prev => ({ ...prev, [tagToRemove]: true }))
    
    try {
      await removeTag(Number(postId), tagToRemove)
      // Update UI by removing the tag
      onTagsChange(tags.filter(tag => tag !== tagToRemove))
    } catch (err) {
      setError('Failed to remove tag')
    } finally {
      setLoading(prev => ({ ...prev, [tagToRemove]: false }))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag()
    } else if (e.key === 'Escape') {
      setAdding(false)
      setNewTag('')
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tags.map((tag) => (
        <Chip
          key={tag}
          size="small"
          label={formatTag(tag)}
          onDelete={() => handleRemoveTag(tag)}
          deleteIcon={loading[tag] ? <CircularProgress size={12} /> : undefined}
          disabled={loading[tag]}
        />
      ))}
      
      {adding ? (
        <TextField
          size="small"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!newTag.trim()) {
              setAdding(false)
              setNewTag('')
            }
          }}
          autoFocus
          placeholder="Enter tag"
          className="w-24"
        />
      ) : (
        <IconButton
          size="small"
          onClick={() => setAdding(true)}
          aria-label="Add tag"
        >
          <span className="text-sm">+ Add</span>
        </IconButton>
      )}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        message={error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  )
}

export default TagsCell