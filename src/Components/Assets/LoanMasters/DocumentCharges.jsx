import React, { useState, useEffect, useCallback, useRef } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "../../../Components/Assets/css/Style.css";
import { CREATE_jwel } from "../../../Config/Config";
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
    Card,
    Pagination,
} from "antd";

const DocumentCharges = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const tenantNameHeader = localStorage.getItem("tenantName");
    const docChargesRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=DOCUMENT_CHARGES`,
                    { headers: { tenantName: tenantNameHeader } }
                );
                const formattedData = response.data.map((item, index) => ({
                    key: index,
                    sno: index + 1,
                    documentCharges: item.DOC_CHARGES || "",
                }));
                setData(formattedData);
            } catch (error) {
                message.error("Failed to fetch document charges data.");
            }
        };
        fetchData();
    }, []);

    const handleAdd = async (values) => {
        try {
            const requestBody = [
                {
                    doc_charges: values.documentCharges,
                },
            ];

            const response = await axios.post(
                `${CREATE_jwel}/api/Loan/InsertDocumentCharges`,
                requestBody,
                { headers: { tenantName: tenantNameHeader } }
            );

            if (response.data) {
                const newDoc = {
                    key: response.data.ID || `${Date.now()}`,
                    sno: data.length + 1,
                    documentCharges: values.documentCharges,
                };
                setData((prevData) => [...prevData, newDoc]);
                form.resetFields();
                message.success("Document charge added successfully!");
            } else {
                message.error("Failed to add document charge.");
            }
        } catch (error) {
            message.error("An error occurred while adding the document charge.");
        }
    };

    const handleDelete = async (key) => {
        try {
            // Since document name is removed, use key (index or ID) for deletion
            setData((prevData) => prevData.filter((item) => item.key !== key));
            message.success("Document charge deleted successfully!");
            // You may want to call your API here to delete by key/ID if available
        } catch (error) {
            message.error("An error occurred while deleting the document charge.");
        }
    };

    const handleEdit = (record) => {
        form.setFieldsValue({
            documentCharges: record.documentCharges,
        });
        setEditingKey(record.key);
    };

    const handleSave = async () => {
        const updatedData = form.getFieldsValue();

        try {
            const requestBody = [
                {
                    doc_charges: updatedData.documentCharges,
                },
            ];

            const response = await axios.post(
                `${CREATE_jwel}/api/Loan/InsertDocumentCharges`,
                requestBody,
                { headers: { tenantName: tenantNameHeader } }
            );

            if (response.data) {
                const updatedRecord = {
                    key: editingKey,
                    sno: data.find((item) => item.key === editingKey).sno,
                    documentCharges: updatedData.documentCharges,
                };

                setData((prevData) =>
                    prevData.map((item) => (item.key === editingKey ? updatedRecord : item))
                );

                form.resetFields();
                setEditingKey(null);
                message.success("Document charge updated successfully!");
            } else {
                message.error("Failed to update document charge.");
            }
        } catch (error) {
            message.error("An error occurred while updating the document charge.");
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
            className: "blue-background-column",
            width: 50,
        },
        {
            title: "Document Charges",
            dataIndex: "documentCharges",
            key: "documentCharges",
            align: "center",
        },
        {
            title: "Action",
            key: "action",
            align: "center",
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
                        onConfirm={() => handleDelete(record.key)}
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
                        <Breadcrumb.Item>Document Charges</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card
                title={editingKey ? "Edit Document Charge" : "Add Document Charge"}
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
                                name="documentCharges"
                                label="Document Charges"
                                rules={[
                                    { required: true, message: "Document Charges is required" },
                                    { pattern: /^\d+(\.\d{1,2})?$/, message: "Enter valid amount" },
                                ]}
                            >
                                <Input
                                    placeholder="Document Charges"
                                    ref={docChargesRef}
                                    onPressEnter={(e) => {
                                        e.preventDefault();
                                        form.submit();
                                    }}
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
                    pageSizeOptions={["10", "20", "50", "100"]}
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

export default DocumentCharges;
