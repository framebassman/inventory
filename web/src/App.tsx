import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Movement } from './movement';
import { Assign } from './Assign';
import { Menu } from './Menu';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D2274' // purple #2D2274
    },
    secondary: {
      main: '#3CA178', // green #3CA178
    }
  }
});

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Menu/>
        <Routes>
          <Route path='' element={<Movement/>}></Route>
          <Route path='/assign' element={<Assign/>}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
