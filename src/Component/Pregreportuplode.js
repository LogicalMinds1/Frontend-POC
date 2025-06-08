import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [decodedText, setDecodedText] = useState("");
  const [webhookData, setWebhookData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [openAiExplanation, setOpenAiExplanation] = useState("");
  const [uploadWebhookResponse, setUploadWebhookResponse] = useState(null);

  const token = localStorage.getItem("token");
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

  const formatObjectToText = (obj, indent = 0) => {
    const padding = " ".repeat(indent);
    if (typeof obj !== "object" || obj === null) {
      return `${obj}`;
    }
    return Object.entries(obj)
      .map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          return `${padding}${key}:\n${formatObjectToText(value, indent + 2)}`;
        } else {
          return `${padding}${key}: ${value}`;
        }
      })
      .join("\n");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadStatus("");
    setDecodedText("");
    setWebhookData(null);
    setPredictionData(null);
    setOpenAiExplanation("");
    setUploadWebhookResponse(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      setUploadStatus("Unsupported file type. Please upload PDF or JPG/PNG images.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploadStatus("Uploading...");
      setIsUploading(true);

      const response = await axios.post(
        "http://3.110.108.131:9000/upload-test",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadStatus(`Uploading... ${percentCompleted}%`);
          },
        }
      );

      const decoded = response.data?.fileRecord?.decodedText;
      setDecodedText(decoded || "No decoded text returned");

      const webhookResponse = response.data?.webhookResponse;
      if (webhookResponse) {
        try {
          const parsedData =
            typeof webhookResponse === "string"
              ? JSON.parse(webhookResponse)
              : webhookResponse;
          setWebhookData(parsedData);
          setUploadStatus("Upload + Webhook success!");
        } catch (error) {
          console.error("Webhook JSON parsing error:", error);
          setWebhookData({
            error: "Webhook returned non-JSON format",
            raw: webhookResponse,
          });
          setUploadStatus("Upload success, but webhook data is not in JSON format.");
        }
      } else {
        setWebhookData(null);
        setUploadStatus("Upload successful, but no webhook response.");
      }

      const predictionRes = response.data?.predictionResponse;
      if (predictionRes) {
        setPredictionData(predictionRes);
      } else {
        setPredictionData({ error: "No prediction response received." });
      }

      const explanation = response.data?.explanation;
      setOpenAiExplanation(explanation || "No explanation generated");

      const uploadWebhookRes = response.data?.uploadWebhookResponse;
      setUploadWebhookResponse(uploadWebhookRes || { error: "No webhook response" });

    } catch (error) {
      console.error("Upload error:", error);
      const message = error.response?.data?.error || "Upload failed. Please try again.";
      setUploadStatus(message);
      setWebhookData(null);
      setDecodedText("");
      setPredictionData(null);
      setOpenAiExplanation("");
      setUploadWebhookResponse(null);
    } finally {
      setIsUploading(false);
    }
  };

  const renderMedicalData = () => {
    if (!decodedText && !webhookData && !predictionData && !openAiExplanation && !uploadWebhookResponse)
      return null;

    return (
      <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
        {decodedText && (
          <>
            <Typography variant="h6" gutterBottom>
              📄 Decoded Text from Uploaded File
            </Typography>
            <Box component="pre" sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              mb: 3,
            }}>
              {decodedText}
            </Box>
          </>
        )}



        {predictionData && (
          <>
            <Typography variant="h6" gutterBottom>
              🔮 Prediction Result from FastAPI
            </Typography>
            <Box sx={{
              backgroundColor: "background.paper",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              p: 2,
              mt: 2,
            }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Text Format:
              </Typography>
              <Box component="pre" sx={{
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                backgroundColor: "#f5f5f5",
                p: 2,
                borderRadius: 1,
                overflowX: "auto",
              }}>
                {formatObjectToText(predictionData)}
              </Box>
            </Box>
          </>
        )}

        {openAiExplanation && (
          <>
            <Typography variant="h6" gutterBottom>
              🧠 OpenAI Explanation
            </Typography>
            <Box component="pre" sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              backgroundColor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              overflowX: "auto",
              mb: 3,
            }}>
              {openAiExplanation}
            </Box>
          </>
        )}

        {uploadWebhookResponse && (
          <>
            <Typography variant="h6" gutterBottom>
              🍎 Nutrients Chart
            </Typography>
            <Box component="pre" sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              backgroundColor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              overflowX: "auto",
              mb: 3,
            }}>
              {Object.entries(uploadWebhookResponse)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n")}
            </Box>
          </>
        )}
      </Paper>
    );
  };

  const getStatusColor = () => {
    if (isUploading) return "info.light";
    if (uploadStatus.includes("success")) return "success.light";
    if (uploadStatus.includes("failed") || uploadStatus.includes("error")) return "error.light";
    return "warning.light";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        p: 3,
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", mb: 3, color: "primary.main", fontWeight: "bold" }}>
          Medical Document Upload
        </Typography>

        <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 3, color: "text.secondary" }}>
          Upload PDF or image files (JPEG/PNG) to extract medical data
        </Typography>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mb: 3 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                py: 2,
                px: 4,
                borderStyle: "dashed",
                width: "100%",
                height: "120px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="body1">
                {selectedFile ? selectedFile.name : "Choose a medical document"}
              </Typography>
              <Typography variant="caption" sx={{ mt: 1 }}>
                {selectedFile ? "Click to change" : "or drag and drop"}
              </Typography>
              <VisuallyHiddenInput
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={handleFileChange}
              />
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!selectedFile || isUploading}
              sx={{ py: 1.5, px: 4, width: "100%", maxWidth: "200px" }}
            >
              {isUploading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Upload File"
              )}
            </Button>
          </Box>
        </Box>

        {uploadStatus && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1,
              backgroundColor: getStatusColor(),
              textAlign: "center",
            }}
          >
            <Typography variant="body2">{uploadStatus}</Typography>
          </Box>
        )}

        {renderMedicalData()}
      </Paper>
    </Box>
  );
};

export default FileUploadForm;