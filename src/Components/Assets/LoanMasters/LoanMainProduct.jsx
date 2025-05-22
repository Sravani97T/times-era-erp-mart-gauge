import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Table,
  Space,
  Popconfirm,
  message,
  Row,
  Col,
  Breadcrumb,
  Card,
  Pagination
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "../../../Components/Assets/css/Style.css";
import { CREATE_jwel } from "../../../Config/Config";
import TableHeaderStyles from "../../../Utils/TableHeaderStyles";
// import UploadImg  from "../Utiles/UploadImg"
const LoanMainProduct = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [oldProductName, setOldProductName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const tenantNameHeader = localStorage.getItem("tenantName") ;
  console.log("tenantNameHeader",tenantNameHeader)
  const mainprodRef = useRef(null);
  const gstRef = useRef(null);
  const pgstRef = useRef(null);
  const barCodeRef = useRef(null);
  const checkRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=MAIN_PRODUCT`,
          { headers: { tenantName: tenantNameHeader } }
        );
        const formattedData = response.data.map((item, index) => ({
          key: index,
          sno: index + 1,
          mainProduct: item.MNAME || "",
          barcodePrefix: item.PREFIX || "",
        }));
        setData(formattedData);
      } catch (error) {
        message.error("Failed to fetch product data.");
      }
    };

    fetchData();
  }, []);

const handleAdd = async (values) => {
  const upperCaseProduct = values.mainProduct.toUpperCase();
  form.setFieldsValue({ mainProduct: upperCaseProduct });

  try {
    // The API expects an array of objects for loanMainProducts
    const requestBody = [
      {
        mname: upperCaseProduct,
        prefix: values.barcodePrefix,
      }
    ];

    const response = await axios.post(
      `${CREATE_jwel}/api/Loan/InsertLoanMainProduct`,
      requestBody,
      { headers: { tenantName: tenantNameHeader } }
    );

    if (response.data) {
      const newProduct = {
        key: response.data.ID || `${upperCaseProduct}-${Date.now()}`,
        sno: data.length + 1,
        mainProduct: upperCaseProduct,
        gst: values.gst,
        pgst: values.pgst,
        barcodePrefix: values.barcodePrefix,
        includingGst: values.includingGst,
      };
      setData((prevData) => [...prevData, newProduct]);
      form.resetFields();
      message.success("Product added successfully!");
    } else {
      message.error("Failed to add product.");
    }
  } catch (error) {
    console.error("Error adding product:", error);
    message.error("An error occurred while adding the product.");
  }
};

 const handleDelete = async (key, mainProduct) => {
  try {
    // Encode the mainProduct value for the URL
    const whereClause = encodeURIComponent(`MNAME='${mainProduct}'`);
    const response = await axios.post(
      `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=MAIN_PRODUCT&where=${whereClause}`,
      {},
      { headers: { tenantName: tenantNameHeader } }
    );

    if (response.data === true) {
      setData((prevData) => prevData.filter((item) => item.mainProduct !== mainProduct));
      message.success("Product deleted successfully!");
    } else {
      message.error("Failed to delete product.");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    message.error("An error occurred while deleting the product.");
  }
};


  const handleEdit = (product) => {
    setOldProductName(product.mainProduct);
    form.setFieldsValue({
      mainProduct: product.mainProduct,
      gst: product.gst,
      pgst: product.pgst,
      barcodePrefix: product.barcodePrefix,
      includingGst: product.includingGst,
    });
    setEditingKey(product.key);
  };

  const handleSave = async () => {
    const updatedData = form.getFieldsValue();
    const newMainProduct = updatedData.mainProduct.toUpperCase(); // Convert to uppercase

    // Check if the form values are the same as the original values
    if (
      newMainProduct === oldProductName &&
      updatedData.gst === data.find((item) => item.mainProduct === oldProductName).gst &&
      updatedData.pgst === data.find((item) => item.mainProduct === oldProductName).pgst &&
      updatedData.barcodePrefix === data.find((item) => item.mainProduct === oldProductName).barcodePrefix &&
      updatedData.includingGst === data.find((item) => item.mainProduct === oldProductName).includingGst
    ) {
      form.resetFields();
      setEditingKey(null);
      return; // Stop further processing
    }

    try {
      const searchResponse = await axios.get(
        `${CREATE_jwel}/api/Master/MasterMainProductSearch?MName=${newMainProduct}`,
        { headers: { tenantName: tenantNameHeader } }
      );

      if (searchResponse.data.length > 0 && newMainProduct !== oldProductName) {
        message.error("Main product already exists!");
        return;
      }

      if (newMainProduct !== oldProductName) {
        // Use the same API as handleDelete for deleting the old product
        const whereClause = encodeURIComponent(`MNAME='${oldProductName}'`);
        await axios.post(
          `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=MAIN_PRODUCT&where=${whereClause}`,
          {},
          { headers: { tenantName: tenantNameHeader } }
        );
      }

      const requestBody = [
        {
          mname: newMainProduct,
          prefix: updatedData.barcodePrefix,
        }
      ];

      const response = await axios.post(
        `${CREATE_jwel}/api/Loan/InsertLoanMainProduct`,
        requestBody,
        { headers: { tenantName: tenantNameHeader } }
      );

      if (response.data) {
        const updatedRecord = {
          key: editingKey,
          sno: data.find((item) => item.key === editingKey).sno,
          mainProduct: newMainProduct,
          gst: updatedData.gst,
          pgst: updatedData.pgst,
          barcodePrefix: updatedData.barcodePrefix,
          includingGst: updatedData.includingGst,
        };

        setData((prevData) =>
          prevData.map((item) => (item.key === editingKey ? updatedRecord : item))
        );

        form.resetFields();
        setEditingKey(null);
        message.success("Product updated successfully!");
      } else {
        message.error("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("An error occurred while updating the product.");
    }
  };

  const handleMainProductChange = async (e) => {
    const enteredProduct = e.target.value.toUpperCase(); // Ensure product name is uppercase
    form.setFieldsValue({ mainProduct: enteredProduct });

    // If the entered product is the same as the current one, no need to check
    if (enteredProduct === oldProductName) {
      return; // Exit early, no need to check for duplication
    }

    try {
      const searchResponse = await axios.get(
        `${CREATE_jwel}/api/Master/MasterMainProductSearch?MName=${enteredProduct}`,
        { headers: { tenantName: tenantNameHeader } }
      );

      // Show the message only if the new product name exists
      if (searchResponse.data.length > 0) {
        message.error("Main product already exists!");
      }
    } catch (error) {
      console.error("Error checking product existence:", error);
      // message.error("An error occurred while checking the product.");
    }
  };

  const handleCancel = useCallback(() => {
    form.resetFields();
    setEditingKey(null);
  }, [form]);

  const filteredData = data.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      className: 'blue-background-column', 
      width: 50, 
    },
    {
      title: "Main Product",
      dataIndex: "mainProduct",
      key: "mainProduct",
    },
  
    {
      title: "Barcode Prefix",
      dataIndex: "barcodePrefix",
      key: "barcodePrefix",
      align: "center"
    },
   
    {
      title: "Action",
      key: "action",
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={editingKey === record.key}
          />
          <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.key, record.mainProduct)}
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEnterPress = (e, nextFieldRef) => {
    e.preventDefault();
    if (nextFieldRef.current) {
      nextFieldRef.current.focus();
    }
  };

return (
    <div style={{ backgroundColor: "#f4f6f9" }}>
        <Row justify="start" style={{ marginBottom: "10px" }}>
            <Col>
                <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                    <Breadcrumb.Item>Masters</Breadcrumb.Item>
                    <Breadcrumb.Item> Loan Main Product</Breadcrumb.Item>
                </Breadcrumb>
            </Col>
        </Row>

        <Card
            title={editingKey ? "Edit Product" : "Add Product"}
            style={{
                marginBottom: "10px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={editingKey ? handleSave : handleAdd}
            >
                <Row gutter={[16, 16]}>
    <Col xs={24} sm={12}>
      <Form.Item
        name="mainProduct"
        label="Main Product"
        rules={[{ required: true, message: "Main Product is required" }]}
      >
        <Input
          placeholder="Main Product"
          ref={mainprodRef}
          onPressEnter={(e) => {
            e.preventDefault();
            if (barCodeRef.current) {
              barCodeRef.current.focus();
            }
          }}
          onChange={handleMainProductChange}
          onBlur={handleMainProductChange}
        />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12}>
      <Form.Item name="barcodePrefix" label="Barcode Prefix" rules={[{ required: true }]}>
        <Input
          placeholder="Barcode Prefix"
          ref={barCodeRef}
          onPressEnter={(e) => {
            e.preventDefault();
            form.submit(); // Submit the form on Enter in the last field
          }}
        />
      </Form.Item>
    </Col>
  </Row>
                <Row>
                    <Col span={24}>
                        <div style={{ display: "flex", justifyContent: "flex-end" ,marginTop:"10px"}}>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="animated-button"
                                    style={{
                                        marginRight: 8,
                                    }}
                                >
                                    {editingKey ? "Save" : "Submit"}
                                </Button>
                                <Button
                                    htmlType="button"
                                    onClick={handleCancel}
                                    style={{ backgroundColor: "#f0f0f0" }}
                                >
                                    Cancel
                                </Button>
                            </Form.Item>
                        </div>
                    </Col>
                </Row>
            </Form>
            {/* <UploadImg/> */}
        </Card>

        <div style={{ float: "right", marginBottom: "10px", marginLeft: "5px" }}>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredData.length}
                showSizeChanger
                pageSizeOptions={['10', '20', '50', '100']}
                onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                }}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                style={{ marginBottom: "10px" }}
            />
        </div>

        <div style={{ float: "right", marginBottom: "10px" }}>
            <Input.Search
                placeholder="Search"
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
            />
        </div>

        <TableHeaderStyles>
            <Table
                columns={columns}
                dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                rowKey="key"
                size="small"
                pagination={false}
                style={{
                    background: "#fff",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                }}
            />
        </TableHeaderStyles>
    </div>
);
};

export default LoanMainProduct;