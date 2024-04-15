import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../constants';
import { Course } from '../models/Course';
import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth-utils';
import axios from 'axios';
import { displayErrorMessage } from './ToastMessage';
import { CircularProgress, Container } from '@mui/material';

export const CourseCards = () => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        setLoading(true);
        const headers = {headers: {Authorization: `Bearer ${getToken()}`}};
        axios.get(`${BACKEND_URL}/courses/courses-of-teacher`, headers)
        .then((response) =>{
            setCourses(response.data);
            setLoading(false);
        })
        .catch((error: any) => {
            if (error.response) {
                const errorMessage = error.response.data;
                displayErrorMessage(errorMessage);
              } else {
                setLoading(false);
                displayErrorMessage("An error occurred while fetching the courses.");
              }
        });
    }, []);

    return (
        <Container>
            {loading && <CircularProgress />}
            {!loading && courses.length === 0 && (
                <p >No courses to display.</p>
            )}
            {!loading && courses.length > 0 && (
                <Grid container spacing={3}>
                {courses.map((course, index) => (
                    <Grid item xs={12} sm={6} md={3} key={course.id}>
                        <Link 
                            to={`/course/${index}/details`} 
                            state={course.id}
                            title="View course details"
                        > {/* send the course id to the page but dont show its id */}
                            <Card>
                                <CardMedia
                                    sx={{ height: 100 }} 
                                    image="https://wallup.net/wp-content/uploads/2019/09/432739-lake-pond-golden-trees-tropical-forest-stream-leaves-hdr-ultrahd-black-white-hd-4k-wallpaper-3840x2160.jpg"
                                />
                                <CardContent>
                                    <Typography variant="subtitle1" component="h2">
                                        {course.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
            )}
        </Container>
    );
}
