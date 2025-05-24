import React, { useState, useEffect, useCallback, useRef } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import TableHeaderStyles from "../../../Utils/TableHeaderStyles";
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
    Select,
    Card,
    Pagination
} from "antd";
import { CREATE_jwel } from "../../../Config/Config";

  const tenantNameHeader = localStorage.getItem("tenantName") ;
const LoanProductMaster = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [oldProduct, setOldProduct] = useState({ mname: "", productname: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const mnameRef = useRef(null);
    const productnameRef = useRef(null);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    "https://jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableName?tableName=PRODUCT_MASTER",
                    { headers: { tenantName: tenantNameHeader } }
                );
                const formatted = (res.data || []).map((item, idx) => ({
                    key: `${item.MNAME}-${item.PRODUCTNAME}`,
                    sno: idx + 1,
                    mname: item.MNAME || "",
                    productname: item.PRODUCTNAME || ""
                }));
                setData(formatted);
            } catch {
                message.error("Failed to fetch product data.");
            }
        };
        fetchData();
    }, []);

    // Add
    const handleAdd = async (values) => {
        const mname = values.mname.toUpperCase();
        const productname = values.productname.toUpperCase();
        form.setFieldsValue({ mname, productname });

        // Check duplicate
        if (data.some(d => d.mname === mname && d.productname === productname)) {
            message.error("Product already exists!");
            return;
        }

        try {
            const res = await axios.post(
                `${CREATE_jwel}/api/Loan/InsertLoanProductMaster`,
                [{ mname, productname }],
                { headers: { tenantName: tenantNameHeader } }
            );
            if (res.data) {
                setData(prev => [
                    ...prev,
                    {
                        key: `${mname}-${productname}`,
                        sno: prev.length + 1,
                        mname,
                        productname
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
    const handleDelete = async (key, mname, productname) => {
        try {
            const whereClause = encodeURIComponent(
                `MNAME='${mname}' AND PRODUCTNAME='${productname}'`
            );
            const res = await axios.post(
                `https://jewelerp.timeserasoftware.in/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=PRODUCT_MASTER&where=${whereClause}`,
                {},
                { headers: { tenantName: tenantNameHeader } }
            );
            if (res.data === true) {
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
        setOldProduct({ mname: record.mname, productname: record.productname });
        form.setFieldsValue({
            mname: record.mname,
            productname: record.productname
        });
        setEditingKey(record.key);
    };

    // Save
    const handleSave = async () => {
        const updated = form.getFieldsValue();
        const mname = updated.mname.toUpperCase();
        const productname = updated.productname.toUpperCase();

        // No change
        if (
            mname === oldProduct.mname &&
            productname === oldProduct.productname
        ) {
            form.resetFields();
            setEditingKey(null);
            return;
        }

        // Duplicate check
        if (
            data.some(
                d =>
                    d.mname === mname &&
                    d.productname === productname &&
                    d.key !== editingKey
            )
        ) {
            message.error("Product already exists!");
            return;
        }

        try {
            // If main/product name changed, delete old
            if (
                mname !== oldProduct.mname ||
                productname !== oldProduct.productname
            ) {
                const whereClause = encodeURIComponent(
                    `MNAME='${oldProduct.mname}' AND PRODUCTNAME='${oldProduct.productname}'`
                );
                await axios.post(
                    `https://jewelerp.timeserasoftware.in/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=PRODUCT_MASTER&where=${whereClause}`,
                    {},
                    { headers: { tenantName: tenantNameHeader } }
                );
            }

            // Insert new/updated
            await axios.post(
                `${CREATE_jwel}/api/Loan/InsertLoanProductMaster`,
                [{ mname, productname }],
                { headers: { tenantName: tenantNameHeader } }
            );

            setData(prev =>
                prev.map(item =>
                    item.key === editingKey
                        ? { ...item, mname, productname, key: `${mname}-${productname}` }
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

    // Main product change
    const handleMainProductChange = (e) => {
        const val = e.target.value.toUpperCase();
        form.setFieldsValue({ mname: val });
    };

    // Product name change
    const handleProductNameChange = (e) => {
        const val = e.target.value.toUpperCase();
        form.setFieldsValue({ productname: val });
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
            dataIndex: "mname",
            key: "mname",
        },
        {
            title: "Product Name",
            dataIndex: "productname",
            key: "productname",
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
                        onConfirm={() => handleDelete(record.key, record.mname, record.productname)}
                    >
                        <Button type="link" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleEnterPress = (e, nextFieldRef) => {
        e.preventDefault();
        if (nextFieldRef && nextFieldRef.current) {
            nextFieldRef.current.focus();
        }
    };

    // Dropdown state for Main Product
    const [mainProductOptions, setMainProductOptions] = useState([]);

    // Fetch Main Product options for dropdown
    useEffect(() => {
        const fetchMainProducts = async () => {
            try {
                const response = await axios.get(
                    `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=MAIN_PRODUCT`,
                    { headers: { tenantName: tenantNameHeader } }
                );
                // Remove duplicates by using a Set
                const seen = new Set();
                const formattedData = (response.data || [])
                    .filter(item => {
                        const mname = item.MNAME || "";
                        if (seen.has(mname)) return false;
                        seen.add(mname);
                        return true;
                    })
                    .map(item => ({
                        label: item.MNAME || "",
                        value: item.MNAME || "",
                    }));
                setMainProductOptions(formattedData);
            } catch (error) {
                message.error("Failed to fetch main product options.");
            }
        };
        fetchMainProducts();
    }, []);

    return (
        <div style={{ backgroundColor: "#f4f6f9" }}>
            <Row justify="start" style={{ marginBottom: "10px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Loan Product Master</Breadcrumb.Item>
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
                                name="mname"
                                label="Main Product"
                                rules={[{ required: true, message: "Main Product is required" }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select Main Product"
                                    options={mainProductOptions}
                                    ref={mnameRef}
                                    onInputKeyDown={e => {
                                        if (e.key === "Enter") handleEnterPress(e, productnameRef);
                                    }}
                                    filterOption={(input, option) =>
                                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="productname"
                                label="Product Name"
                                rules={[{ required: true, message: "Product Name is required" }]}
                            >
                                <Input
                                    placeholder="Product Name"
                                    ref={productnameRef}
  onPressEnter={(e) => {
      e.preventDefault();
      form.submit();
    }}                                    onChange={handleProductNameChange}
                                    onBlur={handleProductNameChange}
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

export default LoanProductMaster;