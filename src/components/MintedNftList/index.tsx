import React, { FC, useEffect, useState } from "react";
import { mintAnimalTokenContract } from "../../contracts";
import { MainProps } from "../../Routes/main";
import { nftImage } from "../AnimalCard";

const index: FC<MainProps> = ({ account }) => {
  const [animalCardArray, setAnimalCardArray] = useState<string[]>();

  const getAnimalTokens = async () => {
    try {
      const balanceLength = await mintAnimalTokenContract.methods.balanceOf(account).call();

      let tempAnimalCardArray = [];

      for (let i = 0; i < parseInt(balanceLength, 10); i++) {
        const animalTokenId = await mintAnimalTokenContract.methods.tokenOfOwnerByIndex(account, i).call();

        const animalType = await mintAnimalTokenContract.methods.animalTypes(animalTokenId).call();

        tempAnimalCardArray.push(animalType);
      }

      setAnimalCardArray(tempAnimalCardArray);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!account) return;
    getAnimalTokens();
  }, [account]);

  useEffect(() => {
    console.log(animalCardArray);
  }, [animalCardArray]);

  return (
    <div>
      {/* {animalCardArray?.map((cardNum) => (
        <li>
          <img src={nftImage(cardNum)}></img>
        </li>
      ))} */}
    </div>
  );
};

export default index;
