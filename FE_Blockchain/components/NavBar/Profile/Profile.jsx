import React from "react";
import Image from "next/image";
// import React, { useState, useEffect, useContext } from "react";
import { FaUserAlt, FaRegImage, FaUserEdit } from "react-icons/fa";
import { MdHelpCenter } from "react-icons/md";
import { TbDownloadOff, TbDownload } from "react-icons/tb";
import Link from "next/link";
import { useRouter } from "next/router";
// INTERNAL IMPORT
import Style from "./Profile.module.css";
import images from "../../../img";
import { useContext } from "react";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const Profile = ({ currentAccount }) => {
  const router = useRouter();
  const { user } = useContext(NFTMarketplaceContext);

  const handleDisconnect = () => {
    // Xóa thông tin tài khoản đã kết nối
    localStorage.removeItem("walletAddress"); // Hoặc Redux, Context, etc.
    // Điều hướng về trang Home
    router.push("/");
    // Hiển thị thông báo (nếu cần)
    alert("Disconnected from MetaMask");
  };
  return (
    <div className={Style.profile}>
      <div className={Style.profile_account}>
        <Image
          src={user.avatar || images.user1}
          alt="user profile"
          width={50}
          height={50}
          style={{ width: "50px", height: "50px" }}
          className={Style.profile_account_img}
        />
        <div className={Style.profile_account_info}>
          <p>{user.name}</p>
          <small>{currentAccount.slice(0, 18)}...</small>
        </div>
      </div>
      <div className={Style.profile_menu}>
        <div className={Style.profile_menu_one}>
          <div className={Style.profile_menu_one_item}>
            <FaUserAlt />
            <p>
              <Link href={{ pathname: "/author" }}>My Profile</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
            <FaUserEdit />
            <p>
              <Link href={{ pathname: "/account" }}>Edit Profile</Link>
            </p>
          </div>
        </div>
        <div className={Style.profile_menu_two}>
          <div className={Style.profile_menu_one_item}>
            <MdHelpCenter />
            <p>
              <Link href={{ pathname: "/contactus" }}>Help</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
            <FaRegImage />
            <p>
              <Link href={{ pathname: "/aboutus" }}>My Items</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
            <TbDownload />
            <p>
              <Link href="/" onClick={handleDisconnect}>
                Disconnet
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
