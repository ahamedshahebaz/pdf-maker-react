import React, { useState, useRef } from "react";
import Fade from "react-reveal";
import Modal from './Modal';

const About = (props) => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("")
  const [text, setText] = useState("");
  const fileInputRef = useRef();
  const [error, setError] = useState(false);
  const [success, setSucess] = useState("")
  const handleFileClick = () => {
    // Trigger a click on the hidden file input
    fileInputRef.current.click();
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setError(false);
    setIsModalOpen(false);
  };
  const handleChange = (e) => {
    setError(false);
    setText(e.target.value);
  };
  const handleFileChange = (event) => {
    // Handle the selected file and update the state
    // setConverting(true);
    const file = event.target.files[0];
    if (file) {
      // Check if the file type is a Word document
      if (file.type === 'application/pdf') {
        // File is a Word document
        setSelectedFile(file);
        setFileName(file.name);
        // handleUpload(file);
      } else {
        // File is not a Word document, generate alert
        alert('Please select a PDF (.pdf).');
        // Optionally, clear the file input

      }
    }

    fileInputRef.current.value = '';
  };
  const handleVerify = async (file) => {
    if (file == null || text == "") {
      setError(true);
      return;
    }
    setError(false);
    closeModal();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', text);

    try {
      const response = await fetch('http://localhost:3000/verify', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSucess(data.isValid);
        setSelectedFile(null);
        setText("");
        setFileName("");
      } else {
        console.error('File upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  return (
    <section id="about">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onInput={handleFileChange}
      />
      <Fade duration={1000}>
        <div className="row">
          {/* <div className="three columns">
            <img
              className="profile-pic"
              src={`images/${image}`}
              alt="Nordic Giant Profile Pic"
            />
          </div> */}
          <div className="nine columns main-col">
            <h2>Verify PDF</h2>
            <p>{success}</p>
            <div className="row">
              <div className="columns download">
                <p onClick={openModal} className="button">
                  <i className="fa fa-download"></i>Upload PDF
                </p>
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                  <div>
                    <label htmlFor="contactName">
                      Hash <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue=""
                      value={text}
                      placeholder="Enter hash for verification.."
                      size="35"
                      id="contactName"
                      name="contactName"
                      required
                      onChange={handleChange}
                    />
                    <p onClick={() => handleFileClick()} className="button">
                      <i className="fa fa-download"></i>Upload PDF
                    </p>
                    {fileName != "" ? <p>{fileName}</p> : <div />}
                    <p onClick={() => handleVerify(selectedFile)} className="button">
                      <i className="fa fa-download"></i>Verify
                    </p>
                    {error && <p style={{ color: 'red' }}>Please fill all fields</p>}
                  </div>
                </Modal>

              </div>
            </div>
          </div>
        </div>
      </Fade>
    </section>
  );
};

export default About;
