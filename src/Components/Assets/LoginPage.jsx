import React, { useEffect } from "react";
import { Card, Button, Form, Input, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/textLogo.png";
import { CREATE_jwel } from "../../Config/Config";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (localStorage.getItem("isLoggedIn") === "true") {
  //     navigate("/dashboard");
  //   }
  // }, [navigate]);
  useEffect(() => {
    if (localStorage.getItem("tenantName")) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [navigate]);
  const onFinish = async (values) => {
    const { username, password } = values;
    try {
      // First API call (existing)
      const response1 = await fetch(
        `${CREATE_jwel}/api/Tenant/CheckValidTenantWithName?userName=${username}&password=${password}&clientName=MADHU`
      );
      const data1 = await response1.json();

      // Second API call (new)
      const response2 = await fetch(
        `${CREATE_jwel}/api/Tenant/CheckValidTenantWithName?userName=${username}&password=${password}&clientName=LOAN`
      );
      const data2 = await response2.json();

      if (data2.tenantName) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("tenantName", data2.tenantName);
        onLogin(data2.tenantName);
        navigate("/dashboard");
      } else {
        console.log("Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#001529",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
          borderRadius: "10px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "900px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          flexWrap: "wrap",
        }}
      >
        {/* Left Side */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#001529",
            color: "white",
            minWidth: "280px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "150px",
              marginBottom: "1rem",
              objectFit: "contain",
            }}
          />
          <h2 style={{ color: "white" }}>Log-In</h2>
          <p style={{ color: "lightgray" }}>Please log in to access your account</p>
        </div>

        {/* Right Side */}
        <div
          style={{
            flex: 1,
            minWidth: "280px",
            padding: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card bordered={false} style={{ width: "100%", maxWidth: "350px" }}>
            <h2 style={{ marginBottom: "0.5rem" }}>Login</h2>
            <p style={{ marginBottom: "1.5rem" }}>Log in to your account to continue</p>
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please input your username!" }]}
              >
                <Input size="large" placeholder="Username" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password size="large" placeholder="Password" />
              </Form.Item>
              <Form.Item className="remember-forgot" style={{ display: "flex", justifyContent: "space-between" }}>
                <Checkbox>Remember me</Checkbox>
                <a href="/" style={{ fontSize: "0.85rem" }}>
                  Forgot password?
                </a>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
