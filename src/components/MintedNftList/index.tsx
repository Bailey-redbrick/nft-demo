import React, { FC, useEffect, useState } from "react";
import Web3 from "web3";
import { mintAnimalTokenContract, saleAnimalTokenAddress, saleAnimalTokenContract } from "../../contracts";
import { MainProps } from "../../Routes/main";
import { nftImage } from "../AnimalCard";

export interface AnimalInfo {
  animalTokenId: string;
  animalType: string;
  animalPrice: string;
}

const index: FC<MainProps> = ({ account }) => {
  const [animalCardArray, setAnimalCardArray] = useState<AnimalInfo[]>();
  const [saleStatus, setSaleStatus] = useState<boolean>();
  const web3 = new Web3();

  const getAnimalTokens = async () => {
    try {
      const balanceLength = await mintAnimalTokenContract.methods.balanceOf(account).call();

      let tempAnimalCardArray = [];

      for (let i = 0; i < parseInt(balanceLength, 10); i++) {
        const animalTokenId = await mintAnimalTokenContract.methods.tokenOfOwnerByIndex(account, i).call();

        const animalType = await mintAnimalTokenContract.methods.animalTypes(animalTokenId).call();

        const animalPrice = await saleAnimalTokenContract.methods.animalTokenPrices(animalTokenId).call();
        tempAnimalCardArray.push({ animalTokenId, animalType, animalPrice });
      }

      setAnimalCardArray(tempAnimalCardArray);
    } catch (err) {
      console.error(err);
    }
  };

  const getIsApprovedForAll = async () => {
    try {
      const response = await mintAnimalTokenContract.methods.isApprovedForAll(account, saleAnimalTokenContract).call();
      if (response) {
        setSaleStatus(response);
      }
    } catch (err) {
      //
    }
  };

  const onClickApproveToggle = async () => {
    console.log("onclick approve toggle", account);
    try {
      if (!account) return;

      const response = await mintAnimalTokenContract.methods.setApprovalForAll(saleAnimalTokenAddress, !saleStatus).send({ from: account });
      console.log(response);
      if (response.status) {
        setSaleStatus(!saleStatus);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setPrice = async () => {
    console.log("setPrice");
    const testNFT: AnimalInfo | null = animalCardArray ? animalCardArray[0] : null;
    const sellPrice = "1.1";
    console.log(testNFT, sellPrice);
    try {
      if (!account || !saleStatus) return;

      const response = await saleAnimalTokenContract.methods.setForSaleAnimalToken(testNFT && testNFT.animalTokenId, web3.utils.toWei(sellPrice, "ether")).send({ from: account });
      console.log("setPrice", response);
      if (response.status) {
        getAnimalTokens();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!account) return;
    getAnimalTokens();
    getIsApprovedForAll();
  }, [account]);

  useEffect(() => {
    console.log("animalCardArray:", animalCardArray);
  }, [animalCardArray]);

  useEffect(() => {
    console.log("saleStatus", saleStatus);
  }, [saleStatus]);

  return (
    <div>
      <button onClick={onClickApproveToggle}>{saleStatus ? "for sale" : "not for sale"}</button>
      <button onClick={setPrice}>set price</button>
      {/* {animalCardArray?.map((cardNum) => (
        <li>
          <img src={nftImage(cardNum)}></img>
        </li>
      ))} */}
    </div>
  );
};

export default index;
