import React, {useState} from 'react'
import './claims.css';
export default function ClaimForm() {
    const [formData, setFormData] = useState({
        claimType: "",
        policyNumber: "",
        claimAmount: "",
        incidentDate: "",
        description: "",
        email: "",
        phone: "",
        file: null,
      });
    
      const [errors, setErrors] = useState({});
      const [successMessage, setSuccessMessage] = useState("");
    
      // Validation
      const validate = () => {
        let tempErrors = {};
        if (!formData.claimType) tempErrors.claimType = "Claim type is required.";
        if (!formData.policyNumber || !/^[a-zA-Z0-9]{8,12}$/.test(formData.policyNumber))
          tempErrors.policyNumber = "Policy number must be 8-12 alphanumeric characters.";
        if (!formData.claimAmount || formData.claimAmount <= 0)
          tempErrors.claimAmount = "Claim amount must be greater than zero.";
        if (!formData.incidentDate || new Date(formData.incidentDate) > new Date())
          tempErrors.incidentDate = "Incident date cannot be in the future.";
        if (!formData.description || formData.description.length < 20 || formData.description.length > 500)
          tempErrors.description = "Description must be 20-500 characters.";
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
          tempErrors.email = "Invalid email format.";
        if (formData.phone && !/^\d{10,15}$/.test(formData.phone))
          tempErrors.phone = "Phone number must be 10-15 digits.";
        if (!formData.file)
          tempErrors.file = "File upload is required.";
        else if (!["image/jpeg", "image/png", "application/pdf"].includes(formData.file.type))
          tempErrors.file = "Supported formats: .jpg, .png, .pdf.";
        else if (formData.file.size > 5 * 1024 * 1024)
          tempErrors.file = "File size must not exceed 5MB.";
    
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
      };
    
      // Handle Input Changes
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
      };
    
      // Submit Form
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
    
        const form = new FormData();
        Object.keys(formData).forEach((key) => {
          form.append(key, formData[key]);
        });
    
        try {
          const response = await fetch("http://localhost:5000/api/claims", {
            method: "POST",
            body: form,
          });
          const data = await response.json();
          if (data.success) {
            setSuccessMessage("Your claim ticket has been submitted successfully!");
            setFormData({
              claimType: "",
              policyNumber: "",
              claimAmount: "",
              incidentDate: "",
              description: "",
              email: "",
              phone: "",
              file: null,
            });
          } else {
            alert("Submission failed. Please try again.");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      const handleReset = ()=>{
        setFormData({
            claimType: "",
        policyNumber: "",
        claimAmount: "",
        incidentDate: "",
        description: "",
        email: "",
        phone: "",
        file: null,
        })
      }
    
      return (
        <form className="claim-form" onSubmit={handleSubmit}>
          <h2>Claims Ticket Creation Form</h2>
          {successMessage && <p className="success">{successMessage}</p>}
          <div className="form-group">
            <label>Claim Type</label>
            <select name="claimType" value={formData.claimType} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Health Insurance">Health Insurance</option>
              <option value="Vehicle Insurance">Vehicle Insurance</option>
              <option value="Property Insurance">Property Insurance</option>
              <option value="Other">Other</option>
            </select>
            {errors.claimType && <span className="error">{errors.claimType}</span>}
          </div>
          <div className="form-group">
            <label>Policy Number</label>
            <input
              type="text"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              placeholder="Enter policy number"
            />
            {errors.policyNumber && <span className="error">{errors.policyNumber}</span>}
          </div>
          <div className="form-group">
            <label>Claim Amount</label>
            <input
              type="number"
              name="claimAmount"
              value={formData.claimAmount}
              onChange={handleChange}
              placeholder="Enter claim amount"
            />
            {errors.claimAmount && <span className="error">{errors.claimAmount}</span>}
          </div>
          <div className="form-group">
            <label>Incident Date</label>
            <input
              type="date"
              name="incidentDate"
              value={formData.incidentDate}
              onChange={handleChange}
            />
            {errors.incidentDate && <span className="error">{errors.incidentDate}</span>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed explanation of the claim"
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Phone (Optional)</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label>File Upload</label>
            <input type="file" name="file" onChange={handleFileChange} />
            {errors.file && <span className="error">{errors.file}</span>}
          </div>
          <button type="submit" disabled={Object.keys(errors).length > 0}>
            Submit
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </form>
      );
}
