import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function createData(type, host, payload) {
  return {
      type: type,
      host: host,
      payload: payload
  }
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.type}
        </TableCell>
        <TableCell align="right">{row.host}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography sx={{ fontWeight: 'bold', m: 1 }} variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                  {Object.keys(row.payload[0]).map((field) => (
                      <TableCell><Typography sx={{ fontWeight: 'bold', m: 1 }}> {field} </Typography></TableCell>
                  ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.payload.map((row, index) => (
                    <TableRow key={ index }>
                      {Object.values(row).map((value) => (
                        <TableCell>{ value }</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function FancyTable(props) {
    const [rows, setRows] = useState([]);
    useEffect(() => {
        setRows([]);
        var tmp = [];
        for (const [key, value] of Object.entries(props.results)) {
            tmp.push(createData(key, value["host"], value["payload"]));
        }
        setRows(tmp);
    }, [props, setRows])

  return (
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
    <TableContainer component={Paper} style={{maxHeight: '60vh', maxWidth:'75vw', overflow: 'auto', }}>
      <Table aria-label="collapsible table">
        <TableHead >
          <TableRow >
            <TableCell />
            <TableCell> <Typography sx={{ fontWeight: 'bold', m: 1 }}> Type </Typography> </TableCell>
            <TableCell align="right"><Typography sx={{ fontWeight: 'bold', m: 1 }}> Target </Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key = {row.type + row.host} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
