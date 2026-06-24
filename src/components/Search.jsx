import { TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

function Search({ value, onChange }) {
  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder="Search by email..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        width: 460,
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: '#fff',
        },
      }}
    />
  )
}

export default Search
