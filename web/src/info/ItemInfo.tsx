import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useLocalStorage } from "@uidotdev/usehooks";
import { Box, Button } from '@mui/material';
import './ItemInfo.css';

class ApplicationState {
  static Assign = "Assign"
  static Departure = "Departure"
  static Arrivals = "Arrivals"
}

export const ItemInfo = () => {
  const { search } = useLocation();
  const [info, setInfo] = useState<string>("");
  const [applicationState, setApplicationState] = useLocalStorage("ApplicationState", ApplicationState.Assign);
  useEffect(() => {
    let ignore = false;

    async function startFetchingAsync() {
      const response = await fetch('https://petstore.swagger.io/v2/pet/1');
      if (!ignore) {
        try {
          const message = await response.json();
          console.log(JSON.stringify(message));
          setInfo(JSON.stringify(message));
        } catch (error) {
          console.error(error);
        }
      }
    }

    startFetchingAsync();

    return () => {
      ignore = true;
    };
  }, [search]);

  return (
    <Box className="parent">
      <Box>
        { applicationState == ApplicationState.Assign }
      </Box>
    </Box>
  )
}