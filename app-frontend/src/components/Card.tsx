import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const MyCard = () => {
  return (
    <a
      href="https://reactnative.dev/docs/text"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image="https://wallup.net/wp-content/uploads/2019/09/432739-lake-pond-golden-trees-tropical-forest-stream-leaves-hdr-ultrahd-black-white-hd-4k-wallpaper-3840x2160.jpg"
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </a>
  );
}
