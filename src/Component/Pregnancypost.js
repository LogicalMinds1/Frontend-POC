import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

// --- THEME DEFINITION ---
const theme = {
  colors: {
    primary: "#007bff", // Professional Blue
    primaryDark: "#0056b3",
    secondary: "#6c757d", // Muted Gray
    success: "#28a745",
    successDark: "#1e7e34",
    danger: "#dc3545",
    dangerDark: "#b02a37",
    warning: "#ffc107",
    light: "#f8f9fa", // Very light gray / off-white
    dark: "#343a40", // Dark gray / near black
    text: "#212529", // Primary text color
    textSecondary: "#6c757d",
    border: "#ced4da",
    inputBg: "#ffffff",
    disabledBg: "#e9ecef",
    disabledText: "#6c757d",
    sectionBg: "#ffffff", // Background for individual sections
    appBg: "#f4f7f9", // Overall app background
  },
  fonts: {
    main: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    monospace: "Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
  spacing: (unit = 1) => `${unit * 8}px`, // 8px grid system
  borderRadius: "6px",
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    md: "0 4px 8px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)",
    lg: "0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.07)",
  },
  breakpoints: {
    // For conceptual reference, not directly usable in inline styles
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
  },
  inputHeight: "38px",
};

const AncFullForm = () => {
  const initialData = {
    AGE: "",
    HEIGHT: "",
    WEIGHT: "",
    BLOOD_GRP: "",
    HUSBAND_BLOOD_GROUP: "",
    GRAVIDA: "",
    PARITY: "",
    ABORTIONS: "",
    PREVIOUS_ABORTION: "",
    LIVE: "",
    DEATH: "",
    KNOWN_EPILEPTIC: "",
    TWIN_PREGNANCY: "",
    GESTANTIONAL_DIA: "",
    CONVULSION_SEIZURES: "",
    BP: "",
    BP1: "",
    HEMOGLOBIN: "",
    PULSE_RATE: "",
    RESPIRATORY_RATE: "",
    HEART_RATE: "",
    FEVER: "",
    OEDEMA: "",
    OEDEMA_TYPE: "",
    UTERUS_SIZE: "",
    URINE_SUGAR: "",
    URINE_ALBUMIN: "",
    THYROID: "",
    RH_NEGATIVE: "",
    SYPHYLIS: "",
    HIV: "",
    HIV_RESULT: "",
    HEP_RESULT: "",
    BLOOD_SUGAR: "",
    OGTT_2_HOURS: "",
    WARNING_SIGNS_SYMPTOMS_HTN: "",
    ANY_COMPLAINTS_BLEEDING_OR_ABNORMAL_DISCHARGE: "",
    IFA_TABLET: "",
    IFA_QUANTITY: "",
    IRON_SUCROSE_INJ: "",
    CALCIUM: "",
    FOLIC_ACID: "",
    SCREENED_FOR_MENTAL_HEALTH: "",
    PHQ_SCORE: "",
    GAD_SCORE: "",
    PHQ_ACTION: "",
    GAD_ACTION: "",
    ANC1FLG: "",
    ANC2FLG: "",
    ANC3FLG: "",
    ANC4FLG: "",
    MISSANC1FLG: "",
    MISSANC2FLG: "",
    MISSANC3FLG: "",
    MISSANC4FLG: "",
    NO_OF_WEEKS: "",
    DELIVERY_MODE: "",
    PLACE_OF_DELIVERY: "",
    IS_PREV_PREG: "",
    CONSANGUINITY: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = {
    basicInfo: {
      title: "Basic Information",
      fields: ["AGE", "HEIGHT", "WEIGHT", "BLOOD_GRP", "HUSBAND_BLOOD_GROUP"],
    },
    pregnancyHistory: {
      title: "Pregnancy History",
      fields: [
        "GRAVIDA",
        "PARITY",
        "ABORTIONS",
        "PREVIOUS_ABORTION",
        "LIVE",
        "DEATH",
      ],
    },
    medicalConditions: {
      title: "Medical Conditions",
      fields: [
        "KNOWN_EPILEPTIC",
        "TWIN_PREGNANCY",
        "GESTANTIONAL_DIA",
        "CONVULSION_SEIZURES",
      ],
    },
    vitalSigns: {
      title: "Vital Signs",
      fields: [
        "BP",
        "BP1",
        "HEMOGLOBIN",
        "PULSE_RATE",
        "RESPIRATORY_RATE",
        "HEART_RATE",
        "FEVER",
      ],
    },
    examinations: {
      title: "Examinations",
      fields: [
        "OEDEMA",
        "OEDEMA_TYPE",
        "UTERUS_SIZE",
        "URINE_SUGAR",
        "URINE_ALBUMIN",
        "THYROID",
        "RH_NEGATIVE",
      ],
    },
    tests: {
      title: "Test Results",
      fields: [
        "SYPHYLIS",
        "HIV",
        "HIV_RESULT",
        "HEP_RESULT",
        "BLOOD_SUGAR",
        "OGTT_2_HOURS",
      ],
    },
    symptoms: {
      title: "Symptoms",
      fields: [
        "WARNING_SIGNS_SYMPTOMS_HTN",
        "ANY_COMPLAINTS_BLEEDING_OR_ABNORMAL_DISCHARGE",
      ],
    },
    medications: {
      title: "Medications",
      fields: [
        "IFA_TABLET",
        "IFA_QUANTITY",
        "IRON_SUCROSE_INJ",
        "CALCIUM",
        "FOLIC_ACID",
      ],
    },
    mentalHealth: {
      title: "Mental Health",
      fields: [
        "SCREENED_FOR_MENTAL_HEALTH",
        "PHQ_SCORE",
        "GAD_SCORE",
        "PHQ_ACTION",
        "GAD_ACTION",
      ],
    },
    ancVisits: {
      title: "ANC Visits",
      fields: [
        "ANC1FLG",
        "ANC2FLG",
        "ANC3FLG",
        "ANC4FLG",
        "MISSANC1FLG",
        "MISSANC2FLG",
        "MISSANC3FLG",
        "MISSANC4FLG",
      ],
    },
    delivery: {
      title: "Delivery Information",
      fields: [
        "NO_OF_WEEKS",
        "DELIVERY_MODE",
        "PLACE_OF_DELIVERY",
        "IS_PREV_PREG",
        "CONSANGUINITY",
      ],
    },
  };

  const enumOptions = {
    BLOOD_GRP: [
      " ",
      "-1",
      "-1.0",
      "0",
      "0.0",
      "1",
      "1.0",
      "2",
      "2.0",
      "3",
      "3.0",
      "4",
      "4.0",
      "5",
      "5.0",
      "6",
      "6.0",
      "7",
      "7.0",
      "8",
      "8.0",
      "9",
      "9.0",
    ],
    HUSBAND_BLOOD_GROUP: [
      "1.0",
      "2.0",
      "3.0",
      "4.0",
      "5.0",
      "6.0",
      "7.0",
      "8.0",
      "9.0",
      "No",
    ],
    GRAVIDA: [
      "G",
      "G1",
      "G10",
      "G12",
      "G2",
      "G3",
      "G4",
      "G5",
      "G6",
      "G7",
      "G8",
      "G9",
    ],
    PARITY: [
      "-1",
      "P",
      "P0",
      "P00",
      "P1",
      "P2",
      "P3",
      "P4",
      "P5",
      "P6",
      "P7",
      "P8",
      "P9",
    ],
    ABORTIONS: [
      "A",
      "A0",
      "A00",
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8",
      "A9",
    ],
    PREVIOUS_ABORTION: ["No", "Yes"],
    LIVE: [
      "L",
      "L0",
      "L00",
      "L1",
      "L2",
      "L3",
      "L4",
      "L5",
      "L6",
      "L7",
      "L8",
      "L9",
      "P2",
    ],
    DEATH: ["-1", "D", "D0", "D00", "D1", "D2", "D3", "D4", "D5", "D6"],
    TWIN_PREGNANCY: ["No", "Yes"],
    GESTANTIONAL_DIA: ["0", "No", "Yes"],
    OEDEMA: ["No", "Yes"],
    OEDEMA_TYPE: [
      "No",
      "Non-dependent oedema (Facial puffiness, abdominal oedema, vulval oedema)",
      "Pedal Oedema",
    ],
    URINE_SUGAR: ["No", "Yes"],
    URINE_ALBUMIN: ["No", "Yes"],
    THYROID: ["No", "Yes"],
    RH_NEGATIVE: ["No", "Yes"],
    SYPHYLIS: ["No", "Yes"],
    HIV: ["No", "Yes"],
    HIV_RESULT: ["No", "Yes"],
    HEP_RESULT: ["Negative", "Positive"],
    WARNING_SIGNS_SYMPTOMS_HTN: [
      "Blurring of vision",
      "Decreased urine output",
      "Epigastric pain",
      "Headache",
      "No",
      "Vomitting",
    ],
    ANY_COMPLAINTS_BLEEDING_OR_ABNORMAL_DISCHARGE: ["Bleeding", "No"],
    IFA_TABLET: [" ", "No", "YES", "Yes"],
    IRON_SUCROSE_INJ: ["No", "Yes"],
    CALCIUM: ["No", "Yes"],
    SCREENED_FOR_MENTAL_HEALTH: ["No", "Yes"],
    PHQ_ACTION: ["Give counselling", "No", "Psychiatrist for treatment"],
    GAD_ACTION: ["Give counselling", "No", "Psychiatrist for treatment"],
    ANC1FLG: ["No", "Yes"],
    ANC2FLG: ["No", "Yes"],
    ANC3FLG: ["No", "Yes"],
    ANC4FLG: ["No", "Yes"],
    MISSANC1FLG: ["No", "Yes"],
    MISSANC2FLG: ["No", "Yes"],
    MISSANC3FLG: ["No", "Yes"],
    MISSANC4FLG: ["No", "Yes"],
    DELIVERY_MODE: [
      "-1",
      "C- Section",
      "C-Section",
      "LSCS",
      "Noraml",
      "Normal",
    ],
    PLACE_OF_DELIVERY: [
      "-1",
      "C-Section",
      "Govt",
      "Home",
      "Live",
      "Other Govt",
      "Other State",
      "Private",
      "Transit",
      "govt",
    ],
    IS_PREV_PREG: ["No", "Private", "Yes"],
    CONSANGUINITY: ["No", "Yes"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login first.");
      setIsSubmitting(false);
      return;
    }

    try {
      const numericFields = [
        "AGE",
        "HEIGHT",
        "WEIGHT",
        "KNOWN_EPILEPTIC",
        "CONVULSION_SEIZURES",
        "BP",
        "BP1",
        "HEMOGLOBIN",
        "PULSE_RATE",
        "RESPIRATORY_RATE",
        "HEART_RATE",
        "FEVER",
        "UTERUS_SIZE",
        "BLOOD_SUGAR",
        "OGTT_2_HOURS",
        "IFA_QUANTITY",
        "FOLIC_ACID",
        "PHQ_SCORE",
        "GAD_SCORE",
        "NO_OF_WEEKS",
      ];
      const cleanedData = { ...formData };
      numericFields.forEach((key) => {
        cleanedData[key] = parseFloat(cleanedData[key]) || 0;
      });

      const res = await axios.post(
        "http://localhost:9000/save-and-predict",
        cleanedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(res.data);
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err.response?.data || { message: "An unexpected error occurred." }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- STYLES OBJECT ---
  const styles = {
    appContainer: {
      backgroundColor: theme.colors.appBg,
      minHeight: "100vh",
      padding: theme.spacing(2),
      fontFamily: theme.fonts.main,
      color: theme.colors.text,
    },
    container: {
      maxWidth: "1200px", // Adjusted for potentially wider section layout
      margin: `${theme.spacing(2)} auto`,
      padding: theme.spacing(3),
      backgroundColor: theme.colors.light, // Main form area background
      borderRadius: theme.borderRadius,
      boxShadow: theme.shadows.lg,
    },
    header: {
      color: theme.colors.primary,
      borderBottom: `2px solid ${theme.colors.primary}`,
      paddingBottom: theme.spacing(1.5),
      marginBottom: theme.spacing(3),
      fontSize: "28px",
      fontWeight: "600",
      textAlign: "center",
    },
    predictionCard: {
      backgroundColor: "#f0f8ff",
      border: "1px solid #d0e0ff",
      borderRadius: "10px",
      padding: "15px",
      marginTop: "20px",
      fontFamily: "'Segoe UI', sans-serif",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },

    // Grid for sections themselves
    sectionsGrid: {
      display: "grid",
      // Try to fit 2 sections side-by-side if wide enough, else 1
      gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      gap: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    section: {
      padding: theme.spacing(2.5),
      backgroundColor: theme.colors.sectionBg,
      borderRadius: theme.borderRadius,
      boxShadow: theme.shadows.md,
      // border: `1px solid ${theme.colors.border}`, // Optional border for sections
    },
    sectionTitle: {
      margin: `0 0 ${theme.spacing(2)} 0`,
      fontSize: "18px",
      color: theme.colors.primaryDark,
      fontWeight: "600",
      borderBottom: `1px solid ${theme.colors.border}`,
      paddingBottom: theme.spacing(1),
    },
    fieldGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", // Responsive fields
      gap: theme.spacing(2),
    },
    fieldContainer: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      display: "block",
      marginBottom: theme.spacing(0.75),
      fontSize: "13px",
      fontWeight: "500",
      color: theme.colors.textSecondary,
    },
    formControlBase: {
      // Base for input and select
      padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
      borderRadius: theme.borderRadius,
      border: `1px solid ${theme.colors.border}`,
      fontSize: "14px",
      width: "100%",
      height: theme.inputHeight,
      backgroundColor: theme.colors.inputBg,
      boxSizing: "border-box",
      transition:
        "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    },
    formInput: {}, // Inherits from formControlBase, specific overrides can go here
    formSelect: {
      // Inherits from formControlBase
      appearance: "none", // Basic reset for custom arrow
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: `right ${theme.spacing(1)} center`,
      backgroundSize: "16px 12px",
      paddingRight: theme.spacing(4), // Make space for arrow
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end", // Align button to the right
      marginTop: theme.spacing(3),
      paddingTop: theme.spacing(2),
      borderTop: `1px solid ${theme.colors.border}`,
    },
    submitButton: {
      padding: `${theme.spacing(1.25)} ${theme.spacing(3)}`,
      backgroundColor: theme.colors.primary,
      color: "white",
      border: "none",
      borderRadius: theme.borderRadius,
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: "500",
      transition: "background-color 0.15s ease-in-out, transform 0.1s ease",
    },
    // --- Response and Error Styling ---
    messageBase: {
      marginTop: theme.spacing(3),
      padding: theme.spacing(2),
      borderRadius: theme.borderRadius,
      fontSize: "14px",
      boxShadow: theme.shadows.sm,
      borderLeftWidth: "4px",
      borderLeftStyle: "solid",
    },
    responseContainer: {
      backgroundColor: "#e6f7ff", // Light blue for success container
      borderColor: theme.colors.primary,
    },
    errorContainer: {
      backgroundColor: "#fff2f0", // Light red for error container
      borderColor: theme.colors.danger,
    },
    messageHeader: {
      marginBottom: theme.spacing(1.5),
      fontSize: "18px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
    },
    successHeader: { color: theme.colors.primaryDark },
    errorHeader: { color: theme.colors.dangerDark },
    icon: { marginRight: theme.spacing(1), fontSize: "20px" },

    contentGrid: {
      // For Saved Record / Prediction Result / Webhooks etc.
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: theme.spacing(2.5),
      marginTop: theme.spacing(2),
    },
    contentCard: {
      backgroundColor: theme.colors.sectionBg, // White background for cards
      padding: theme.spacing(2),
      borderRadius: theme.borderRadius,
      boxShadow: theme.shadows.sm,
      border: `1px solid ${theme.colors.border}`,
    },
    contentTitle: {
      color: theme.colors.primary,
      marginBottom: theme.spacing(1),
      fontSize: "15px",
      fontWeight: "600",
    },
    preContent: {
      backgroundColor: theme.colors.light, // Light gray for pre blocks
      padding: theme.spacing(1.5),
      borderRadius: theme.borderRadius,
      overflowX: "auto",
      fontSize: "12px",
      fontFamily: theme.fonts.monospace,
      margin: `${theme.spacing(1)} 0 0 0`,
      border: `1px solid #e0e0e0`, // Slightly darker border for pre
      maxHeight: "300px", // Prevent overly long pre blocks
    },
    explanationContainer: {
      // uses contentCard styles
      marginTop: theme.spacing(2.5),
    },
    riskLevel: {
      fontWeight: "600",
      fontSize: "16px",
      color: theme.colors.dark,
      marginBottom: theme.spacing(1),
    },
    divider: {
      margin: `${theme.spacing(1.5)} 0`,
      border: "0",
      height: "1px",
      backgroundColor: theme.colors.border,
    },
    webhookStatus: {
      fontSize: "13px",
      marginTop: theme.spacing(0.5),
    },

    successText: { color: "black", fontWeight: "500" },
    errorText: { color: theme.colors.dangerDark, fontWeight: "500" },
  };

  // Apply base styles to specific elements
  styles.formInput = { ...styles.formControlBase, ...styles.formInput };
  styles.formSelect = { ...styles.formControlBase, ...styles.formSelect };
  styles.responseContainer = {
    ...styles.messageBase,
    ...styles.responseContainer,
  };
  styles.errorContainer = { ...styles.messageBase, ...styles.errorContainer };
  styles.explanationContainer = {
    ...styles.contentCard,
    ...styles.explanationContainer,
  };

  const renderField = (fieldKey) => {
    const fieldConfig = enumOptions[fieldKey];
    const fieldLabel = fieldKey.replace(/_/g, " ");

    if (fieldConfig) {
      return (
        <select
          name={fieldKey}
          value={formData[fieldKey]}
          onChange={handleChange}
          style={styles.formSelect}
          aria-label={fieldLabel}
        >
          <option value="">Select {fieldLabel}</option>
          {fieldConfig.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    } else {
      const isNumericField = [
        "AGE",
        "HEIGHT",
        "WEIGHT",
        "BP",
        "BP1",
        "HEMOGLOBIN",
        "PULSE_RATE",
        "RESPIRATORY_RATE",
        "HEART_RATE",
        "FEVER",
        "UTERUS_SIZE",
        "BLOOD_SUGAR",
        "OGTT_2_HOURS",
        "IFA_QUANTITY",
        "PHQ_SCORE",
        "GAD_SCORE",
        "NO_OF_WEEKS",
      ].includes(fieldKey);
      return (
        <input
          type={isNumericField ? "number" : "text"}
          name={fieldKey}
          value={formData[fieldKey]}
          onChange={handleChange}
          placeholder={`Enter ${fieldLabel}`}
          style={styles.formInput}
          aria-label={fieldLabel}
        />
      );
    }
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.container}>
        <h1 style={styles.header}>Antenatal Care (ANC) Form</h1>

        <form onSubmit={handleSubmit}>
          <div style={styles.sectionsGrid}>
            {Object.entries(sections).map(([sectionKey, section]) => (
              <div key={sectionKey} style={styles.section}>
                <h3 style={styles.sectionTitle}>{section.title}</h3>
                <div style={styles.fieldGrid}>
                  {section.fields.map((field) => (
                    <div key={field} style={styles.fieldContainer}>
                      <label htmlFor={field} style={styles.label}>
                        {field.replace(/_/g, " ")}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(isSubmitting && {
                  backgroundColor: theme.colors.disabledBg,
                  color: theme.colors.disabledText,
                  cursor: "not-allowed",
                }),
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Submit & Predict"}
            </button>
          </div>
        </form>

        {response && (
          <div style={styles.responseContainer}>
            <h3 style={{ ...styles.messageHeader, ...styles.successHeader }}>
              <span style={styles.icon}>✅</span> Record Saved & Prediction
              Received
            </h3>

            <div style={styles.contentGrid}>
              <div style={styles.contentCard}>
                <h4 style={styles.contentTitle}>Prediction Result</h4>
                <div style={styles.predictionCard}>
                  <h3>🧪 Prediction Result</h3>
                  <p>
                    <strong>Risk Level:</strong>{" "}
                    {response.prediction.risk_level}
                  </p>
                  <p>
                    <strong>Confidence:</strong>{" "}
                    {(response.prediction.confidence * 100).toFixed(2)}%
                  </p>

                  <h4>📊 Probabilities:</h4>
                  <ul>
                    {Object.entries(response.prediction.probabilities).map(
                      ([level, prob]) => (
                        <li key={level}>
                          <strong>{level}:</strong> {(prob * 100).toFixed(2)}%
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {response.explanation && (
              <div style={styles.explanationContainer}>
                <h4 style={styles.contentTitle}>Risk Assessment Explanation</h4>
                <div style={styles.riskLevel}>
                  {response.explanation.split("---")[0]}
                </div>
                <hr style={styles.divider} />
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  {response.explanation.split("---")[1]}
                </div>
              </div>
            )}

            {response.webhookResponses &&
              response.webhookResponses.length > 0 && (
                <div style={{ marginTop: theme.spacing(2.5) }}>
                  <h4
                    style={{
                      ...styles.contentTitle,
                      marginBottom: theme.spacing(1.5),
                    }}
                  >
                    Nutrients Chart
                  </h4>
                  <div style={styles.explanationContainer}>
                    {response.webhookResponses
                      .filter((webhook) => webhook.ok) // Only render successful ones
                      .map((webhook, index) => (
                        <div key={index} style={styles.contentCard}>
                          <div
                            style={{
                              fontSize: "14px",
                              lineHeight: "1.6",
                              ...styles.webhookStatus,
                              ...styles.successText,
                            }}
                          >
                            {webhook.body &&
                              typeof webhook.body === "string" &&
                              (() => {
                                try {
                                  const parsed = JSON.parse(webhook.body);
                                  const outputMarkdown =
                                    parsed.output ||
                                    JSON.stringify(parsed, null, 2);
                                  return (
                                    <div style={styles.preContent}>
                                      <ReactMarkdown
                                        children={outputMarkdown}
                                      />
                                    </div>
                                  );
                                } catch (err) {
                                  return (
                                    <pre style={styles.preContent}>
                                      {webhook.body}
                                    </pre>
                                  );
                                }
                              })()}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {error && (
          <div style={styles.errorContainer}>
            <h3 style={{ ...styles.messageHeader, ...styles.errorHeader }}>
              <span style={styles.icon}>❌</span> Submission Error
            </h3>
            <pre style={styles.preContent}>
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AncFullForm;
