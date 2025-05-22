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
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
        if (!itemName || !purity || !pieces || !gwt || !nwt || !swt || !rate || !amount) {
            message.error("Please fill all item fields");
            return;
        }
        const newEntry = {
            key: editingIndex !== null ? tableData[editingIndex].key : Date.now(),
            itemName,
            purity,
            pieces,
            gwt,
            nwt,
            swt,
            rate,
            amount,
        };
        if (editingIndex !== null) {
            const updated = [...tableData];
            updated[editingIndex] = newEntry;
            setTableData(updated);
        } else {
            setTableData([...tableData, newEntry]);
        }
        handleEntryReset();
        setEditingIndex(null); // <-- add this line
    };


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
                <Card>
                    <Row gutter={24}>
                        <Col span={12} style={{ display: "flex", flexDirection: "column" }}>
                            <Card style={{ background: "#F0F5FF", flex: 1 }}>
                                <div
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 15,
                                        // borderBottom: "1px solid #ccc",
                                    }}
                                >
                                    Customer Details
                                </div>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Customer Name"
                                            name="customerName"
                                            rules={[{ required: true, message: "Customer Name is required" }]}
                                            labelCol={{ span: 24 }}
                                        >
                                            <Input
                                                placeholder="Customer Name"
                                                ref={customerNameRef}
                                                onPressEnter={() => focusNext(swdofRef)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="S/W/D Of" name="swdof" labelCol={{ span: 24 }}>
                                            <Input
                                                placeholder="S/W/D Of"
                                                ref={swdofRef}
                                                onPressEnter={() => focusNext(addressRef)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item label="Address" name="address" labelCol={{ span: 24 }}>
                                            <Input.TextArea
                                                rows={2}
                                                placeholder="Address"
                                                ref={addressRef}
                                                onPressEnter={() => focusNext(pincodeRef)}
                                            />
                                        </Form.Item>
                                    </Col>

                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Pincode" name="pincode" labelCol={{ span: 24 }}>
                                            <Input
                                                maxLength={6}
                                                placeholder="Pincode"
                                                ref={pincodeRef}
                                                onPressEnter={() => focusNext(cityRef)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="City" name="city" labelCol={{ span: 24 }}>
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
                                        <Form.Item label="State" name="state" labelCol={{ span: 24 }}>
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
                                        <Form.Item label="Mobile No" name="mobile" labelCol={{ span: 24 }}>
                                            <Input
                                                maxLength={10}
                                                placeholder="Mobile No"
                                                ref={mobileRef}
                                                onPressEnter={() => focusNext(altmobileRef)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>

                                    <Col span={12}>
                                        <Form.Item label="Alternate Mobile No" name="altmobile" labelCol={{ span: 24 }}>
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

                        <Col span={12} style={{ display: "flex", flexDirection: "column" }}>
                            <Card style={{ background: "#F0F5FF", flex: 1 }}>

                                <div
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 15,
                                        // borderBottom: "1px solid #ccc",
                                    }}
                                >
                                    Personal Details
                                </div>
                                <Row gutter={16} align="middle" style={{ marginTop: "5px" }}>
                                    <Col span={12}>
                                        <AvatarUpload />
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item style={{ marginBottom: 16 }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <label style={{ width: "40%", fontWeight: 500 }}>PAN No</label>
                                                <div style={{ width: "60%" }}>
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
                                                </div>
                                            </div>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item style={{ marginBottom: 16, marginTop: 8 }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <label style={{ width: "40%", fontWeight: 500 }}>Aadhar No</label>
                                                <div style={{ width: "60%" }}>
                                                    <Input
                                                        placeholder="123412341234"
                                                        maxLength={12}
                                                        inputMode="numeric"
                                                        value={aadhar}
                                                        onChange={onChangeAdhar}
                                                    />
                                                    {errorAadar && (
                                                        <div
                                                            style={{
                                                                color: "#ff4d4f",
                                                                textAlign: "right",
                                                                marginTop: 4,
                                                                fontSize: 12,
                                                            }}
                                                        >
                                                            {errorAadar}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item name="refPerson" style={{ marginBottom: 16, marginTop: 8 }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <label style={{ width: "40%", fontWeight: 500 }}>Reference Person</label>
                                                <Input style={{ width: "60%" }} />
                                            </div>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item name="refMob" style={{ marginBottom: 16, marginTop: 8 }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <label style={{ width: "40%", fontWeight: 500 }}>Ref Per Mob No</label>
                                                <Input maxLength={10} style={{ width: "60%" }} />
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
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Form>
  <Card style={{ background: "#c7d6f3", marginTop: 5 }}>
    <div style={{ height: "calc(100vh - 100px)" }}>
        <Row gutter={12} style={{ height: "46%" }}>
    {/* Left Column */}
    <Col span={12} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Card
        style={{ background: "#F0F5FF", flex: 1, display: "flex", flexDirection: "column" }}
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
          <div>
            <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 8 }}>Loan Items</div>
            {/* Items Button with Popover */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
  <Popover
    trigger="click"
    overlayClassName="custom-popover"
    placement="bottom"
  visible={visible}
  onVisibleChange={setVisible}

    content={
      <div style={{ maxWidth: '100vw', padding: 16 }}>
        {/* Entry Row in Popover */}
        <Card style={{ background: "#bbcdef", marginBottom: 12 }}>
        <Row gutter={12} style={{ marginBottom: 12 }} wrap>
          <Col span={4}>
            <label>Item Name</label>
            <Select
              placeholder="Select Item"
              style={{ width: '100%' }}
              value={itemName}
              ref={itemNameRef}
              onChange={val => {
                setItemName(val);
                setTimeout(() => purityRef.current?.focus(), 0);
              }}
              tabIndex={0}
            >
              <Select.Option value="Ring">Ring</Select.Option>
              <Select.Option value="Necklace">Necklace</Select.Option>
              <Select.Option value="Bangle">Bangle</Select.Option>
            </Select>
          </Col>
          <Col span={2}>
            <label>Purity</label>
            <Select
              placeholder="Select Purity"
              style={{ width: '100%' }}
              value={purity}
              ref={purityRef}
              onChange={val => {
                setPurity(val);
                setTimeout(() => piecesRef.current?.focus(), 0);
              }}
              tabIndex={0}
            >
              <Select.Option value="22K">22K</Select.Option>
              <Select.Option value="24K">24K</Select.Option>
              <Select.Option value="18K">18K</Select.Option>
            </Select>
          </Col>
          <Col span={2}>
            <label>Pieces</label>
            <Input
              type="number"
              placeholder="pieces"
              value={pieces}
              ref={piecesRef}
              onChange={e => setPieces(e.target.value)}
              onKeyDown={e => e.key === "Enter" && gwtRef.current?.focus()}
            />
          </Col>
          <Col span={2}>
            <label>GWT</label>
            <Input
              type="number"
              placeholder="gwt"
              value={gwt}
              ref={gwtRef}
              onChange={e => setGwt(e.target.value)}
              onKeyDown={e => e.key === "Enter" && nwtRef.current?.focus()}
            />
          </Col>
          <Col span={2}>
            <label>NWT</label>
            <Input
              type="number"
              placeholder="nwt"
              value={nwt}
              ref={nwtRef}
              onChange={e => setNwt(e.target.value)}
              onKeyDown={e => e.key === "Enter" && swtRef.current?.focus()}
            />
          </Col>
          <Col span={2}>
            <label>SWT</label>
            <Input
              type="number"
              placeholder="swt"
              value={swt}
              ref={swtRef}
              onChange={e => setSwt(e.target.value)}
              onKeyDown={e => e.key === "Enter" && rateRef.current?.focus()}
            />
          </Col>
          <Col span={2}>
            <label>Rate</label>
            <Input
              type="number"
              placeholder="rate"
              value={rate}
              ref={rateRef}
              onChange={e => setRate(e.target.value)}
              onKeyDown={e => e.key === "Enter" && amountRef.current?.focus()}
            />
          </Col>
          <Col span={3}>
            <label>Amount</label>
            <Input
              type="number"
              placeholder="amount"
              value={amount}
              ref={amountRef}
              onChange={e => setAmount(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddOrUpdateEntry()}
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
        {/* Table in Popover */}
                <TableHeaderStyles>
        
        <Table
       
  columns={columnsWithActions}
  dataSource={tableData}
  pagination={false}
  size="small"
  rowKey="key"
  scroll={{ y: 200 }} // adjust based on row height (~5 rows)
  bordered={false} // remove borders
  style={{ marginBottom: 8 }}
/>
</TableHeaderStyles>

{/* Action Buttons: Refresh and OK */}
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

    setTotals({
      gwt: totalGWT,
      nwt: totalNWT,
      swt: totalSWT,
      amount: totalAmount,
    });

    setVisible(false); // Close the popover if applicable
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
      style={{  height: 40, fontSize: 16, fontWeight: "bold",backgroundColor: "#150A4E", borderColor: "#4A90E2" }}
      icon={<span style={{ fontSize: 18, fontWeight: 'bold' }}>+</span>}
    >
      Items
    </Button>
  </Popover>
</div>

            {/* Totals Vertical */}
  <Row gutter={12} style={{ marginBottom: 8 }}>
  <Col span={24}>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div>
        <span style={{ fontWeight: 500 }}>Total GWT: </span>
        <span>{totals.gwt.toFixed(3)}</span>
      </div>
      <div>
        <span style={{ fontWeight: 500 }}>Total NWT: </span>
        <span>{totals.nwt.toFixed(3)}</span>
      </div>
      <div>
        <span style={{ fontWeight: 500 }}>Total SWT: </span>
        <span>{totals.swt.toFixed(3)}</span>
      </div>
      <div>
        <span style={{ fontWeight: 500 }}>Total Amount: </span>
        <span>{totals.amount.toFixed(2)}</span>
      </div>
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