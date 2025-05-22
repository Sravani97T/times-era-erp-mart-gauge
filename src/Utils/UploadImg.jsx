import React, { useState } from "react";
import { Upload, Modal, message } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";

const AvatarUpload = () => {
    const [imageUrl, setImageUrl] = useState(null); // JPG preview URL
    const [previewVisible, setPreviewVisible] = useState(false); // Modal visibility
    const [base64Image, setBase64Image] = useState(null); // Base64 formatted JPG image
    const [fileName, setFileName] = useState(null); // Extracted file name

    // Convert file to JPG Base64
    const convertToJpgBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                // Export as JPG
                const jpgDataUrl = canvas.toDataURL("image/jpeg", 0.92);
                callback(jpgDataUrl);
            };
            img.onerror = () => message.error("Failed to process image.");
            img.src = reader.result;
        };
        reader.onerror = () => message.error("Failed to read image file.");
    };

    // Handle Image Upload
    const handleBeforeUpload = (file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size / 1024 / 1024 < 2; // 2MB limit

        if (!isValidType) {
            message.error("You can only upload image files!");
            return false;
        }

        if (!isValidSize) {
            message.error("Image must be smaller than 2MB!");
            return false;
        }

        setFileName(file.name);

        // Convert the file to JPG Base64 and set it
        convertToJpgBase64(file, (jpgDataUrl) => {
            setImageUrl(jpgDataUrl);
            setBase64Image(jpgDataUrl.split(",")[1]); // Remove the "data:image/jpeg;base64," prefix
        });

        return false; // Prevent automatic upload
    };

    // Preview Image in Modal
    const handlePreview = () => {
        setPreviewVisible(true);
    };

    // Delete Image
    const handleDelete = () => {
        setImageUrl(null);
        setBase64Image(null);
        setFileName(null);
        message.success("Image removed successfully!");
    };

    return (
        <div style={{ textAlign: "center" }}>
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={handleBeforeUpload}
                openFileDialogOnClick={!imageUrl}
            >
                {imageUrl ? (
                    <div className="image-container">
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />
                        <div className="hover-overlay">
                            <EyeOutlined
                                className="icon"
                                style={{ marginRight: "16px" }}
                                onClick={handlePreview}
                            />
                            <DeleteOutlined className="icon" onClick={handleDelete} />
                        </div>
                    </div>
                ) : (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                )}
            </Upload>

            <Modal
                open={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="Preview" style={{ width: "100%" }} src={imageUrl} />
            </Modal>
        </div>
    );
};

export default AvatarUpload;
