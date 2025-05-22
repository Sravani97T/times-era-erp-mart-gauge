import React, { useState, useEffect } from "react";
import { Avatar, Dropdown, Button, Space, Typography } from "antd";
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const Header = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuClick = ({ key }) => {
    if (key === "1") {
        navigate("/settings");
    } else if (key === "2") {
        navigate("/profile");
    } else if (key === "3") {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("tenantName");
        navigate("/");
        window.location.reload(); // Ensure fresh login state
    }
};


  const userMenu = {
    items: [
      {
        key: "1",
        icon: <SettingOutlined />,
        label: "Settings",
      },
      {
        key: "2",
        icon: <UserOutlined />,
        label: "Profile",
      },
      {
        key: "3",
        icon: <LogoutOutlined />,
        label: "Logout",
      },
    ],
    onClick: handleMenuClick,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
        background: "#fff",
        color: "#000",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined style={{ color: "#000" }} /> : <MenuFoldOutlined style={{ color: "#000" }} />}
        onClick={toggleSidebar}
      />
      <Dropdown menu={userMenu} placement="bottomRight">
        <Space>
          <Avatar size={30} icon={<UserOutlined />} />
          {!isMobile && <Text strong style={{ color: "#000" }}>Sravani Reddy</Text>}
        </Space>
      </Dropdown>
    </div>
  );
};

export default Header;
