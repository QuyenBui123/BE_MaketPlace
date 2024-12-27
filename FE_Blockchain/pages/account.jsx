import React, { useState, useMemo, useCallback, useContext } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
// INTERNAL IMPORT
import Style from "../styles/account.module.css";
import images from "../img";
import From from "../components/accountPage/Form/Form";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import axios from "axios";

const account = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const { user } = useContext(NFTMarketplaceContext);

  const onDrop = useCallback(
    async (acceptedFile) => {
      setFileUrl(acceptedFile[0]);

      const handleFileChange = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "huuthuat");

        if (file) {
          try {
            const response = await fetch(
              "https://api.cloudinary.com/v1_1/dya4as3kz/image/upload",
              {
                method: "POST",
                body: formData,
              }
            );

            const data = await response.json();
            if (data) {
              try {
                const response = await axios.put(
                  `http://localhost:5000/update_avatar/${user.wallet_address}`,
                  {
                    new_avatar: data.secure_url,
                  }
                );

                console.log(response.data);
                // Optionally, you can call a function to update the user data in the context
                // await handleGetUser(user.wallet_address);
              } catch (error) {
                console.error(error);
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      };

      await handleFileChange(acceptedFile[0]);
    },
    [user.wallet_address]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  return (
    <div className={Style.account}>
      <div className={Style.account_info}>
        <h1>Profile settings</h1>
        <p>
          You can set preferred display name, create your profile other person
        </p>
      </div>
      <div className={Style.account_box}>
        <div className={Style.account_box_img} {...getRootProps()}>
          <Image
            src={fileUrl ? URL.createObjectURL(fileUrl) : user.avatar}
            alt="account upload"
            width={150}
            height={150}
            style={{ width: "150px", height: "150px" }}
            className={Style.account_box_img_img}
          />
          <p className={Style.account_box_img_para}>Change Image</p>
        </div>
        <div className={Style.account_box_from}>
          <From user={user} />
        </div>
      </div>
    </div>
  );
};

export default account;
