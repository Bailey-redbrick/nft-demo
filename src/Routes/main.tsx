import React, { FC, useEffect, useState } from "react";
import { mintAnimalTokenContract, saleAnimalTokenContract } from "../contracts";
import AnimalCard from "../components/AnimalCard";
import MintedNFTList from "../components/MintedNftList";

export interface MainProps {
  account: string;
}

const Main: FC<MainProps> = ({ account }) => {
  const [newAnimalType, setNewAnimalType] = useState<string>();
  const tempAnimalCardArray: object[] = [];
  const onClickMint = async () => {
    console.log(account);
    try {
      if (!account) return;
      const response = await mintAnimalTokenContract.methods.mintAnimalToken().send({ from: account }); //mint nft
      console.log(response);

      if (response.status) {
        //if minting succeeded
        const balanceLength = await mintAnimalTokenContract.methods.balanceOf(account).call();
        //get total length of accounts
        const animalTokenId = await mintAnimalTokenContract.methods.tokenOfOwnerByIndex(account, parseInt(balanceLength.length, 10) - 1).call();
        //get the most recent account's token by index
        const animalType = await mintAnimalTokenContract.methods.animalTypes(animalTokenId).call();
        //get animalType of the token

        const animalPrice = await saleAnimalTokenContract.methods.animalTokenPrices(animalTokenId).call();
        tempAnimalCardArray.push({ animalTokenId, animalType, animalPrice });
        setNewAnimalType(animalType);
        console.log(balanceLength, animalTokenId, animalType, tempAnimalCardArray);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {!newAnimalType && <button onClick={onClickMint}>Mint animal card</button>}
      <AnimalCard animalType={newAnimalType || "default"} />
      <MintedNFTList account={account} />
    </div>
  );
};

export default Main;
