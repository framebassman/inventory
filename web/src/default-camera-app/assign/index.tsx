import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import './index.css';

const DefaultHi = () => {
  return (
    <div>There is no Search in path</div>
  )
}

export const Assign = () => {
  const { search } = useLocation();
  const [info, setInfo] = useState<string>("");
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

    if (search != '') {
      startFetchingAsync();
    }

    return () => {
      ignore = true;
    };
  }, [search]);
  
  if (search === '') {
    return <DefaultHi />
  } else {
    return (
      <div>{search}</div>
    )
  }
}
