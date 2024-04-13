import React, { useEffect } from 'react'


export default function Order() {

    useEffect(() => {
        console.log(window.Telegram.WebApp);
    }, []);
  return (
    <div>Order</div>
  )
}
