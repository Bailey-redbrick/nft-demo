import React, { FC, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./Routes/main";

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main account={account} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
