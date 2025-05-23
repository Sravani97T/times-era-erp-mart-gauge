import { useState, useEffect, useCallback, useRef } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
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
  Select,
  Pagination,
} from "antd";

const LoanPrurity = () => {
const [form] = Form.useForm();
const [data, setData] = useState([]);
const [editingKey, setEditingKey] = useState(null);
const [searchText, setSearchText] = useState("");
const [oldPurity, setOldPurity] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(20);

  const tenantNameHeader = localStorage.getItem("tenantName") ;
const mnameRef = useRef(null);
const purityRef = useRef(null);

useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=PUTIRY_MASTER`,
                { headers: { tenantName: tenantNameHeader } }
            );
            const formattedData = (response.data || []).map((item, idx) => ({
                key: item.PURITY || idx,
                sno: idx + 1,
                mname: item.MNAME || "",
                purity: item.PURITY || "",
            }));
            setData(formattedData);
        } catch (error) {
            message.error("Failed to fetch purity data.");
        }
    };
    fetchData();
}, []);


const handleAdd = async (values) => {
    const upperCaseMname = values.mname.toUpperCase();
    const upperCasePurity = values.purity.toUpperCase();
    form.setFieldsValue({ mname: upperCaseMname, purity: upperCasePurity });

    try {
        // Check for duplicate
        // const searchResponse = await axios.get(
        //     `${CREATE_jwel}/api/Loan/SearchPurityMaster?purity=${upperCasePurity}`,
        //     { headers: { tenantName: tenantNameHeader } }
        // );
        // if (searchResponse.data.length > 0) {
        //     message.error("Purity already exists!");
        //     return;
        // }

        // Insert new purity
        const response = await axios.post(
            `${CREATE_jwel}/api/Loan/InsertPutiryMaster`,
            [
                {
                    mname: upperCaseMname,
                    purity: upperCasePurity,
                }
            ],
            { headers: { tenantName: tenantNameHeader } }
        );

        if (Array.isArray(response.data) && response.data[0]?.isInsert) {
            const newPurity = {
                key: `${upperCaseMname}-${upperCasePurity}-${Date.now()}`,
                sno: data.length + 1,
                mname: upperCaseMname,
                purity: upperCasePurity,
            };
            setData((prevData) => [...prevData, newPurity]);
            form.resetFields();
            message.success("Purity added successfully!");
        } else {
            message.error("Failed to add purity.");
        }
    } catch (error) {
        message.error("An error occurred while adding the purity.");
    }
};

const handleDelete = async (_unused, purity, mname) => {
    try {
        // Construct the WHERE clause for the API
        const whereClause = `MNAME='${encodeURIComponent(mname)}' AND PURITY='${encodeURIComponent(purity)}'`;
        const url = `https://jewelerp.timeserasoftware.in/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=PUTIRY_MASTER&where=${whereClause}`;
        const response = await axios.post(
            url,
            {},
            { headers: { tenantName: tenantNameHeader } }
        );
        if (response.data === true) {
            setData((prevData) => prevData.filter((item) => !(item.purity === purity && item.mname === mname)));
            message.success("Purity deleted successfully!");
        } else {
            message.error("Failed to delete purity.");
        }
    } catch (error) {
        message.error("An error occurred while deleting the purity.");
    }
};


const handleEdit = (record) => {
    setOldPurity(record.purity);
    form.setFieldsValue({
        mname: record.mname,
        purity: record.purity,
    });
    setEditingKey(record.key);
};

const handleSave = async () => {
    const updatedData = form.getFieldsValue();
    const newMname = updatedData.mname.toUpperCase();
    const newPurity = updatedData.purity.toUpperCase();

    // If nothing changed, just reset
    const oldRecord = data.find((item) => item.key === editingKey);
    if (
        newPurity === oldRecord.purity &&
        newMname === oldRecord.mname
    ) {
        form.resetFields();
        setEditingKey(null);
        return;
    }

    try {
        // Check for duplicate (except for the current record)
        // const searchResponse = await axios.get(
        //     `${CREATE_jwel}/api/Loan/SearchPurityMaster?purity=${newPurity}`,
        //     { headers: { tenantName: tenantNameHeader } }
        // );
        // if (
        //     searchResponse.data.length > 0 &&
        //     (newPurity !== oldRecord.purity || newMname !== oldRecord.mname)
        // ) {
        //     message.error("Purity already exists!");
        //     return;
        // }

        // If mname or purity changed, delete the old record
        if (newPurity !== oldRecord.purity || newMname !== oldRecord.mname) {
            const whereClause = `MNAME='${encodeURIComponent(oldRecord.mname)}' AND PURITY='${encodeURIComponent(oldRecord.purity)}'`;
            const url = `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=PUTIRY_MASTER&where=${whereClause}`;
            await axios.post(
                url,
                {},
                { headers: { tenantName: tenantNameHeader } }
            );
        }

        // Insert new/updated purity (as array)
        const response = await axios.post(
            `${CREATE_jwel}/api/Loan/InsertPutiryMaster`,
            [
                {
                    mname: newMname,
                    purity: newPurity,
                }
            ],
            { headers: { tenantName: tenantNameHeader } }
        );

        if (Array.isArray(response.data) && response.data[0]?.isInsert) {
            const updatedRecord = {
                key: `${newMname}-${newPurity}-${Date.now()}`,
                sno: oldRecord.sno,
                mname: newMname,
                purity: newPurity,
            };
            setData((prevData) =>
                prevData.map((item) =>
                    item.key === editingKey ? updatedRecord : item
                )
            );
            form.resetFields();
            setEditingKey(null);
            message.success("Purity updated successfully!");
        } else {
            message.error("Failed to update purity.");
        }
    } catch (error) {
        message.error("An error occurred while updating the purity.");
    }
};


const handlePurityChange = async (e) => {
    const enteredPurity = e.target.value.toUpperCase();
    form.setFieldsValue({ purity: enteredPurity });
    if (enteredPurity === oldPurity) return;
    try {
        const searchResponse = await axios.get(
            `${CREATE_jwel}/api/Loan/SearchPurityMaster?purity=${enteredPurity}`,
            { headers: { tenantName: tenantNameHeader } }
        );
        if (searchResponse.data.length > 0) {
            message.error("Purity already exists!");
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
        title: "Main Product",
        dataIndex: "mname",
        key: "mname",
    },
    {
        title: "Purity",
        dataIndex: "purity",
        key: "purity",
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
                    onConfirm={() => handleDelete(record.key, record.purity, record.mname)}
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
                    <Breadcrumb.Item>Loan Purity</Breadcrumb.Item>
                </Breadcrumb>
            </Col>
        </Row>

        <Card
            title={editingKey ? "Edit Purity" : "Add Purity"}
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
            if (e.key === "Enter") handleEnterPress(e, purityRef);
        }}
        filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
    />
</Form.Item>

                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
  name="purity"
  label="Purity"
  rules={[{ required: true, message: "Purity is required" }]}
>
  <Input
    placeholder="Purity"
    ref={purityRef}
    onPressEnter={(e) => {
      e.preventDefault();
      form.submit();
    }}
    onChange={handlePurityChange}
    onBlur={handlePurityChange}
  />
</Form.Item>

                    </Col>
                </Row>
                <div style={{ display: "flex", justifyContent: "flex-end" ,marginTop: "10px"}}>
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

export default LoanPrurity;