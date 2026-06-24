export const cardSx = {
  width: 'min(90vw, 380px)',
  px: 3.5,
  py: 4,
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

export const formSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

export const buttonSx = {
  borderRadius: 999,
  textTransform: 'none',
  fontWeight: 600,
  py: 1,
}

export const primaryButtonSx = {
  ...buttonSx,
  backgroundColor: '#6366f1',
  '&:hover': { backgroundColor: '#4f46e5' },
}

export const secondaryButtonSx = {
  ...buttonSx,
  borderColor: '#6366f1',
  color: '#6366f1',
  '&:hover': { borderColor: '#4f46e5', backgroundColor: '#f5f3ff' },
}
