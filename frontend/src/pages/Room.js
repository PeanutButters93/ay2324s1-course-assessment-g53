import React, { useState, useEffect } from 'react'
import { Grid, Paper, Typography } from '@mui/material'
import TextEditor from '../components/TextEditor'
import DividerIcon from '@mui/icons-material/DragHandle'
import LogEditorButton from '../components/LogEditorButton'

const Room = () => {
  const [dividerPosition, setDividerPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleDividerDrag = (e) => {
    const newDividerPosition = Math.max(20, Math.min((e.clientX / window.innerWidth) * 100, 80)) // Limiting the movement between 20% and 80%
    setDividerPosition(newDividerPosition)
  }

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      document.addEventListener('mousemove', handleDividerDrag)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleDividerDrag)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleDividerDrag])

  return (
    <Grid container spacing={3} style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Problem Description Section */}
      <Grid item style={{ flex: `0 0 ${dividerPosition}%`, position: 'relative' }}>
        <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
          <Typography variant="h5">Problem Title</Typography>
          <Typography variant="subtitle1" color="textSecondary">Difficulty: Easy</Typography>
          <Typography variant="body1" paragraph>
            Here is the problem description. It should explain what the problem is
            and what the user is expected to do in order to solve it.
          </Typography>
        </Paper>
      </Grid>

      {/* Divider */}
      <div
        style={{
          width: '2px',
          background: '#ccc',
          cursor: 'col-resize',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `calc(${dividerPosition}% - 1px)`,
          display: 'flex',
          alignItems: 'center',
          zIndex: 1,
        }}
        onMouseDown={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
      >
        <DividerIcon style={{ fontSize: '16px', color: '#666' }} />
      </div>

      {/* Playground and Submit Section */}
      <Grid item style={{ flex: `0 0 ${100 - dividerPosition}%` }}>
        <Paper elevation={3} style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>

          {/* Playground */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', overflowX: 'hidden', whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxHeight: 'calc(100vh - 64px - 68px)' }}>
            <Typography variant="h6">Playground</Typography>
            <TextEditor />
          </div>

          {/* Submit Section */}
          <Paper elevation={3} style={{ padding: '16px' }}>
            <LogEditorButton />
          </Paper>
          
        </Paper>
      </Grid>

    </Grid>
  )
}

export default Room
