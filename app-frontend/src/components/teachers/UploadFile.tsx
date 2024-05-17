import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { FC, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

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

interface UploadImageProps {
  files: { name: string; url: string }[];
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteFile: (index: number) => void;
}

const UploadFile: FC<UploadImageProps> = ({
  files,
  handleFileChange,
  handleDeleteFile,
}) => {
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload Files
          <VisuallyHiddenInput
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </Button>
      </Grid>
      {files.map((file, index) => (
        <Grid item key={index} container alignItems="center" spacing={1}>
          <Grid item>
            <Typography variant="body2">{file.name}</Typography>
          </Grid>
          <Grid item>
            <IconButton
              color="primary"
              component="a"
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <OpenInNewIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color="primary"
              component="a"
              href={file.url}
              download={file.name}
            >
              <DownloadIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton color="primary" onClick={() => handleDeleteFile(index)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export const UploadFileComponent = () => {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <UploadFile
        files={files}
        handleFileChange={handleFileChange}
        handleDeleteFile={handleDeleteFile}
      />
    </Container>
  );
};
