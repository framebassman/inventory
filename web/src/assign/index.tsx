import { Box } from '@mui/material'
import './index.css'
import Camera from "./Camera.tsx";

export const Assign = () => {
  return (
    <Box className="parent" alignItems="center" justifyContent="center">
      <div className="child"><Camera/></div>
    </Box>
  )
}
