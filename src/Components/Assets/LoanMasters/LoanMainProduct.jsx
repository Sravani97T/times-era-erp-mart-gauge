import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Form,
  Input,
  Button,
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

const LoanMainProduct = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [oldProduct, setOldProduct] = useState({ mainProduct: "", barcodePrefix: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const tenantNameHeader = localStorage.getItem("tenantName");
  const mainprodRef = useRef(null);
  const barCodeRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=MAIN_PRODUCT`,
          { headers: { tenantName: tenantNameHeader } }
        );
        const formattedData = (response.data || []).map((item, index) => ({
          key: `${item.MNAME || ""}-${item.PREFIX || ""}`,
          sno: index + 1,
          mainProduct: item.MNAME || "",
          barcodePrefix: item.PREFIX || "",
        }));
        setData(formattedData);
      } catch {
        message.error("Failed to fetch product data.");
      }
    };
    fetchData();
  }, []);

  // Add
  const handleAdd = async (values) => {
    const mainProduct = values.mainProduct.toUpperCase();
    const barcodePrefix = values.barcodePrefix;
    form.setFieldsValue({ mainProduct, barcodePrefix });

    // Check duplicate
    if (data.some(d => d.mainProduct === mainProduct && d.barcodePrefix === barcodePrefix)) {
      message.error("Main product with this barcode prefix already exists!");
      return;
    }

    try {
      const requestBody = [{ mname: mainProduct, prefix: barcodePrefix }];
      const response = await axios.post(
        `${CREATE_jwel}/api/Loan/InsertLoanMainProduct`,
        requestBody,
        { headers: { tenantName: tenantNameHeader } }
      );
      if (response.data) {
        setData(prev => [
          ...prev,
          {
            key: `${mainProduct}-${barcodePrefix}`,
            sno: prev.length + 1,
            mainProduct,
            barcodePrefix,
          }
        ]);
        form.resetFields();
        message.success("Product added successfully!");
      } else {
        message.error("Failed to add product.");
      }
    } catch {
      message.error("An error occurred while adding the product.");
    }
  };

  // Delete
  const handleDelete = async (key, mainProduct, barcodePrefix) => {
    try {
      const whereClause = encodeURIComponent(`MNAME='${mainProduct}' AND PREFIX='${barcodePrefix}'`);
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=MAIN_PRODUCT&where=${whereClause}`,
        {},
        { headers: { tenantName: tenantNameHeader } }
      );
      if (response.data === true) {
        setData(prev => prev.filter(item => !(item.key === key)));
        message.success("Product deleted successfully!");
      } else {
        message.error("Failed to delete product.");
      }
    } catch {
      message.error("An error occurred while deleting the product.");
    }
  };

  // Edit
  const handleEdit = (record) => {
    setOldProduct({ mainProduct: record.mainProduct, barcodePrefix: record.barcodePrefix });
    form.setFieldsValue({
      mainProduct: record.mainProduct,
      barcodePrefix: record.barcodePrefix,
    });
    setEditingKey(record.key);
  };

  // Save
  const handleSave = async () => {
    const updated = form.getFieldsValue();
    const mainProduct = updated.mainProduct.toUpperCase();
    const barcodePrefix = updated.barcodePrefix;

    // No change
    if (
      mainProduct === oldProduct.mainProduct &&
      barcodePrefix === oldProduct.barcodePrefix
    ) {
      form.resetFields();
      setEditingKey(null);
      return;
    }

    // Duplicate check
    if (
      data.some(
        d =>
          d.mainProduct === mainProduct &&
          d.barcodePrefix === barcodePrefix &&
          d.key !== editingKey
      )
    ) {
      message.error("Main product with this barcode prefix already exists!");
      return;
    }

    try {
      // If mainProduct/barcodePrefix changed, delete old
      if (
        mainProduct !== oldProduct.mainProduct ||
        barcodePrefix !== oldProduct.barcodePrefix
      ) {
        const whereClause = encodeURIComponent(
          `MNAME='${oldProduct.mainProduct}' AND PREFIX='${oldProduct.barcodePrefix}'`
        );
        await axios.post(
          `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=MAIN_PRODUCT&where=${whereClause}`,
          {},
          { headers: { tenantName: tenantNameHeader } }
        );
      }

      // Insert new/updated
      await axios.post(
        `${CREATE_jwel}/api/Loan/InsertLoanMainProduct`,
        [{ mname: mainProduct, prefix: barcodePrefix }],
        { headers: { tenantName: tenantNameHeader } }
      );

      setData(prev =>
        prev.map(item =>
          item.key === editingKey
            ? { ...item, mainProduct, barcodePrefix, key: `${mainProduct}-${barcodePrefix}` }
            : item
        )
      );
      form.resetFields();
      setEditingKey(null);
      message.success("Product updated successfully!");
    } catch {
      message.error("An error occurred while updating the product.");
    }
  };

  const handleMainProductChange = (e) => {
    const val = e.target.value.toUpperCase();
    form.setFieldsValue({ mainProduct: val });
  };

  const handleBarcodePrefixChange = (e) => {
    form.setFieldsValue({ barcodePrefix: e.target.value });
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
            onConfirm={() => handleDelete(record.key, record.mainProduct, record.barcodePrefix)}
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: "#f4f6f9" }}>
      <Row justify="start" style={{ marginBottom: "10px" }}>
        <Col>
          <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
            <Breadcrumb.Item>Masters</Breadcrumb.Item>
            <Breadcrumb.Item>Loan Main Product</Breadcrumb.Item>
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
                  onPressEnter={e => {
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
                  onPressEnter={e => {
                    e.preventDefault();
                    form.submit();
                  }}
                  onChange={handleBarcodePrefixChange}
                  onBlur={handleBarcodePrefixChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="animated-button"
                    style={{ marginRight: 8 }}
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
          onChange={e => setSearchText(e.target.value)}
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
