import React, { FC, useEffect, useState } from "react";

const App: FC = () => {
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    const getAccount = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          setAccount(accounts[0]);
        } else {
          alert("install metamask");
        }
      } catch (err) {
        console.error(err);
      }
    };
    getAccount();
  }, []);

  useEffect(() => {
    console.log(account);
  }, [account]);
  return <div>{account ? account : "connect wallet"}</div>;
};

export default App;
