import React from "react";
import StyledDropzone from "./StyledDropzone";

const style = {
  upload_container: {
    width: "500px",
    margin: "100px auto",
  },
};
const FileUpload = () => {
  return (
    <div className="upload_container" style={style.upload_container}>
      <StyledDropzone />
    </div>
  );
};

export default FileUpload;
