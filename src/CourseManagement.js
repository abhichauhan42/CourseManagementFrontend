import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Container,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import axios from 'axios';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [courseInstances, setCourseInstances] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleAddCourse = async () => {
    if (!courseTitle || !courseCode || !courseDescription) {
      alert("All fields are required to add a course");
      return;
    }

    const newCourse = {
      title: courseTitle,
      code: courseCode,
      description: courseDescription,
    };
    try {
      await axios.post('http://localhost:8080/api/courses', newCourse);
      fetchCourses();
      // Clear form fields after adding the course
      setCourseTitle('');
      setCourseCode('');
      setCourseDescription('');
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleAddInstance = async () => {
    if (!year || !semester || !selectedCourse) {
      alert("Year, Semester, and Course selection are required to add an instance");
      return;
    }

    const newInstance = {
      year,
      semester,
      course: JSON.parse(selectedCourse),
    };
    try {
      await axios.post('http://localhost:8080/api/instances', newInstance);
      fetchInstances(year, semester);
      // Clear form fields after adding the instance
      setYear('');
      setSemester('');
      setSelectedCourse('');
    } catch (error) {
      console.error('Error adding instance:', error);
    }
  };

  const fetchInstances = async (year, semester) => {
    if (!year || !semester) {
      alert("Year and Semester are required to list instances");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/instances/${year}/${semester}`);
      setCourseInstances(response.data);
    } catch (error) {
      console.error('Error fetching instances:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/courses/${id}`);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleDeleteInstance = async (year, semester, instanceId) => {
    try {
      await axios.delete(`http://localhost:8080/api/instances/${year}/${semester}/${instanceId}`);
      fetchInstances(year, semester);
    } catch (error) {
      console.error('Error deleting instance:', error);
    }
  };

  return (
    <Container>
      <h2>Course Management</h2>
      {/* Add Course Form */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          label="Course title"
          variant="outlined"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="Course code"
          variant="outlined"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          fullWidth
        />
        <TextField
          label="Course description"
          variant="outlined"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleAddCourse}>
          Add course
        </Button>
      </div>

      {/* Add Course Instance */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <FormControl fullWidth>
          <InputLabel>Select course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={JSON.stringify(course)}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Year"
          variant="outlined"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          fullWidth
        />
        <TextField
          label="Semester"
          variant="outlined"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleAddInstance}>
          Add instance
        </Button>
      </div>

      {/* List Courses */}
      <Button variant="contained" color="primary" onClick={fetchCourses} style={{ marginBottom: '10px' }}>
        List courses
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course Title</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.title}</TableCell>
              <TableCell>{course.code}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDeleteCourse(course.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <hr />

      {/* List Course Instances */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <TextField
          label="Year"
          variant="outlined"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Select semester</InputLabel>
          <Select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="1">Semester 1</MenuItem>
            <MenuItem value="2">Semester 2</MenuItem>
            <MenuItem value="3">Semester 3</MenuItem>
            <MenuItem value="4">Semester 4</MenuItem>
            <MenuItem value="5">Semester 5</MenuItem>
            <MenuItem value="6">Semester 6</MenuItem>
            <MenuItem value="7">Semester 7</MenuItem>
            <MenuItem value="8">Semester 8</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={() => fetchInstances(year, semester)}>
          List instances
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course Title</TableCell>
            <TableCell>Year-Sem</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courseInstances.map((instance) => (
            <TableRow key={`${instance.id}-${instance.year}-${instance.semester}`}>
              <TableCell>{instance.course.title}</TableCell>
              <TableCell>{`${instance.year}-${instance.semester}`}</TableCell>
              <TableCell>{instance.course.code}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDeleteInstance(instance.year, instance.semester, instance.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default CourseManagement;
