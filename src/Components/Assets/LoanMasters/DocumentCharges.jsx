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
const [oldDocName, setOldDocName] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(20);

const tenantNameHeader = localStorage.getItem("tenantName");
const docNameRef = useRef(null);
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
                documentName: item.DOC_NAME || "",
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
    const upperCaseDoc = values.documentName.toUpperCase();
    form.setFieldsValue({ documentName: upperCaseDoc });

    try {
        const requestBody = [
            {
                doc_name: upperCaseDoc,
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
                key: response.data.ID || `${upperCaseDoc}-${Date.now()}`,
                sno: data.length + 1,
                documentName: upperCaseDoc,
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

const handleDelete = async (key, documentName) => {
    try {
        const whereClause = encodeURIComponent(`DOC_NAME='${documentName}'`);
        const response = await axios.post(
            `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=DOCUMENT_CHARGES&where=${whereClause}`,
            {},
            { headers: { tenantName: tenantNameHeader } }
        );

        if (response.data === true) {
            setData((prevData) => prevData.filter((item) => item.documentName !== documentName));
            message.success("Document charge deleted successfully!");
        } else {
            message.error("Failed to delete document charge.");
        }
    } catch (error) {
        message.error("An error occurred while deleting the document charge.");
    }
};

const handleEdit = (record) => {
    setOldDocName(record.documentName);
    form.setFieldsValue({
        documentName: record.documentName,
        documentCharges: record.documentCharges,
    });
    setEditingKey(record.key);
};

const handleSave = async () => {
    const updatedData = form.getFieldsValue();
    const newDocName = updatedData.documentName.toUpperCase();

    if (
        newDocName === oldDocName &&
        updatedData.documentCharges === data.find((item) => item.documentName === oldDocName).documentCharges
    ) {
        form.resetFields();
        setEditingKey(null);
        return;
    }

    try {
        const searchResponse = await axios.get(
            `${CREATE_jwel}/api/Master/DocumentChargesSearch?DocName=${newDocName}`,
            { headers: { tenantName: tenantNameHeader } }
        );

        if (searchResponse.data.length > 0 && newDocName !== oldDocName) {
            message.error("Document name already exists!");
            return;
        }

        if (newDocName !== oldDocName) {
            const whereClause = encodeURIComponent(`DOC_NAME='${oldDocName}'`);
            await axios.post(
                `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=DOCUMENT_CHARGES&where=${whereClause}`,
                {},
                { headers: { tenantName: tenantNameHeader } }
            );
        }

        const requestBody = [
            {
                doc_name: newDocName,
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
                documentName: newDocName,
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

const handleDocNameChange = async (e) => {
    const enteredDoc = e.target.value.toUpperCase();
    form.setFieldsValue({ documentName: enteredDoc });

    if (enteredDoc === oldDocName) return;

    try {
        const searchResponse = await axios.get(
            `${CREATE_jwel}/api/Master/DocumentChargesSearch?DocName=${enteredDoc}`,
            { headers: { tenantName: tenantNameHeader } }
        );
        if (searchResponse.data.length > 0) {
            message.error("Document name already exists!");
        }
    } catch (error) {}
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
        title: "Document Name",
        dataIndex: "documentName",
        key: "documentName",
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
                    onConfirm={() => handleDelete(record.key, record.documentName)}
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
                            name="documentName"
                            label="Document Name"
                            rules={[{ required: true, message: "Document Name is required" }]}
                        >
                            <Input
                                placeholder="Document Name"
                                ref={docNameRef}
                                onPressEnter={(e) => {
                                    e.preventDefault();
                                    if (docChargesRef.current) docChargesRef.current.focus();
                                }}
                                onChange={handleDocNameChange}
                                onBlur={handleDocNameChange}
                            />
                        </Form.Item>
                    </Col>
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