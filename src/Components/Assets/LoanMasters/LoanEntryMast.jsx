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
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    console.log("isButtonDisabled", isButtonDisabled)
    // Watch individual form fields
    const customerName = Form.useWatch("customerName", form);
    const swdof = Form.useWatch("swdof", form);
    const address = Form.useWatch("address", form);
    const pincode = Form.useWatch("pincode", form);
    const city = Form.useWatch("city", form);
    const state = Form.useWatch("state", form);
    const mobile = Form.useWatch("mobile", form);
    const [customerDetails, setCustomerDetails] = useState({
        customerName: '',
        swdof: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        mobile: '',
    });

    //   // Enable button only when all required fields are filled
    //   useEffect(() => {
    //     if (
    //       customerName?.trim()  !=="" &&
    //       swdof?.trim() !=="" &&
    //       address?.trim() !=="" &&
    //       pincode?.trim() !=="" &&

    //       mobile?.trim() !==""
    //     ) {
    //       setIsButtonDisabled(false);
    //     } else {
    //       setIsButtonDisabled(true);
    //     }
    //   }, [customerName, swdof, address, pincode, city, state, mobile]);

    const handleInputChange = (field, value) => {
        setCustomerDetails((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    useEffect(() => {
        const {
            customerName,
            swdof,
            address,
            pincode,
            city,
            state,
            mobile,
        } = customerDetails;

        // Check all required fields are filled and mobile has 10 digits
        const isFormValid =
            customerName.trim() &&
            swdof.trim() &&
            address.trim() &&
            pincode.trim().length === 6 &&
            city &&
            state &&
            mobile.trim().length === 10;

        setIsButtonDisabled(!isFormValid);
    }, [customerDetails]);

    // Auto-calculate Net Wt & Amount or Rate
    useEffect(() => {
        const gross = parseFloat(gwt) || 0;
        const less = parseFloat(swt) || 0;
        const net = gross - less;
        if (!isNaN(net)) setNwt(net.toFixed(3));
    }, [gwt, swt]);

    useEffect(() => {
        const net = parseFloat(nwt);
        const r = parseFloat(rate);
        const a = parseFloat(amount);

        if (net && !isNaN(net)) {
            if (r && !isNaN(r)) {
                setAmount((net * r).toFixed(2));
            } else if (a && !isNaN(a)) {
                setRate((a / net).toFixed(2));
            }
        }
    }, [nwt, rate, amount]);

    const labelStyle = {
        textAlign: "center",
        color: "white",
        display: "block",
        fontWeight: "500",
        marginBottom: 4,
    };

    const inputStyle = {
        textAlign: "center"
    };
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
        {
            title: "Purity", dataIndex: "purity", key: "purity", align: "center",
        },
        {
            title: "Pieces", dataIndex: "pieces", key: "pieces", align: "center",
        },
        {
            title: "Gross.Wt", dataIndex: "gwt", key: "gwt", align: "right",
        },
        {
            title: "Less.Wt", dataIndex: "swt", key: "swt", align: "right",
        },

        {
            title: "Net.Wt", dataIndex: "nwt", key: "nwt", align: "right",
        },
        {
            title: "Rate", dataIndex: "rate", key: "rate", align: "right",
        },
        {
            title: "Amount", dataIndex: "amount", key: "amount", align: "right",
        },
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
            width: 50,
            align: "center",
            className: 'first-col-green'
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
        <div style={{ background: "#f4f6f9" }} className={`main-content ${visible ? "blurred" : ""}`}>
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
                <div style={{ background: "#324c6c", padding: "5px", borderRadius: 5 }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <div style={{ display: "flex", alignItems: "center", marginLeft: "5px" }}>
                                <label style={{ fontWeight: 500, marginRight: 8, color: "white" }}>Loan No</label>
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
                                <label style={{ fontWeight: 500, marginRight: 8, color: "white" }}>Loan Date</label>
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
                <Card className="parent-card">
                    <Row gutter={8} align="stretch">
                        <Col span={12}>
                            <Card
                                className="custom-inner-card"
                                style={{
                                    background: "#F0F5FF",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >

                                <div
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 13,
                                        marginBottom: 12,
                                        padding: "4px 8px",
                                        background: "linear-gradient(to right,rgb(130, 188, 231),rgb(123, 98, 156))",
                                        borderRadius: "5px",
                                        border: "1px solid #cce4f7",
                                        display: "inline-block",
                                        color: "#fff",
                                    }}
                                >
                                    Customer Details
                                </div>


                                <Row gutter={[16, 4]}>
                                    <Col span={24}>
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
                                                value={customerDetails.customerName}
                                                onChange={(e) => handleInputChange('customerName', e.target.value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="swdof"
                                            style={{ marginBottom: 6 }}
                                        >
                                            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>S/W/D Of</label>
                                            <Input
                                                placeholder="S/W/D Of"
                                                ref={swdofRef}
                                                onPressEnter={() => focusNext(addressRef)}
                                                value={customerDetails.swdof}
                                                onChange={(e) => handleInputChange('swdof', e.target.value)}
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
                                                value={customerDetails.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
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
                                                value={customerDetails.pincode}
                                                onChange={(e) => handleInputChange('pincode', e.target.value)}
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
                                                value={customerDetails.city}
                                                onChange={(value) => handleInputChange('city', value)}
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
                                                    focusNext(mobileRef);
                                                }}
                                                value={customerDetails.state}
                                                onChange={(value) => handleInputChange('state', value)}
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
                                                value={customerDetails.mobile}
                                                onChange={(e) => handleInputChange('mobile', e.target.value)}
                                                onPressEnter={() => focusNext(altmobileRef)}
                                            />
                                        </Form.Item>
                                    </Col>


                                </Row>

                            </Card>


                        </Col>

                        <Col span={12}>
                            <Card
                                className="custom-inner-card"
                                style={{
                                    background: "#F0F5FF",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
 <div
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 13,
                                        marginBottom: 12,
                                        padding: "4px 8px",
                                        background: "linear-gradient(to right,rgb(130, 188, 231),rgb(123, 98, 156))",
                                        borderRadius: "5px",
                                        border: "1px solid #cce4f7",
                                        display: "inline-block",
                                        color: "#fff",
                                    }}
                                >                                    Personal Details
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

                                <Row gutter={16} >
                                    <Col span={24}>
                                        <Form.Item>
                                            <label style={{ fontWeight: 500, }}>PAN No</label>
                                            <Input
                                                placeholder="ABCDE1234F"
                                                maxLength={10}
                                                value={pan}
                                                onChange={onChange}
                                                style={{ textTransform: "uppercase", marginTop: "8px" }}
                                            />
                                            {error && (
                                                <div style={{ color: "#ff4d4f", textAlign: "right", marginTop: 4, fontSize: 12 }}>
                                                    {error}
                                                </div>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item>
                                            <label style={{ fontWeight: 500 }}>Aadhar No</label>
                                            <Input
                                                placeholder="123412341234"
                                                maxLength={12}
                                                inputMode="numeric"
                                                value={aadhar}
                                                onChange={onChangeAdhar}
                                                style={{ marginTop: "6px" }}
                                            />
                                            {errorAadar && (
                                                <div style={{ color: "#ff4d4f", textAlign: "right", marginTop: 4, fontSize: 12 }}>
                                                    {errorAadar}
                                                </div>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16} >
                                    <Col span={12}>
                                        <Form.Item name="refPerson">
                                            <label style={{ fontWeight: 500 }}>Reference Person</label>
                                            <Input style={{ marginTop: "6px", }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="refMob">
                                            <label style={{ fontWeight: 500 }}>Ref Per Mob No</label>
                                            <Input maxLength={10} style={{ marginTop: "6px", }} />
                                        </Form.Item>
                                    </Col>
                                </Row>


                            </Card>

                        </Col>
                    </Row>
                </Card>
            </Form>
            <Card className="parent-card" style={{ background: "#fff", }} >
                <div style={{ height: "calc(100vh - 100px)" }} className={visible ? "blurred-section" : ""}  >
                    <Row gutter={12} style={{ height: "56%" }}>
                        {/* Left Column */}
                        <Col span={12} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <Card
                                style={{ background: "#F0F5FF", flex: 1, display: "flex", flexDirection: "column" }}
                                bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
                            >
                                <div>
                                     <div
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 13,
                                        marginBottom: 12,
                                        padding: "4px 8px",
                                        background: "linear-gradient(to right,rgb(130, 188, 231),rgb(123, 98, 156))",
                                        borderRadius: "5px",
                                        border: "1px solid #cce4f7",
                                        display: "inline-block",
                                        color: "#fff",
                                    }}
                                >Product Detailes</div>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>

                                        <Popover
                                            trigger="click"
                                            overlayClassName="custom-popover"
                                            placement="top"
                                            visible={visible}
                                            onVisibleChange={setVisible}
                                            onOpenChange={setVisible}
                                            content={
                                                <div
                                                    style={{
                                                        maxWidth: '90vw',
                                                        height: 460, // Fixed height for popover
                                                        overflowY: 'auto',
                                                        padding: 16,
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <CloseOutlined
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
                                                    <Card style={{ backgroundColor: "#F0F5FF" }}>
                                                        <Card style={{
                                                            background: "linear-gradient(to right, rgb(1, 64, 157), rgb(40, 135, 100))",
                                                            marginBottom: 12
                                                        }}>
                                                            <Row gutter={12} wrap align="middle">
                                                                <Col span={4}>
                                                                    <label style={labelStyle}>Item Name</label>
                                                                    <Select
                                                                        ref={itemNameRef}
                                                                        showSearch
                                                                        placeholder="Select Item"
                                                                        style={{ width: '100%' }}
                                                                        value={itemName}
                                                                        onChange={(val) => {
                                                                            setItemName(val);
                                                                            setTimeout(() => purityRef.current?.focus(), 0);
                                                                        }}
                                                                        onKeyDown={(e) => e.key === 'Enter' && purityRef.current?.focus()}
                                                                        optionFilterProp="children"
                                                                        filterOption={(input, option) =>
                                                                            option.children.toLowerCase().includes(input.toLowerCase())
                                                                        }
                                                                    >
                                                                        <Select.Option value="Ring">Ring</Select.Option>
                                                                        <Select.Option value="Necklace">Necklace</Select.Option>
                                                                        <Select.Option value="Bangle">Bangle</Select.Option>
                                                                    </Select>
                                                                </Col>
                                                                <Col span={2}>
                                                                    <label style={labelStyle} >Purity</label>
                                                                    <Select
                                                                        ref={purityRef}
                                                                        showSearch
                                                                        placeholder="Select Purity"
                                                                        style={{ width: '100%' }}
                                                                        value={purity}
                                                                        onChange={(val) => {
                                                                            setPurity(val);
                                                                            setTimeout(() => piecesRef.current?.focus(), 0);
                                                                        }}
                                                                        onKeyDown={(e) => e.key === 'Enter' && piecesRef.current?.focus()}
                                                                        optionFilterProp="children"
                                                                        filterOption={(input, option) =>
                                                                            option.children.toLowerCase().includes(input.toLowerCase())
                                                                        }
                                                                    >
                                                                        <Select.Option value="22K">22K</Select.Option>
                                                                        <Select.Option value="24K">24K</Select.Option>
                                                                        <Select.Option value="18K">18K</Select.Option>
                                                                    </Select>
                                                                </Col>
                                                                <Col span={2}>
                                                                    <label style={labelStyle}>Pieces</label>
                                                                    <Input
                                                                        ref={piecesRef}
                                                                        type="number"
                                                                        value={pieces}
                                                                        onChange={(e) => setPieces(e.target.value)}
                                                                        onKeyDown={(e) => e.key === 'Enter' && gwtRef.current?.focus()}
                                                                    />
                                                                </Col>
                                                                <Col span={3}>
                                                                    <label style={labelStyle}>Gross.Wt</label>
                                                                    <Input
                                                                        ref={gwtRef}
                                                                        type="number"
                                                                        style={inputStyle}
                                                                        value={gwt}
                                                                        onChange={(e) => setGwt(e.target.value)}
                                                                        onKeyDown={(e) => e.key === 'Enter' && swtRef.current?.focus()}
                                                                    />
                                                                </Col>

                                                                <Col span={3}>
                                                                    <label style={labelStyle}>Less.Wt</label>
                                                                    <Input
                                                                        ref={swtRef}
                                                                        type="number"
                                                                        style={inputStyle}

                                                                        value={swt}
                                                                        onChange={(e) => setSwt(e.target.value)}
                                                                        onKeyDown={(e) => e.key === 'Enter' && nwtRef.current?.focus()}
                                                                    />
                                                                </Col>
                                                                <Col span={3}>
                                                                    <label style={labelStyle}>Net.Wt</label>
                                                                    <Input
                                                                        ref={nwtRef}
                                                                        type="number"
                                                                        style={inputStyle}

                                                                        value={nwt}
                                                                        onChange={(e) => setNwt(e.target.value)}
                                                                        onKeyDown={(e) => e.key === 'Enter' && rateRef.current?.focus()}
                                                                    />
                                                                </Col>
                                                                <Col span={2}>
                                                                    <label style={labelStyle}>Rate</label>
                                                                    <Input
                                                                        ref={rateRef}
                                                                        type="number"
                                                                        value={rate}
                                                                        style={inputStyle}

                                                                        onChange={(e) => setRate(e.target.value)}
                                                                        onKeyDown={(e) => e.key === 'Enter' && amountRef.current?.focus()}
                                                                    />
                                                                </Col>
                                                                <Col span={3}>
                                                                    <label style={labelStyle}>Amount</label>
                                                                    <Input
                                                                        ref={amountRef}
                                                                        type="number"
                                                                        value={amount}
                                                                        style={inputStyle}

                                                                        onChange={(e) => setAmount(e.target.value)}
                                                                        onKeyDown={(e) => e.key === 'Enter' && handleAddOrUpdateEntry()}
                                                                    />
                                                                </Col>
                                                                <Col span={2} style={{ display: 'flex', alignItems: 'center', marginTop: 22 }}>
                                                                    <Button
                                                                        type="primary"
                                                                        onClick={() => {
                                                                            if (!itemName || !purity || !pieces || !gwt || !nwt || !swt || !rate || !amount) {
                                                                                message.error("Please fill all item fields");
                                                                                return;
                                                                            }
                                                                            handleAddOrUpdateEntry();
                                                                            setItemName(null);
                                                                            setPurity(null);
                                                                            setPieces('');
                                                                            setGwt('');
                                                                            setNwt('');
                                                                            setSwt('');
                                                                            setRate('');
                                                                            setAmount('');
                                                                            setEditingIndex(null);
                                                                            setTimeout(() => itemNameRef.current?.focus(), 0);
                                                                        }}
                                                                        icon={editingIndex !== null ? null : <PlusOutlined />}
                                                                        size="small"
                                                                        style={{
                                                                            width: 32,
                                                                            height: 32,
                                                                            padding: 0,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                        }}
                                                                    >
                                                                        {editingIndex !== null ? "✓" : null}
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                        <Card>

                                                            <Table
                                                                className="custom-loan-table"

                                                                columns={columnsWithActions}
                                                                dataSource={tableData}
                                                                pagination={false}
                                                                size="small"
                                                                rowKey="key"
                                                                scroll={{ y: 200 }}
                                                                style={{ marginBottom: 8 }}
                                                                summary={pageData => {
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
                                                                            <Table.Summary.Cell index={colIdx.swt}><b>{totals.swt.toFixed(3)}</b></Table.Summary.Cell>
                                                                            <Table.Summary.Cell index={colIdx.nwt}><b>{totals.nwt.toFixed(3)}</b></Table.Summary.Cell>
                                                                            <Table.Summary.Cell index={colIdx.rate}></Table.Summary.Cell>
                                                                            <Table.Summary.Cell index={colIdx.amount}><b>{totals.amount.toFixed(2)}</b></Table.Summary.Cell>
                                                                            <Table.Summary.Cell index={colIdx.action}></Table.Summary.Cell>
                                                                        </Table.Summary.Row>
                                                                    );
                                                                }}
                                                            />
                                                            <Row justify="end" gutter={8}>
                                                                <Col>
                                                                    <Button
                                                                        onClick={() => {
                                                                            setTableData([]);
                                                                            setTotals({ gwt: 0, nwt: 0, swt: 0, amount: 0, pieces: 0 });
                                                                            setItemName(null);
                                                                            setPurity(null);
                                                                            setPieces('');
                                                                            setGwt('');
                                                                            setNwt('');
                                                                            setSwt('');
                                                                            setRate('');
                                                                            setAmount('');
                                                                            setEditingIndex(null);
                                                                            if (form && form.resetFields) form.resetFields();
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
                                                        </Card>
                                                    </Card>

                                                </div>
                                            }
                                        >
                                            <Button
                                                type="primary"
                                                block
                                                style={{
                                                    height: 40,
                                                    fontSize: 16,
                                                    fontWeight: "bold",
                                                    background: "linear-gradient(to right, rgb(1, 64, 157), rgb(40, 135, 100))",
                                                    borderColor: "transparent",
                                                    color: "#fff",
                                                    maxWidth: 300,
                                                    width: "100%",
                                                }}
                                                disabled={isButtonDisabled === true}
                                                icon={<PlusOutlined style={{ fontSize: 18, fontWeight: "bold" }} />}
                                            >
                                                Items
                                            </Button>
                                        </Popover>
                                    </div>
                                    <Row justify="center" style={{ marginBottom: 8 }}>
                                        <Col>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                                {[
                                                    { label: "Gross Weight", value: totals.gwt.toFixed(3) },
                                                    { label: "Stone weight", value: totals.swt.toFixed(3) },

                                                    { label: "Net Weight", value: totals.nwt.toFixed(3) },
                                                    { label: "Product Value", value: totals.amount.toFixed(2) },
                                                ].map((item, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "flex-start",
                                                            alignItems: "center",
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
                                                        <Input
                                                            value={item.value}
                                                            readOnly
                                                            style={{
                                                                minWidth: 120,
                                                                textAlign: "right",
                                                                backgroundColor: "#f5f5f5",
                                                            }}
                                                        />
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
                                style={{
                                    background: "#F0F5FF",
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",

                                }}
                                bodyStyle={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                }}
                                className={visible ? "blurred-section" : ""}                            >
                                <div style={{ width: "100%", maxWidth: 500 }}>
                                    {/* Left-aligned Heading */}
                                    <div
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 13,
                                        marginBottom: 12,
                                        padding: "4px 8px",
                                        background: "linear-gradient(to right,rgb(130, 188, 231),rgb(123, 98, 156))",
                                        borderRadius: "5px",
                                        border: "1px solid #cce4f7",
                                        display: "inline-block",
                                        color: "#fff",
                                    }}
                                >Interest Details</div>

                                    {/* Interest Details Summary - editable and spaced */}
                                    <Row justify="center" >
                                        <Col>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                                {[
                                                    { label: "Loan Release Amount", name: "loanAmount" },
                                                    { label: "Interest Rate (%)", name: "interestRate" },
                                                    { label: "First Interest", name: "firstInterest" },
                                                    { label: "Document Charges", name: "docCharges" },
                                                    { label: "Paid Amount", name: "paidAmount" },
                                                ].map((item, index) => (
                                                    <Form.Item
                                                        key={item.name}
                                                        name={item.name}
                                                        style={{ marginBottom: 0 }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                minWidth: 250,
                                                                gap: 16, // space between label and input
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontWeight: 500,
                                                                    minWidth: 140,
                                                                    textAlign: "left",
                                                                    display: "inline-block",
                                                                }}
                                                            >
                                                                {item.label}
                                                            </span>
                                                            <Input
                                                                style={{
                                                                    minWidth: 120,
                                                                    textAlign: "right",
                                                                    backgroundColor: "#fff",
                                                                }}
                                                            />
                                                        </div>
                                                    </Form.Item>
                                                ))}
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* Centered Buttons Below */}
                                    <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20, marginBottom: 20 }}>

                                        <Button
                                            onClick={() => {
                                                window.print();
                                            }}
                                        >
                                            Print
                                        </Button>
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
                                </div>
                            </Card>

                        </Col>
                    </Row>
                </div>
            </Card>
            <style>
                {`
                    .blurred-section {
                        filter: blur(4px);
                        pointer-events: none;
                        user-select: none;
                        transition: filter 0.2s;
                    }
                `}
            </style>
        </div>

    );
};

export default LoanEntryMast;