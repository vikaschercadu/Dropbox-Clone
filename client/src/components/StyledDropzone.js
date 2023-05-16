import React, { useRef, useState } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";
import Chip from "@material-ui/core/Chip";
const dropzoneStyle = {
  width: "100%",
  height: "150px",
  borderWidth: 2,
  borderColor: "rgb(102, 102, 102)",
  borderStyle: "dashed",
  borderRadius: 5,
};

function StyledDropzone(props) {
  const { enqueueSnackbar } = useSnackbar();

  const [file, setFile] = useState(null);
  const dropzoneRef = useRef();
  const handleDrop = (acceptedFiles) => {
    // do nothing if no files
    if (acceptedFiles.length === 0) {
      return;
    }
    setFile(acceptedFiles[0]);
  };
  // on drop we add to the existing files
  const onFormSubmit = (e) => {
    e.preventDefault();
    if (file === null) {
      return;
    }
    const formData = new FormData();
    formData.append("myfile", file);
    const config = {
      headers: {
        "x-auth-token": localStorage.getItem("auth-token"),
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post("api/upload", formData, config)
      .then((response) => {
        if (response.status === 200) {
          enqueueSnackbar("Upload Successful", {
            variant: "success",
          });
          setFile(null);
        }
      })
      .catch((error) => {
        enqueueSnackbar("Upload Failed", {
          variant: "error",
        });
      });
  };
  return (
    <div>
      <form onSubmit={onFormSubmit}>
        <Dropzone ref={dropzoneRef} onDrop={handleDrop}>
          {({ getRootProps, getInputProps, acceptedFiles }) => {
            return (
              <div className="container" style={{ display: "flex" }}>
                <div
                  style={dropzoneStyle}
                  {...getRootProps({ className: "dropzone" })}
                >
                  <input {...getInputProps()} />
                  <p style={{ textAlign: "center" }}>
                    Drag 'n' drop some files here
                  </p>
                </div>
              </div>
            );
          }}
        </Dropzone>
        <div className="upload_button_container" style={{ width: "100%" }}>
          <Button
            variant="contained"
            color="default"
            startIcon={<CloudUploadIcon />}
            type="submit"
            style={{ margin: "20px auto", display: "flex" }}
          >
            Upload
          </Button>
        </div>
      </form>
      {console.log(file)}
      {file && (
        <div className="files_pending">
          <Chip label={file && file.name} color="primary" />
        </div>
      )}
    </div>
  );
}
export default StyledDropzone;
