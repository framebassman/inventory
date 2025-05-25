import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Movement } from './movement';
import { Assign } from './Assign';
import './App.css';
import { Menu } from './Menu';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Menu/>
      <Routes>
        <Route path='' element={<Movement/>}></Route>
        <Route path='/assign' element={<Assign/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
