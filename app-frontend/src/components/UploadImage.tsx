import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { FC } from 'react'; 
import { Grid } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface UploadImageProps {
  imageUrl: string; 
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  handleDeleteImage: () => void; 
}

export const UploadImage: FC<UploadImageProps> = ({ imageUrl, handleFileChange, handleDeleteImage }) => {
  return (
    <Grid>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload picture
        <VisuallyHiddenInput
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
        />
      </Button>
      {imageUrl && (
        <div>
          <img src={imageUrl} style={{ height: '100px' }} alt="Uploaded file" />
          <IconButton
            color="primary"
            onClick={handleDeleteImage}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </Grid>
  );
}
