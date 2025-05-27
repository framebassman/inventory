import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Movement } from './quagga/movement';
import { Assign } from './quagga/assign';
import { Menu } from './quagga/Menu.tsx';
import './App.css';
import { ItemInfo } from './info/ItemInfo';

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

export const routes = ['/', '/assign'];

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {/* <Menu/>
        <Routes>
          <Route path={routes[0].replace('/', '')} element={<Movement/>}></Route>
          <Route path={routes[1]} element={<Assign/>}></Route>
        </Routes> */}
        <ItemInfo />
      </BrowserRouter>
    </ThemeProvider>
  )
}
