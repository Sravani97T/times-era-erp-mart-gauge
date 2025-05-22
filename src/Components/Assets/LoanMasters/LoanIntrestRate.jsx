import React, { useState, useEffect, useRef, useCallback } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "../../../Components/Assets/css/Style.css";
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
    InputNumber,
} from "antd";

const API_BASE = "https://jewelerp.timeserasoftware.in";
const TABLE_NAME = "LOAN_INTEREST_RATE";

const LoanIntrestRate = () => {
const [form] = Form.useForm();
const [data, setData] = useState([]);
const [editingKey, setEditingKey] = useState(null);
const [oldRecord, setOldRecord] = useState({});
const [searchText, setSearchText] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(20);

const tenantNameHeader = localStorage.getItem("tenantName");

const fromAmtRef = useRef(null);
const toAmtRef = useRef(null);
const interestRateRef = useRef(null);

// Fetch data
useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await axios.get(
                `${API_BASE}/api/Master/GetDataFromGivenTableName?tableName=${TABLE_NAME}`,
                { headers: { tenantName: tenantNameHeader } }
            );
            const formatted = res.data.map((item, idx) => ({
                key: idx + 1,
                sno: idx + 1,
                fromamt: item.FROMAMT,
                toamt: item.TOAMT,
                interestrate: item.INTERESTRATE,
            }));
            setData(formatted);
        } catch {
            message.error("Failed to fetch interest rates.");
        }
    };
    fetchData();
}, [tenantNameHeader]);

// Add
const handleAdd = async (values) => {
    try {
        const requestBody = [
            {
                fromamt: values.fromamt,
                toamt: values.toamt,
                interestrate: values.interestrate,
            },
        ];
        const res = await axios.post(
            `${API_BASE}/api/Loan/InsertLoanInterestRate`,
            requestBody,
            { headers: { tenantName: tenantNameHeader } }
        );
        if (res.data) {
            setData((prev) => [
                ...prev,
                {
                    key: Date.now(),
                    sno: prev.length + 1,
                    ...requestBody[0],
                },
            ]);
            form.resetFields();
            message.success("Interest rate added!");
        } else {
            message.error("Failed to add interest rate.");
        }
    } catch {
        message.error("Error while adding interest rate.");
    }
};

// Delete
const handleDelete = async (key, record) => {
    try {
        const where = encodeURIComponent(
            `FROMAMT=${record.fromamt} AND TOAMT=${record.toamt} AND INTERESTRATE=${record.interestrate}`
        );
        const res = await axios.post(
            `${API_BASE}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=${TABLE_NAME}&where=${where}`,
            {},
            { headers: { tenantName: tenantNameHeader } }
        );
        if (res.data === true) {
            setData((prev) => prev.filter((item) => item.key !== key));
            message.success("Deleted successfully!");
        } else {
            message.error("Failed to delete.");
        }
    } catch {
        message.error("Error while deleting.");
    }
};

// Edit
const handleEdit = (record) => {
    setOldRecord(record);
    form.setFieldsValue({
        fromamt: record.fromamt,
        toamt: record.toamt,
        interestrate: record.interestrate,
    });
    setEditingKey(record.key);
};

// Save
const handleSave = async () => {
    const updated = form.getFieldsValue();
    // If nothing changed, just reset
    if (
        updated.fromamt === oldRecord.fromamt &&
        updated.toamt === oldRecord.toamt &&
        updated.interestrate === oldRecord.interestrate
    ) {
        form.resetFields();
        setEditingKey(null);
        return;
    }
    try {
        // Delete old
        const where = encodeURIComponent(
            `FROMAMT=${oldRecord.fromamt} AND TOAMT=${oldRecord.toamt} AND INTERESTRATE=${oldRecord.interestrate}`
        );
        await axios.post(
            `${API_BASE}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=${TABLE_NAME}&where=${where}`,
            {},
            { headers: { tenantName: tenantNameHeader } }
        );
        // Insert new
        const requestBody = [
            {
                fromamt: updated.fromamt,
                toamt: updated.toamt,
                interestrate: updated.interestrate,
            },
        ];
        const res = await axios.post(
            `${API_BASE}/api/Loan/InsertLoanInterestRate`,
            requestBody,
            { headers: { tenantName: tenantNameHeader } }
        );
        if (res.data) {
            setData((prev) =>
                prev.map((item) =>
                    item.key === editingKey
                        ? { ...item, ...requestBody[0] }
                        : item
                )
            );
            form.resetFields();
            setEditingKey(null);
            message.success("Updated successfully!");
        } else {
            message.error("Failed to update.");
        }
    } catch {
        message.error("Error while updating.");
    }
};

const handleCancel = useCallback(() => {
    form.resetFields();
    setEditingKey(null);
}, [form]);

const filteredData = data.filter((item) =>
    Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
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
        title: "From Amount",
        dataIndex: "fromamt",
        key: "fromamt",
        align: "center",
    },
    {
        title: "To Amount",
        dataIndex: "toamt",
        key: "toamt",
        align: "center",
    },
    {
        title: "Interest Rate",
        dataIndex: "interestrate",
        key: "interestrate",
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
                    onConfirm={() => handleDelete(record.key, record)}
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
                <Breadcrumb
                    style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#0C1154",
                    }}
                >
                    <Breadcrumb.Item>Masters</Breadcrumb.Item>
                    <Breadcrumb.Item>Loan Interest Rate</Breadcrumb.Item>
                </Breadcrumb>
            </Col>
        </Row>

        <Card
            title={editingKey ? "Edit Interest Rate" : "Add Interest Rate"}
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
                    <Col xs={24} sm={8}>
                        <Form.Item
                            name="fromamt"
                            label="From Amount"
                            rules={[{ required: true, message: "From Amount is required" }]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: "100%" }}
                                placeholder="From Amount"
                                ref={fromAmtRef}
                                onPressEnter={(e) => {
                                    e.preventDefault();
                                    if (toAmtRef.current) toAmtRef.current.focus();
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Form.Item
                            name="toamt"
                            label="To Amount"
                            rules={[{ required: true, message: "To Amount is required" }]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: "100%" }}
                                placeholder="To Amount"
                                ref={toAmtRef}
                                onPressEnter={(e) => {
                                    e.preventDefault();
                                    if (interestRateRef.current) interestRateRef.current.focus();
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Form.Item
                            name="interestrate"
                            label="Interest Rate"
                            rules={[{ required: true, message: "Interest Rate is required" }]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: "100%" }}
                                placeholder="Interest Rate"
                                ref={interestRateRef}
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
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: "10px",
                            }}
                        >
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
                dataSource={filteredData.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize
                )}
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

export default LoanIntrestRate;