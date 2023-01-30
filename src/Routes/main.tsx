import React, { FC, useState } from "react";
import { mintAnimalTokenContract } from "../contracts";

interface MainProps {
  account: string;
}

const Main: FC<MainProps> = ({ account }) => {
  const [newAnimalCard, setNewAnimalCard] = useState<string>();

  const onClickMint = async () => {
    console.log(account);
    try {
      if (!account) return;
      const response = await mintAnimalTokenContract.methods.mintAnimalToken().send({ from: account });
      console.log(response);

      if (response.status) {
        const balanceLength = await mintAnimalTokenContract.methods.balanceOf(account).call();
        const animalTokenId = await mintAnimalTokenContract.methods.tokenOfOwnerByIndex(account, parseInt(balanceLength.length, 10) - 1).call();
        const animalType = await mintAnimalTokenContract.methods.animalTypes(animalTokenId).call();
        setNewAnimalCard(animalType);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return <div>{!newAnimalCard && <button onClick={onClickMint}>Mint animal card</button>}</div>;
};

export default Main;
