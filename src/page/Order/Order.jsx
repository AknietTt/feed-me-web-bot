import React, { useEffect, useState } from "react";

export default function Order() {
  const [jsonData, setJsonData] = useState("");

  useEffect(() => {
    console.log(window.Telegram.WebApp);
  }, []);

  return (
    <div>
      <pre>
        {JSON.stringify(window.Telegram.WebApp.initDataUnsafe)}
        {JSON.stringify(window.Telegram.WebApp.initDataUnsafe?.chat)}
        {/* {JSON.stringify(window.Telegram.WebApp.initDataUnsafe.user?.id)}
        {JSON.stringify(window.Telegram.WebApp.initDataUnsafe.chat?.id)} */}
      </pre>
    </div>
  );
}
