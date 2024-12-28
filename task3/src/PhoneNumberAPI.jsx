import React, { useState } from "react";
import * as Yup from "yup"; 
const PhoneNumberAPI = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [headers, setHeaders] = useState(null);
  const [error, setError] = useState("");

  const phoneNumberSchema = Yup.string()
    .matches(/^\d+$/, "Phone number must contain only digits")
    .test(
      "is-10-digits",
      "Phone number must be exactly 10 digits",
      (value) => value && value.length === 10
    )
    .required("Phone number is required");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await phoneNumberSchema.validate(phoneNumber);

      const response = await fetch("https://chimpu.online/api/post.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phonenumber: phoneNumber }),
      });
      console.log(response);
      const responseHeaders = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setHeaders(responseHeaders);
      setError("");
    } catch (validationErr) {
      setError(validationErr.message);
      setHeaders(null);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Post Phone Number API</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phoneNumber">Enter Phone Number:</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          style={{
            margin: "0 10px",
            padding: "5px",
            border: error ? "1px solid red" : "1px solid #ccc",
          }}
        />
        <button type="submit" style={{ padding: "5px 10px" }}>
          Submit
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}

      {headers && (
        <div>
          <h2>Response Headers:</h2>
          <pre style={{ backgroundColor: "grey", padding: "10px" }}>
            {JSON.stringify(headers, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PhoneNumberAPI;
