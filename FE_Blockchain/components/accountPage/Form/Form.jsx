"use client";
import React, { use, useCallback, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import {
  MdOutlineHttp,
  MdOutlineContentCopy,
  MdOutlineLineAxis,
} from "react-icons/md";
import {
  TiSocialFacebook,
  TiSocialTwitter,
  TiSocialInstagram,
} from "react-icons/ti";
import { useEffect } from "react";

//INTERNAL IMPORT
import Style from "./Form.module.css";
import { Button } from "../../componentsindex";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Form = ({ user }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    website: "",
    facebook: "",
    twitter: "",
    instagram: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        description: user.description,
        website: user.website,
        facebook: user.facebook,
        twitter: user.twitter,
        instagram: user.instagram,
      });
    }
  }, [user]);
  console.log("User:", user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onDrop = useCallback(async (acceptedFile) => {
    setFileUrl(acceptedFile[0]);
  }, []);

  async function onSubmit(event) {
    event.preventDefault();

    const data = {
      ...formData,
    };

    console.log("formData:", formData);

    const response = await axios.put(
      `http://localhost:5000/update_info/${user.wallet_address}`,
      {
        body: JSON.stringify(data),
      }
    );

    toast.success("Edit profile successful!", {
      position: "top-center",
      autoClose: 2000,
      theme: "light",
      pauseOnHover: "true",
      hideProgessBar: "true",
    });

    if (response.ok) {
      console.log("Edit successful");
    }

    router.push("/author");
  }

  return (
    <div className={Style.Form}>
      <div className={Style.Form_box}>
        <form onSubmit={onSubmit}>
          <div className={Style.Form_box_input}>
            <label htmlFor="name">UserName</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              className={Style.Form_box_input_userName}
            />
          </div>
          <div className={Style.Form_box_input}>
            <label htmlFor="email">Email</label>
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <HiOutlineMail />
              </div>
              <input
                onChange={handleChange}
                value={formData.email}
                name="email"
                type="text"
                placeholder="Email*"
              />
            </div>
          </div>
          <div className={Style.Form_box_input}>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id=""
              cols="30"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              placeholder="Some thing about yourself"
            ></textarea>
          </div>
          <div className={Style.Form_box_input}>
            <label htmlFor="website"> </label>
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <MdOutlineHttp />
              </div>
              <input
                onChange={handleChange}
                value={formData.website}
                name="website"
                type="text"
                placeholder="website"
              />
            </div>
          </div>
          <div className={Style.Form_box_input_social}>
            <div className={Style.Form_box_input}>
              <label htmlFor="facebook">FaceBook</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <TiSocialFacebook />
                </div>
                <input
                  onChange={handleChange}
                  value={formData.facebook}
                  name="facebook"
                  type="text"
                  placeholder="https://ronalse"
                />
              </div>
            </div>
            <div className={Style.Form_box_input}>
              <label htmlFor="Twitter">Twitter</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <TiSocialTwitter />
                </div>
                <input
                  onChange={handleChange}
                  value={formData.twitter}
                  name="twitter"
                  type="text"
                  placeholder="https://ronalse"
                />
              </div>
            </div>
            <div className={Style.Form_box_input}>
              <label htmlFor="Instagram">Instagram</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <TiSocialInstagram />
                </div>
                <input
                  onChange={handleChange}
                  value={formData.instagram}
                  name="instagram"
                  type="text"
                  placeholder="https://ronalse"
                />
              </div>
            </div>
          </div>
          <div className={Style.Form_box_input}>
            <label htmlFor="wallet">Wallet</label>
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <MdOutlineHttp />
              </div>
              <input
                type="text"
                value={user.wallet_address}
                disabled
                style={{ cursor: "not-allowed" }}
              />
              <div className={Style.Form_box_input_box_icon}>
                <MdOutlineContentCopy />
              </div>
            </div>
          </div>
          <div className={Style.Form_box_btn}>
            <Button
              type="submit"
              btnName="Upload profile"
              handleClick={() => {}}
              classStyle={Style.button}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
