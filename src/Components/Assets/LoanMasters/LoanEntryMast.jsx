import React, { useState, useEffect, useRef } from "react";
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Button,
    Upload,
    Table,
    Divider,
    Popconfirm,
    Popover,
    Select,
    message,
} from "antd";
import { PlusOutlined, UploadOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import AvatarUpload from "../../../Utils/UploadImg";
import TableHeaderStyles from "../../../Utils/TableHeaderStyles";
const { TextArea } = Input;

const getToday = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
};



const LoanEntryMast = () => {
    const [form] = Form.useForm();
    const [itemName, setItemName] = useState(null);
    const [purity, setPurity] = useState(null);
    const [pieces, setPieces] = useState('');
    const [gwt, setGwt] = useState('');
    const [nwt, setNwt] = useState('');
    const [swt, setSwt] = useState('');
    const [rate, setRate] = useState('');
    const [amount, setAmount] = useState('');
    const [pan, setPan] = useState("");
    const [error, setError] = useState("");
    const [showTotals, setShowTotals] = useState(false);
    const [visible, setVisible] = useState(false);
    const [totals, setTotals] = useState({
        gwt: 0,
        nwt: 0,
        swt: 0,
        amount: 0,
    });



    const validatePan = (value) => {
        const pattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!value) {
            setError(""); // no error if empty
        } else if (!pattern.test(value)) {
            setError("Invalid PAN format (e.g., ABCDE1234F)");
        } else {
            setError("");
        }
    };

    const onChange = (e) => {
        const val = e.target.value.toUpperCase();
        setPan(val);
        validatePan(val);
    };
    const [aadhar, setAadhar] = useState("");
    const [errorAadar, setErrorAadar] = useState("");

    const validateAadhar = (value) => {
        const pattern = /^\d{12}$/;
        if (!value) {
            setError(""); // no error if empty
        } else if (!pattern.test(value)) {
            setError("Aadhar must be a 12-digit number");
        } else {
            setError("");
        }
    };

    const onChangeAdhar = (e) => {
        const val = e.target.value;
        setAadhar(val);
        validateAadhar(val);
    };


    const [loanNo, setLoanNo] = useState();
    const [loanDate, setLoanDate] = useState(getToday());
    const [editingIndex, setEditingIndex] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const convertPngToJpg = (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = "#ffffff"; // Set white background
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                }, "image/jpeg");
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handleChange = async (info) => {
        const file = info.fileList[0]?.originFileObj;
        if (!file) return;

        let jpgUrl;
        const isPng = file.type === "image/png";

        if (isPng) {
            jpgUrl = await convertPngToJpg(file);
        } else {
            jpgUrl = URL.createObjectURL(file);
        }

        const jpgFileName = file.name.replace(/\.(png|jpeg|jpg)$/i, ".jpg");
        setFileName(jpgFileName);
        setPreviewUrl(jpgUrl);
    };

    const handleRemove = () => {
        setFileName(null);
        setPreviewUrl(null);
    };

    // Refs for each input
    const loanNoRef = useRef();
    const customerNameRef = useRef();
    const swdofRef = useRef();
    const addressRef = useRef();
    const pincodeRef = useRef();
    const cityRef = useRef();
    const stateRef = useRef();
    const mobileRef = useRef();
    const altmobileRef = useRef();

    // Focus Loan No on mount
    useEffect(() => {
        loanNoRef.current && loanNoRef.current.focus();
    }, []);

    // Helper to focus next ref
    const focusNext = (ref) => {
        if (ref.current) {
            if (typeof ref.current.focus === "function") {
                ref.current.focus();
            } else if (ref.current.input && typeof ref.current.input.focus === "function") {
                ref.current.input.focus();
            }
        }
    };

    // State for table data
    const [tableData, setTableData] = useState([]);

    // Handle Add Entry
    const handleAddEntry = () => {
        // Validate required fields
        if (!itemName || !purity || !pieces || !gwt || !nwt || !swt || !rate || !amount) {
            message.error("Please fill all item fields");
            return;
        }
        const newEntry = {
            key: Date.now(),
            itemName,
            purity,
            pieces,
            gwt,
            nwt,
            swt,
            rate,
            amount,
        };
        setTableData([...tableData, newEntry]);
        // Clear fields
        setItemName(null);
        setPurity(null);
        setPieces('');
        setGwt('');
        setNwt('');
        setSwt('');
        setRate('');
        setAmount('');
    };

    const columns = [
        { title: "Item Name", dataIndex: "itemName", key: "itemName" },
        { title: "Purity", dataIndex: "purity", key: "purity" },
        { title: "Pieces", dataIndex: "pieces", key: "pieces" },
        { title: "GWT", dataIndex: "gwt", key: "gwt" },
        { title: "NWT", dataIndex: "nwt", key: "nwt" },
        { title: "SWT", dataIndex: "swt", key: "swt" },
        { title: "Rate", dataIndex: "rate", key: "rate" },
        { title: "Amount", dataIndex: "amount", key: "amount" },
    ];
    // Refs for entry fields
    const itemNameRef = useRef();
    const purityRef = useRef();
    const piecesRef = useRef();
    const gwtRef = useRef();
    const nwtRef = useRef();
    const swtRef = useRef();
    const rateRef = useRef();
    const amountRef = useRef();

    // Handle Entry Reset
    const handleEntryReset = () => {
        setItemName(null);
        setPurity(null);
        setPieces('');
        setGwt('');
        setNwt('');
        setSwt('');
        setRate('');
        setAmount('');
        setEditingIndex(null);
        setTimeout(() => {
            itemNameRef.current && itemNameRef.current.focus();
        }, 0);
    };
    // Handle Add or Update Entry


    const handleAddOrUpdateEntry = () => {
        const newItem = { key: Date.now(), itemName, purity, pieces, gwt, nwt, swt, rate, amount };
        setTableData([...tableData, newItem]);
        setItemName('');
        setPurity('');
        setPieces('');
        setGwt('');
        setNwt('');
        setSwt('');
        setRate('');
        setAmount('');
        setTimeout(() => itemNameRef.current?.focus(), 0);
    };

    useEffect(() => {
        if (visible) {
            setTimeout(() => itemNameRef.current?.focus(), 0);
        }
    }, [visible]);


    // Handle Edit
    const handleEdit = (record, idx) => {
        setItemName(record.itemName);
        setPurity(record.purity);
        setPieces(record.pieces);
        setGwt(record.gwt);
        setNwt(record.nwt);
        setSwt(record.swt);
        setRate(record.rate);
        setAmount(record.amount);
        setEditingIndex(idx);
        setTimeout(() => {
            itemNameRef.current && itemNameRef.current.focus();
        }, 0);
    };

    // Handle Delete
    const handleDelete = (idx) => {
        const updated = [...tableData];
        updated.splice(idx, 1);
        setTableData(updated);
        handleEntryReset();
    };

    const columnsWithActions = [
        {
            title: "S.No",
            key: "sno",
            render: (_, __, idx) => idx + 1,
        },
        ...columns,
        {
            title: "Action",
            key: "action",
            render: (_, record, idx) => (
                <span>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        style={{ marginRight: 8 }}
                        onClick={() => handleEdit(record, idx)}
                    />
                    <Popconfirm
                        title="Are you sure to delete?"
                        onConfirm={() => handleDelete(idx)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                </span>
            ),
        },
    ];
    // Automatically update totals when tableData changes
    useEffect(() => {
        const totalGWT = tableData.reduce((sum, row) => sum + (parseFloat(row.gwt) || 0), 0);
        const totalNWT = tableData.reduce((sum, row) => sum + (parseFloat(row.nwt) || 0), 0);
        const totalSWT = tableData.reduce((sum, row) => sum + (parseFloat(row.swt) || 0), 0);
        const totalAmount = tableData.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
        const totalPieces = tableData.reduce((sum, row) => sum + (parseFloat(row.pieces) || 0), 0);
        setTotals({ gwt: totalGWT, nwt: totalNWT, swt: totalSWT, amount: totalAmount, pieces: totalPieces });
    }, [tableData]);

    return (
        <div style={{ background: "#f4f6f9" }}>
            <Form
                form={form}
                layout="vertical"
                onReset={() => {
                    setEditingIndex(null);
                    setLoanNo();
                    setLoanDate(getToday());
                    setTimeout(() => {
                        loanNoRef.current && loanNoRef.current.focus();
                    }, 0);
                }}
            >
                <div style={{ background: "#E6F4FF", padding: "5px", borderRadius: 5 }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <label style={{ fontWeight: 500, marginRight: 8 }}>Loan No</label>
                                <Form.Item
                                    name="loanno"
                                    rules={[{ required: true, message: "Loan No is required" }]}
                                    style={{ marginBottom: 0, marginRight: 24 }}
                                >
                                    <Input
                                        style={{ width: 120 }}
                                        ref={loanNoRef}
                                        value={loanNo}
                                        onChange={e => setLoanNo(e.target.value)}
                                        onPressEnter={() => focusNext(customerNameRef)}
                                    />
                                </Form.Item>
                            </div>

                        </Col>
                        <Col>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <label style={{ fontWeight: 500, marginRight: 8 }}>Loan Date</label>
                                <Form.Item
                                    name="loandate"
                                    rules={[{ required: true, message: "Loan Date is required" }]}
                                    style={{ marginBottom: 0 }}
                                    initialValue={loanDate}
                                >
                                    <Input type="date" style={{ width: 150 }} defaultValue={loanDate} />
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Card   >
                    <Row gutter={16} align="stretch">
                        <Col span={12}>
                            <Card

                                style={{
                                    background: "#F0F5FF",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >

                                <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 12 }}>
                                    Customer Details
                                </div>
                                <Row gutter={[16, 4]}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="customerName"
                                            rules={[{ required: true, message: "Customer Name is required" }]}
                                            style={{ marginBottom: 6 }}
                                        >
                                            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Customer Name</label>
                                            <Input
                                                placeholder="Customer Name"
                                                ref={customerNameRef}
                                                onPressEnter={() => focusNext(swdofRef)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="swdof"
                                            style={{ marginBottom: 6 }}
                                        >
                                            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>S/W/D Of</label>
                                            <Input
                                                placeholder="S/W/D Of"
                                                ref={swdofRef}
                                                onPressEnter={() => focusNext(addressRef)}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item
                                            name="address"
                                            style={{ marginBottom: 6 }}
                                        >
                                            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Address</label>
                                            <Input.TextArea
                                                rows={1}
                                                placeholder="Address"
                                                ref={addressRef}
                                                onPressEnter={() => focusNext(pincodeRef)}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="pincode"
                                            style={{ marginBottom: 6 }}
                                        >
                                            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Pincode</label>
                                            <Input
                                                maxLength={6}
                                                placeholder="Pincode"
                                                ref={pincodeRef}
                                                onPressEnter={() => focusNext(cityRef)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="city"
                                            style={{ marginBottom: 6 }}
                                        >
                                            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>City</label>
                                            <Select
                                                placeholder="Select City"
                                                ref={cityRef}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") focusNext(stateRef);
                                                }}
                                                options={[
                                                    { label: "Hyderabad", value: "Hyderabad" },
                                                    { label: "Mumbai", value: "Mumbai" },
                                                    { label: "Chennai", value: "Chennai" }
                                                ]}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="state"
                                            style={{ marginBottom: 6 }}
                                        >
                                            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>State</label>
                                            <Select
                                                placeholder="Select State"
                                                ref={stateRef}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") focusNext(mobileRef);
                                                }}
                                                options={[
                                                    { label: "Telangana", value: "Telangana" },
                                                    { label: "Maharashtra", value: "Maharashtra" },
                                                    { label: "Tamil Nadu", value: "Tamil Nadu" }
                                                ]}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="mobile"
                                            style={{ marginBottom: 6 }}
                                        >
                                            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Mobile No</label>
                                            <Input
                                                maxLength={10}
                                                placeholder="Mobile No"
                                                ref={mobileRef}
                                                onPressEnter={() => focusNext(altmobileRef)}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="altmobile"
                                            style={{ marginBottom: 6 }}
                                        >
                                            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Alternate Mobile No</label>
                                            <Input
                                                maxLength={10}
                                                placeholder="Alternate Mobile No"
                                                ref={altmobileRef}
                                                onPressEnter={() => form.submit()}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                            </Card>


                        </Col>

                        <Col span={12}>
                            <Card
                                style={{
                                    background: "#F0F5FF",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 12 }}>
                                    Personal Details
                                </div>

                                <Row gutter={16} style={{ marginBottom: 16 }}>
                                    <Col span={12}>
                                        <AvatarUpload />
                                    </Col>
                                    <Col span={12}>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            border: "2px solid transparent",
                                            borderImage: "linear-gradient(to right, #1890ff, #d9d9d9)", // Blue to Grey
                                            borderImageSlice: 1,
                                            borderRadius: 8,
                                            padding: 16,
                                            marginBottom: 16
                                        }}>
                                            {fileName && previewUrl && (
                                                <div style={{ marginBottom: 8, textAlign: "center" }}>
                                                    <Popover
                                                        content={<img src={previewUrl} alt="Signature" style={{ maxWidth: 200 }} />}
                                                        title="Preview"
                                                        trigger="click"
                                                    >
                                                        <a style={{ marginRight: 8, wordBreak: "break-all" }}>{fileName}</a>
                                                    </Popover>
                                                    <DeleteOutlined onClick={handleRemove} style={{ color: "red", cursor: "pointer" }} />
                                                </div>
                                            )}

                                            <Upload
                                                listType="picture"
                                                beforeUpload={() => false}
                                                maxCount={1}
                                                accept="image/*"
                                                onChange={handleChange}
                                                showUploadList={false}
                                            >
                                                <Button icon={<UploadOutlined />}>Upload Signature</Button>
                                            </Upload>
                                        </div>
                                    </Col>
                                </Row>

                                <Row gutter={16} style={{ marginBottom: 16 }}>
                                    <Col span={12}>
                                        <Form.Item>
                                            <label style={{ fontWeight: 500 }}>PAN No</label>
                                            <Input
                                                placeholder="ABCDE1234F"
                                                maxLength={10}
                                                value={pan}
                                                onChange={onChange}
                                                style={{ textTransform: "uppercase" }}
                                            />
                                            {error && (
                                                <div style={{ color: "#ff4d4f", textAlign: "right", marginTop: 4, fontSize: 12 }}>
                                                    {error}
                                                </div>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item>
                                            <label style={{ fontWeight: 500 }}>Aadhar No</label>
                                            <Input
                                                placeholder="123412341234"
                                                maxLength={12}
                                                inputMode="numeric"
                                                value={aadhar}
                                                onChange={onChangeAdhar}
                                            />
                                            {errorAadar && (
                                                <div style={{ color: "#ff4d4f", textAlign: "right", marginTop: 4, fontSize: 12 }}>
                                                    {errorAadar}
                                                </div>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16} style={{ marginBottom: 16 }}>
                                    <Col span={12}>
                                        <Form.Item name="refPerson">
                                            <label style={{ fontWeight: 500 }}>Reference Person</label>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="refMob">
                                            <label style={{ fontWeight: 500 }}>Ref Per Mob No</label>
                                            <Input maxLength={10} />
                                        </Form.Item>
                                    </Col>
                                </Row>


                            </Card>

                        </Col>
                    </Row>
                </Card>
            </Form>
            <Card style={{ background: "#c7d6f3", }}>
                <div style={{ height: "calc(100vh - 100px)" }}>
                    <Row gutter={12} style={{ height: "56%" }}>
                        {/* Left Column */}
                        <Col span={12} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <Card
                                style={{ background: "#F0F5FF", flex: 1, display: "flex", flexDirection: "column" }}
                                bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
                            >
                                <div>
                                    <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 8 }}>Entry Items</div>
                                    {/* Items Button with Popover */}
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                                        <Popover
                                            trigger="click"
                                            overlayClassName="custom-popover"
                                            placement="top"
                                            visible={visible}
                                            onVisibleChange={setVisible}
                                            content={
                                                <div
                                                    style={{
                                                        maxWidth: '90vw',
                                                        height: 400, // Fixed height
                                                        overflowY: 'auto',
                                                        padding: 16,
                                                        position: 'relative',
                                                    }}
                                                >                                                    <CloseOutlined
                                                        onClick={() => setVisible(false)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: 2,
                                                            right: 8,
                                                            fontSize: 16,
                                                            cursor: 'pointer',
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                    <Card style={{ background: "#bbcdef", marginBottom: 12 }}>
                                                        <Row gutter={12} wrap>
                                                            <Col span={4}>
                                                                <label>Item Name</label>
                                                                <Select
                                                                    ref={itemNameRef}
                                                                    placeholder="Select Item"
                                                                    style={{ width: '100%' }}
                                                                    value={itemName}
                                                                    onChange={(val) => {
                                                                        setItemName(val);
                                                                        setTimeout(() => purityRef.current?.focus(), 0);
                                                                    }}
                                                                >
                                                                    <Select.Option value="Ring">Ring</Select.Option>
                                                                    <Select.Option value="Necklace">Necklace</Select.Option>
                                                                    <Select.Option value="Bangle">Bangle</Select.Option>
                                                                </Select>
                                                            </Col>
                                                            <Col span={2}>
                                                                <label>Purity</label>
                                                                <Select
                                                                    ref={purityRef}
                                                                    placeholder="Select Purity"
                                                                    style={{ width: '100%' }}
                                                                    value={purity}
                                                                    onChange={(val) => {
                                                                        setPurity(val);
                                                                        setTimeout(() => piecesRef.current?.focus(), 0);
                                                                    }}
                                                                >
                                                                    <Select.Option value="22K">22K</Select.Option>
                                                                    <Select.Option value="24K">24K</Select.Option>
                                                                    <Select.Option value="18K">18K</Select.Option>
                                                                </Select>
                                                            </Col>
                                                            <Col span={2}>
                                                                <label>Pieces</label>
                                                                <Input
                                                                    ref={piecesRef}
                                                                    type="number"
                                                                    value={pieces}
                                                                    onChange={(e) => setPieces(e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && gwtRef.current?.focus()}
                                                                />
                                                            </Col>
                                                            <Col span={2}>
                                                                <label>GWT</label>
                                                                <Input
                                                                    ref={gwtRef}
                                                                    type="number"
                                                                    value={gwt}
                                                                    onChange={(e) => setGwt(e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && nwtRef.current?.focus()}
                                                                />
                                                            </Col>
                                                            <Col span={2}>
                                                                <label>NWT</label>
                                                                <Input
                                                                    ref={nwtRef}
                                                                    type="number"
                                                                    value={nwt}
                                                                    onChange={(e) => setNwt(e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && swtRef.current?.focus()}
                                                                />
                                                            </Col>
                                                            <Col span={2}>
                                                                <label>SWT</label>
                                                                <Input
                                                                    ref={swtRef}
                                                                    type="number"
                                                                    value={swt}
                                                                    onChange={(e) => setSwt(e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && rateRef.current?.focus()}
                                                                />
                                                            </Col>
                                                            <Col span={2}>
                                                                <label>Rate</label>
                                                                <Input
                                                                    ref={rateRef}
                                                                    type="number"
                                                                    value={rate}
                                                                    onChange={(e) => setRate(e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && amountRef.current?.focus()}
                                                                />
                                                            </Col>
                                                            <Col span={3}>
                                                                <label>Amount</label>
                                                                <Input
                                                                    ref={amountRef}
                                                                    type="number"
                                                                    value={amount}
                                                                    onChange={(e) => setAmount(e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddOrUpdateEntry()}
                                                                />
                                                            </Col>
                                                            <Col span={2} style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Button
                                                                    type="primary"
                                                                    onClick={handleAddOrUpdateEntry}
                                                                    style={{ width: '100%' }}
                                                                >
                                                                    {editingIndex !== null ? "Update" : "Add Entry"}
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </Card>

                                                    <TableHeaderStyles>
                                                        <Table
                                                            columns={columnsWithActions}
                                                            dataSource={tableData}
                                                            pagination={false}
                                                            size="small"
                                                            rowKey="key"
                                                            scroll={{ y: 200 }}
                                                            style={{ marginBottom: 8 }}
                                                            summary={pageData => {
                                                                // Find the index of each column by key
                                                                const colIdx = {
                                                                    sno: 0,
                                                                    itemName: 1,
                                                                    purity: 2,
                                                                    pieces: 3,
                                                                    gwt: 4,
                                                                    nwt: 5,
                                                                    swt: 6,
                                                                    rate: 7,
                                                                    amount: 8,
                                                                    action: 9,
                                                                };
                                                                return (
                                                                    <Table.Summary.Row>
                                                                        <Table.Summary.Cell index={colIdx.sno}></Table.Summary.Cell>
                                                                        <Table.Summary.Cell index={colIdx.itemName}></Table.Summary.Cell>
                                                                        <Table.Summary.Cell index={colIdx.purity}></Table.Summary.Cell>
                                                                        <Table.Summary.Cell index={colIdx.pieces}><b>{totals.pieces || 0}</b></Table.Summary.Cell>
                                                                        <Table.Summary.Cell index={colIdx.gwt}><b>{totals.gwt.toFixed(3)}</b></Table.Summary.Cell>
                                                                        <Table.Summary.Cell index={colIdx.nwt}><b>{totals.nwt.toFixed(3)}</b></Table.Summary.Cell>
                                                                        <Table.Summary.Cell index={colIdx.swt}><b>{totals.swt.toFixed(3)}</b></Table.Summary.Cell>
                                                                        <Table.Summary.Cell index={colIdx.rate}></Table.Summary.Cell>
                                                                        <Table.Summary.Cell index={colIdx.amount}><b>{totals.amount.toFixed(2)}</b></Table.Summary.Cell>
                                                                        <Table.Summary.Cell index={colIdx.action}></Table.Summary.Cell>
                                                                    </Table.Summary.Row>
                                                                );
                                                            }}
                                                        />
                                                    </TableHeaderStyles>
                                                    <Row justify="end" gutter={8}>
                                                        <Col>
                                                            <Button
                                                                onClick={() => {
                                                                    setTableData([]);
                                                                    setTotals({ gwt: 0, nwt: 0, swt: 0, amount: 0 });
                                                                }}
                                                            >
                                                                Refresh
                                                            </Button>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                type="primary"
                                                                onClick={() => {
                                                                    const totalGWT = tableData.reduce((sum, row) => sum + (parseFloat(row.gwt) || 0), 0);
                                                                    const totalNWT = tableData.reduce((sum, row) => sum + (parseFloat(row.nwt) || 0), 0);
                                                                    const totalSWT = tableData.reduce((sum, row) => sum + (parseFloat(row.swt) || 0), 0);
                                                                    const totalAmount = tableData.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);

                                                                    setTotals({ gwt: totalGWT, nwt: totalNWT, swt: totalSWT, amount: totalAmount });
                                                                    setVisible(false);
                                                                }}
                                                            >
                                                                OK
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            }
                                        >
                                            <Button
                                                type="primary"
                                                style={{
                                                    height: 40,
                                                    fontSize: 16,
                                                    fontWeight: "bold",
                                                    backgroundColor: "#0d094e",
                                                    borderColor: "#4A90E2",
                                                }}
                                                icon={<PlusOutlined style={{ fontSize: 18, fontWeight: "bold" }} />}
                                            >
                                                Items
                                            </Button>
                                        </Popover>
                                    </div>

                                    {/* Totals Vertical */}
                                    <Row justify="center" style={{ marginBottom: 8 }}>
                                        <Col>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                                {[
                                                    { label: "Total Pieces", value: totals.pieces },

                                                    { label: "Total GWT", value: totals.gwt.toFixed(3) },
                                                    { label: "Total NWT", value: totals.nwt.toFixed(3) },
                                                    { label: "Total SWT", value: totals.swt.toFixed(3) },
                                                    { label: "Total Amount", value: totals.amount.toFixed(2) },
                                                ].map((item, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "flex-start",
                                                            minWidth: 250,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontWeight: 500,
                                                                minWidth: 100,
                                                                textAlign: "left",
                                                                display: "inline-block",
                                                            }}
                                                        >
                                                            {item.label}
                                                        </span>
                                                        <span style={{ margin: "0 6px" }}>:</span>
                                                        <span
                                                            style={{
                                                                minWidth: 80,
                                                                textAlign: "left",
                                                                display: "inline-block",
                                                            }}
                                                        >
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </Col>
                                    </Row>

                                </div>
                            </Card>
                        </Col>
                        <Col span={12} style={{ height: "50%", display: "flex", flexDirection: "column" }}>
                            <Card
                                style={{ background: "#F0F5FF", flex: 1, display: "flex", flexDirection: "column" }}
                                bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
                            >
                                <div>
                                    <Form layout="vertical">
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Form.Item name="loanAmount">
                                                    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                                                        <label style={{ width: "60%", fontWeight: 500 }}>Loan Release Amount</label>
                                                        <Input style={{ width: "40%" }} />
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Form.Item name="interestRate">
                                                    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                                                        <label style={{ width: "60%", fontWeight: 500 }}>Interest Rate (%)</label>
                                                        <Input style={{ width: "40%" }} />
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Form.Item name="firstInterest">
                                                    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                                                        <label style={{ width: "60%", fontWeight: 500 }}>First Interest</label>
                                                        <Input style={{ width: "40%" }} />
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Form.Item name="docCharges">
                                                    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                                                        <label style={{ width: "60%", fontWeight: 500 }}>Document Charges</label>
                                                        <Input style={{ width: "40%" }} />
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Form.Item name="paidAmount">
                                                    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                                                        <label style={{ width: "60%", fontWeight: 500 }}>Paid Amount</label>
                                                        <Input style={{ width: "40%" }} />
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                onClick={() => {
                                                    setTimeout(() => {
                                                        loanNoRef.current && loanNoRef.current.focus();
                                                    }, 0);
                                                }}
                                            >
                                                {editingIndex !== null ? "Update" : "Submit"}
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    form.resetFields();
                                                    setEditingIndex(null);
                                                    setLoanNo();
                                                    setLoanDate(getToday());
                                                    setTimeout(() => {
                                                        loanNoRef.current && loanNoRef.current.focus();
                                                    }, 0);
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>

    );
};

export default LoanEntryMast;