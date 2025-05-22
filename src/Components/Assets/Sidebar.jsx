import React, { useState } from "react";
import { Menu, Divider,  } from "antd";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  FileDoneOutlined,
 
  LineChartOutlined,
} from "@ant-design/icons";
import logo from "../Assets/textLogo.png"; // Import the logo

const Sidebar = ({ collapsed }) => {
  const [selectedKey, setSelectedKey] = useState(""); // Track the selected key for highlighting
  const [openKeys, setOpenKeys] = useState([]); // Track open submenu items

  const handleMenuClick = (e) => {
    setSelectedKey(e.key); // Update selected key on click
    if (e.key === "1") {
        setOpenKeys([]); // Close all submenus when Dashboard is clicked
    }

    // Preserve "isLoggedIn" and "tenantName" while clearing other localStorage items
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const tenantName = localStorage.getItem("tenantName");
    localStorage.clear(); // Clear all storage
    if (isLoggedIn) {
        localStorage.setItem("isLoggedIn", isLoggedIn); // Restore "isLoggedIn"
    }
    if (tenantName) {
        localStorage.setItem("tenantName", tenantName); // Restore "tenantName"
    }

    console.log("e", e);
};


  const handleSubMenuOpenChange = (keys) => {
    console.log("Submenu open keys:", keys);
    setOpenKeys(keys.length ? [keys[keys.length - 1]] : []); // Only keep the last opened submenu
  };

  const iconStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    color: "#000",
    width: "24px",
    height: "24px",
    borderRadius: "5px",
    padding: "0px",
  };

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined style={iconStyle} />,
      label: <Link to="/dashboard" style={{ color: "#fff" }}>Dashboard</Link>,
      style: !collapsed ? {
        backgroundColor: "#52BD91", // Light green background for Dashboard
        borderRadius: "10px",
        margin: "5px 0",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        border: "1px solid grey", // Grey border
        width: "227px",
        marginLeft: "20px",
        padding: "10px"
      } : {},
    },
    {
      key: "2",
      icon: <AppstoreOutlined style={iconStyle} />,
      label: <span style={{ color: "#fff" }}>Masters</span>,
      children: [
       
        { key: "2-22", label: <Link to="/loan-mainproduct" style={{ color: "#fff" }}>Main Product</Link> },
        { key: "2-23", label: <Link to="/Product-name" style={{ color: "#fff" }}>Product Name</Link> },
        { key: "2-24", label: <Link to="/purity-master" style={{ color: "#fff" }}>Purity Master</Link> },
        { key: "2-25", label: <Link to="/entry-mast" style={{ color: "#fff" }}>Entry Mast</Link> },

      ],
    },
  
  
    {
      key: "7",
      icon: <LineChartOutlined style={iconStyle} />,
      label: <span style={{ color: "#fff" }}>Payments</span>,
      children: [
        { key: "7-2", label: <Link to="/upload" style={{ color: "#fff" }}>Upload</Link> },
      ],
    },
  ];



  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        backgroundColor: "lightgreen",
      }}
    >
      {/* Logo */}
      {!collapsed && (
        <div
          style={{
            textAlign: "center",
            padding: "5px 0",
            backgroundColor: "#11083E",
          }}
        >
          <img src={logo} alt="Logo" style={{ width: "70%", height: "auto" }} />
        </div>
      )}

      <Menu
        mode="inline"
        theme="dark"
        style={{
          height: "calc(100vh - 50px)", // Leaves space for the sticky logo
          overflow: "hidden",
          backgroundColor: "#11083E", // Set the background color
          transition: "all 0.2s ease-in-out", // Add transition for quick expansion
        }}
        onClick={handleMenuClick} // Handle click event to select items
        selectedKeys={[selectedKey]} // Apply selected key for highlighting
        openKeys={openKeys} // Open submenu based on open keys
        onOpenChange={handleSubMenuOpenChange} // Handle submenu open state
      >
        {menuItems.map((menuItem) => {
          if (menuItem.children) {
            return (
              <Menu.SubMenu
                key={menuItem.key}
                icon={menuItem.icon}
                title={menuItem.label}
                style={{
                  maxHeight: "calc(100vh - 150px)", // Adjust height for submenu scroll
                  overflow: "hidden",
                }}
              >
                {/* Submenu Items */}
                <div
                  style={{
                    maxHeight: "280px", // Set a fixed height for scrolling
                    overflowY: "auto", // Enable vertical scrolling
                    scrollbarWidth: "thin", // Make scrollbar thin (for Firefox)
                    scrollbarColor: "rgba(255, 255, 255, 0.2) transparent", // Light scrollbar color
                  }}
                >
                  {/* Webkit scrollbar styling */}
                  {menuItem.children.map((submenu, index) => (
                    <React.Fragment key={submenu.key}>
                      <Menu.Item
                        key={submenu.key}
                        style={{
                          backgroundColor:
                            selectedKey === submenu.key ? "#aed2f385" : "transparent", // Highlight selected submenu item
                          borderRadius: selectedKey === submenu.key ? "10px" : "0px", // Rounded corners for selected item
                          position: "relative", // For positioning pseudo-element
                        }}
                      >
                        <span style={{ marginRight: "10px", color: "#fff" }}>
                          <AppstoreOutlined />
                        </span>
                        {submenu.label}
                        {selectedKey === submenu.key && (
                          <div
                            style={{
                              content: '""',
                              position: "absolute",
                              top: "-10px",
                              left: "-10px",
                              right: "-10px",
                              bottom: "-10px",
                              background: "rgba(173, 216, 230, 0.3)", // Light blue background for shape
                              borderRadius: "10px", // Rounded corners for the shape
                              zIndex: "-1", // Behind the text
                            }}
                          />
                        )}
                      </Menu.Item>
                      {index < menuItem.children.length - 1 && <Divider style={{ backgroundColor: "rgb(163 159 159)", padding: "0px", margin: "0px" }} />}
                    </React.Fragment>
                  ))}
                </div>
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item
                key={menuItem.key}
                icon={menuItem.icon}
                style={{
                  position: "relative", // Ensure the pseudo-element is positioned correctly
                  backgroundColor:
                    selectedKey === menuItem.key ? "#aed2f385" : "transparent", // Highlight when selected
                  margin: "5px 0", // Add margin for small card effect
                  border: "1px solid grey", // Grey border for menu item
                  ...menuItem.style, // Apply specific style for Dashboard
                }}
              >
                {menuItem.label}
                {selectedKey === menuItem.key && (
                  <div
                    style={{
                      content: '""',
                      position: "absolute",
                      top: "-10px",
                      left: "-10px",
                      right: "-10px",
                      bottom: "-10px",
                      background: "rgba(173, 216, 230, 0.3)", // Light blue background for shape
                      borderRadius: "10px", // Rounded corners for the shape
                      zIndex: "-1", // Behind the text
                    }}
                  />
                )}
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </div>
  );
};

export default Sidebar;
