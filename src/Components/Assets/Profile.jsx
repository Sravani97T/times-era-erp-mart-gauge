// import React, { useState, useEffect } from "react";
// import { Form, Input, Button, Radio, Row, Col } from "antd";
// import { EditOutlined } from "@ant-design/icons";
// import axios from "axios";
// import DropdownSearch from "../Context/Dropdown";
// import { CREATE_jwel } from "../../Config/Config";

// const FirmConfigure = () => {
//   const [form] = Form.useForm();
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${CREATE_jwel}/api/Erp/GetFirmConfihure`);
//         const data = response.data[0];
//         form.setFieldsValue({
//           firmName: data.FIRMNAME,
//           code: data.CODE,
//           address: `${data.ADD1} ${data.ADD2}`,
//           city: data.CITY,
//           gstin: data.TINNO.split(": ")[1],
//           financialYear: data.FYEAR,
//           financialYearCode: data.FCODE,
//           firmPhone: data.FMOBILE,
//           ownerName: data.OWNERNAME,
//           mobile1: data.MOBILE,
//           mobile2: data.MOBILE1,
//           email: data.EMAIL,
//           password: data.EPASS1,
//           pincode: "",
//           confirmPassword: data.EPASS2,
//           gstType: data.GST ? "gst" : data.REGULAR ? "regular" : "composition",
//           tax: data.COMPDLRTAX,
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [form]);

//   const handleEditClick = () => {
//     setIsEditing(!isEditing);
//   };

//   const handleSubmit = (values) => {
//     console.log("Form Submitted:", values);
//     setIsEditing(false); // Disable editing after submission
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 500,
//         margin: "auto",
//         padding: 15,
//         borderRadius: 8,
//         position: "relative",
//         boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//         backgroundColor: "#fff",
//       }}
//     >
//       {/* Edit Icon in Top-Right Corner */}
//       <EditOutlined
//         onClick={handleEditClick}
//         style={{
//           fontSize: 16,
//           position: "absolute",
//           top: 10,
//           right: 10,
//           cursor: "pointer",
//           color: "#1890ff",
//         }}
//       />

//       <h2 style={{ textAlign: "center", marginBottom: 10 }}>FIRM CONFIGURE</h2>
// <DropdownSearch/>
//       <Form
//         form={form}
//         layout="horizontal"
//         labelCol={{ style: { width: "140px", textAlign: "left" } }} // Fix label width
//         wrapperCol={{ style: { flex: 1 } }} // Inputs take remaining space
//         onFinish={handleSubmit}
//       >
//         <Row gutter={[16, 8]}>
//           {[
//             { label: "Firm Name", name: "firmName" },
//             { label: "Code", name: "code" },
//             { label: "Address", name: "address", type: "textarea" },
//             { label: "City", name: "city" },
//             { label: "GSTIN", name: "gstin" },
//             { label: "Financial Year", name: "financialYear" },
//             { label: "Financial Year Code", name: "financialYearCode" },
//             { label: "Firm Phone No.", name: "firmPhone" },
//             { label: "Owner Name", name: "ownerName" },
//             { label: "Mobile No.1", name: "mobile1" },
//             { label: "Mobile No.2", name: "mobile2" },
//             { label: "E-Mail Id1", name: "email", type: "email" },
//             { label: "Password", name: "password", type: "password" },
//             { label: "Pincode", name: "pincode" },
//           ].map(({ label, name, type }) => (
//             <Col span={24} key={name}>
//               <Form.Item label={label} name={name}>
//                 {type === "textarea" ? (
//                   <Input.TextArea rows={2} disabled={!isEditing} />
//                 ) : type === "password" ? (
//                   <Input.Password disabled={!isEditing} />
//                 ) : (
//                   <Input type={type} disabled={!isEditing} />
//                 )}
//               </Form.Item>
//             </Col>
//           ))}

//           {/* GST Type */}
//           <Col span={24}>
//             <Form.Item label="GST Type" name="gstType">
//               <Radio.Group disabled={!isEditing}>
//                 <Radio value="gst">GST</Radio>
//                 <Radio value="composition">Composition Dealer</Radio>
//                 <Radio value="regular">Regular</Radio>
//               </Radio.Group>
//             </Form.Item>
//           </Col>

//           {/* TAX (%) */}
//           <Col span={24}>
//             <Form.Item label="TAX (%)" name="tax">
//               <Input type="number" disabled={!isEditing} />
//             </Form.Item>
//           </Col>

//           {/* Save Button */}
//           <Col span={24} style={{ textAlign: "center" }}>
//             <Button type="primary" htmlType="submit" disabled={!isEditing}>
//               Save
//             </Button>
//           </Col>
//         </Row>
        
//       </Form>
//     </div>




//   );
// };

// export default FirmConfigure;
import React from "react";

const Dashboard = () => {
  return <h1>Profile</h1>;
};

export default Dashboard;