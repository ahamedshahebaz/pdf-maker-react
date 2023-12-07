import React, { useState, useRef } from "react";
import ParticlesBg from "particles-bg";
import Fade from "react-reveal";
import Modal from "./Modal";

const Header = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [hash, setHash] = useState("");
  const [converting, setConverting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [success, setSucess] = useState(false);
  const [text, setText] = useState("");
  const fileInputRef = useRef();
  const [error, setError] = useState(false);

  const handleFileClick = () => {
    // Trigger a click on the hidden file input
    fileInputRef.current.click();
  };
  const handleUpload = async (file) => {
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
      const response = await fetch(process.env.endpoint + "/convert" || 'http://localhost:3000/convert', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully!', response.headers.get("content-disposition"));
        const file = await response.blob();
        if (file) {
          setHash(response.headers.get("content-disposition"))
          const url = window.URL.createObjectURL(new Blob([file]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'downloaded_file.pdf');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setSelectedFile(null);
        setText("");
        setFileName("");
        setConverting(false);
        setSucess(true)
      } else {
        console.error('File upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  const openModal = () => {
    setError(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setError(false);
    setIsModalOpen(false);
  };
  const handleFileChange = (event) => {
    // Handle the selected file and update the state
    // setConverting(true);
    const file = event.target.files[0];
    if (file) {
      // Check if the file type is a Word document
      if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // File is a Word document
        setSelectedFile(file);
        setFileName(file.name);
        // handleUpload(file);
      } else {
        // File is not a Word document, generate alert
        alert('Please select a Word document (.doc or .docx).');
        // Optionally, clear the file input
        setConverting(false);

      }
    }

    fileInputRef.current.value = '';
  };

  if (!props.data) return null;

  const { name, description } = props.data;
  const handleChange = (e) => {
    setText(e.target.value);
  };
  function copyToClipboard() {
    // Get the text to copy
    const textToCopy = hash;

    // Create a textarea element to hold the text
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);

    // Select the text in the textarea
    textarea.select();

    // Copy the selected text to the clipboard
    document.execCommand('copy');

    // Remove the textarea from the DOM
    document.body.removeChild(textarea);

    alert('Text has been copied to the clipboard: ' + textToCopy);
  }
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          <label htmlFor="contactName">
            Text <span className="required">*</span>
          </label>
          <input
            type="text"
            defaultValue=""
            value={text}
            placeholder="Enter text for watermark.."
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
          <p onClick={() => handleUpload(selectedFile)} className="button">
            <i className="fa fa-download"></i>MarkMyPDF
          </p>
          {error && <p style={{ color: 'red' }}>Please fill all fields</p>}
        </div>
      </Modal>
      <header id="home">
        <ParticlesBg type="circle" bg={true} />

        <div className="row banner">
          <div className="banner-text">
            <Fade bottom>
              <h1 className="responsive-headline">{name}</h1>
            </Fade>
            <Fade bottom duration={1200}>
              <h3>{description}.</h3>
            </Fade>

            <hr />

            <Fade bottom duration={2000}>
              <ul className="social">
                {converting ? <p className="button btn project-btn">
                  <i className="fa fa-book"></i>Converting...</p> :
                  <p className="button btn project-btn" onClick={openModal}>
                    <i className="fa fa-book"></i>Upload File
                  </p>}

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onInput={handleFileChange}
                />
                {/* Additional buttons or links can be added here */}
                {success ?
                  <h3 style={{ color: "white" }}>{hash} <i onClick={() => copyToClipboard()} className="fa fa-copy"></i></h3> : ""}
              </ul>
            </Fade>
          </div>
        </div>

        <p className="scrolldown">
          <a className="smoothscroll" href="#about">
            <i className="icon-down-circle"></i>
          </a>
        </p>
      </header></>
  );
};

export default Header;
