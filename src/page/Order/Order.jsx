import React, { useEffect, useState } from "react";

export default function Order() {
  const [jsonData, setJsonData] = useState("");

  useEffect(() => {
    console.log(window.Telegram.WebApp);
  }, []);

  return (
    <div>
      <pre>
        {JSON.stringify(window.Telegram.WebApp.initData)}
        {JSON.stringify(window.Telegram.WebApp.initParams)}
        {JSON.stringify(window.Telegram.WebApp.initDataUnsafe)}
      </pre>
    </div>
  );
}
