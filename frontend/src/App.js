import { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import './App.css';

function App() {
  const [month, setMonth] = useState('');
  const [record, setRecord] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const handleChange = (event) => {
    setMonth(event.target.value);
    fetchMonthlyData();
    console.log("monthly:", monthlyData);
  };

  const months = [
    { value: '01', label: 'Jan' },
    { value: '02', label: 'Feb' },
    { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' },
    { value: '05', label: 'May' },
    { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' },
    { value: '08', label: 'Aug' },
    { value: '09', label: 'Sept' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' }
  ];

  useEffect(() => {

  }, []);

  const handleClick = () => {
    fetchData().then((data) => {
      setRecord(data);
    });
    console.log("data new", record);
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3010/api/data`);
      //const jsonData = await response.json();
      //console.log("Response is:", jsonData);
      console.log("Data is :", response.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const response = await axios.get(`http://localhost:3010/datastats/${month}`);
      setMonthlyData(response.data);
      console.log("Monthly:", monthlyData);
      return
    } catch (error) {
      console.log(error);
    }
  }

  return (

    <>
      <Box sx={{
        width: "70%",
        height: 800,
        backgroundColor: '#e8f4f8',
        ml: "15%",
        mt: "2%"
      }}>
        <div className='circle'>
          <h4 className='text'>Transaction Dashboard</h4>
        </div>
        <Button variant='contained' sx={{ textTransform: 'none', borderRadius: '12px', backgroundColor: '#fbc882', color: 'black', ml: '2%' }}
          onClick={handleClick}>
          <Typography>Search Transaction</Typography>
        </Button>

        <FormControl sx={{ width: '30%', height: '40px', mt: '2%', ml: '60%', backgroundColor: "#f8ac45" }} >
          <InputLabel>Select Month</InputLabel>
          <Select
            defaultValue='Mar'
            sx={{ height: '40px' }}
            value={month}
            label="Select Month"
            onChange={handleChange}
          >
            {months.map((m, index) => (
              <MenuItem key={index} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br /><br />
        <TableContainer component={Paper}>
          <Table sx={{ backgroundColor: "#fbc882", borderRadius: "15px" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Sold</TableCell>
                <TableCell>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {record.map((row) => ( 
           <TableRow key={record._id}>
              <TableCell>{record.id}</TableCell>
              <TableCell>{record.title}</TableCell>
              <TableCell>{record.description}</TableCell>
              <TableCell>{record.price}</TableCell>
              <TableCell>{record.category}</TableCell>
               <TableCell>{record.sold}</TableCell>
              <TableCell>{record.image}</TableCell>
            </TableRow>
         ))} */}
              {/* <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Hello</TableCell>
              <TableCell>its beautiful</TableCell>
              <TableCell>23</TableCell>
              <TableCell>jewellery</TableCell>
               <TableCell>ues</TableCell>
              <TableCell>sdjfjds</TableCell>
            </TableRow> */}
              {/* ))} */}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <Typography sx={{ ml: "35%" }}>Statistics - {month} </Typography>
        <Box sx={{
          width: "30%",
          height: 100,
          backgroundColor: '#fbc882',
          ml: "35%",
          mt: "5%",
          borderRadius: '5%',
          display: 'flex',
          flexDirection: 'column',
          padding: 3,
          borderSpacing: 2
        }}>
          <InputLabel> Total Sale: {monthlyData.total}</InputLabel>
          <InputLabel> Total sold items:  {monthlyData.totItemsold}</InputLabel>
          <InputLabel> Total Not sold items:  {monthlyData.totItemNotsold}</InputLabel>
        </Box>
      </Box>

    </>

  );
}

export default App;
