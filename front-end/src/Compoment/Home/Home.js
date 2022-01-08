import React,{useEffect,useState} from 'react'
import {APIEndpoint} from './api'
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
import {getFormattedDateTime} from '../../Element/function'
import Countdown from 'react-countdown';
import { makeStyles } from "@mui/styles" ;
import {  HubConnectionBuilder,LogLevel } from "@microsoft/signalr"; 
import Checkbox from '@mui/material/Checkbox';
import { pink } from '@mui/material/colors';

const useStyles = makeStyles({
    notification:{
        position:"absolute",
        right:"10px",
        top:"5px",
        borderRadius:"5px",
        height:"100vh",
        width:"250px",
        boxShadow:"0px 1px 10px #868677",
        display:"flex",
        justifyContent:"center"
    }
  });

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
function Row(props) {
    const { row } = props;
    const [lstDetail,setLstDetail] = useState(row.lstDetail);
    const [open, setOpen] = React.useState(false);
    const styleIsImport = {
        backgroundColor:"#ecb3be"
    }
    const styleIsNotImport = {
        backgroundColor:"#fff"
    }

    const CoverSeconds = (date,NameJob) => {
        date = new Date(date)
        const dateBegin = new Date();
        if(date.getTime() - dateBegin.getTime()){
            return (date.getTime() - dateBegin.getTime())
        }
        // return date.getTime()  / 1000   
    }

    //send notification
    const [connection, setConnection] = useState(null);
    
    const SendNotificaion = async (tenduan) => {
        const connect = new HubConnectionBuilder()
          .withUrl("https://localhost:5001/notification")
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();

          await connect.start();
          await connect.invoke("SendMessage",tenduan)
    }

    const handldeCheck = (event,item) =>{
        let lst = [...lstDetail]
        let itemUpdate = lst.indexOf(item);
        lst[itemUpdate].Status = event.target.checked;
        setLstDetail(pre => {
            return [...lst]
        })
        let CheckStatusJob = {
           nameTodo : item.NameTodo,
           nameJob : item.NameJob,
           status : item.Status
        }
        APIEndpoint().CheckFinish(CheckStatusJob)
        .then(res => {
            if(res.status === 200){
              SendNotificaion(res.data.message)
            }
        })
        .catch(err => {
          console.log('err',err);
        })
    }

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
            {row.tenDuAn}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Danh sách chi tiết
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Hoàn Thành</TableCell>
                      <TableCell>Tên Công Việc</TableCell>
                      <TableCell>File Đính kèm</TableCell>
                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lstDetail.map((detail) => (
                      <TableRow key={detail.NameJob} style={ detail.IsImportan === 1 ? styleIsImport : styleIsNotImport}>
                        <TableCell component="th" scope="row">
                            <Checkbox
                                {...label}
                                checked={detail.Status}
                                sx={{
                                    color: pink[800],
                                    '&.Mui-checked': {
                                    color: pink[600],
                                    },
                                }}
                                onChange={(event) => handldeCheck(event,detail)}
                                />
                        </TableCell>
                        <TableCell >
                          {detail.NameJob}
                        </TableCell>
                        <TableCell>
                                {
                                    detail.file.length > 0 ? detail.file.map((file) => <a key={file.fileName} href={file.formFiles} download={file.fileName}>{file.fileName}</a>)  : ""
                                }
                        </TableCell>
                        
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
  
  





export default function Home() {
    const [lstTodo,setListTodo] = useState([])
   
    useEffect(() => {
        APIEndpoint().GetMissionInDay()
        .then(res => {
            setListTodo(res.data.data)
        })
        .catch(err => {
            console.log('err',err);
        })
    }, [])
    return (
        <div style={{paddingTop: "50px",position:"relative"}}>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                    <TableCell />
                    <TableCell>Danh sách dự án</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lstTodo.map((row) => (
                        <Row key={row.tenDuAn} row={row} />
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </div>
        
    )
}
