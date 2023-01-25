import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';


export default function LoadingToRedirect({path}) {
    const [count, setCount]  = useState(5);
    let navigate = useNavigate();

    useEffect(()=>{
        const interval = setInterval(()=>{
            setCount((currentCount) => --currentCount)
        }, 1000);

        // redirect
        count === 0 && navigate(path)

        // cleanup
        return () => clearInterval(interval);
    }, [count]);

  return (
    <div className='container p5 text-center'>
        <p>Redirecting page in {count} seconds</p>
    </div>
  )
}
