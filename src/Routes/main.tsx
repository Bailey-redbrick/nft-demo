import React, { FC, useState } from "react";
import { mintAnimalTokenContract } from "../contracts";
import AnimalCard from "../components/AnimalCard";

interface MainProps {
  account: string;
}

const Main: FC<MainProps> = ({ account }) => {
  const [newAnimalType, setNewAnimalType] = useState<string>();

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
        setNewAnimalType(animalType);
        console.log(balanceLength, animalTokenId, animalType);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {!newAnimalType && <button onClick={onClickMint}>Mint animal card</button>}
      <AnimalCard animalType={newAnimalType || "default"} />
    </div>
  );
};

export default Main;
