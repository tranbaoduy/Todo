import React,{useEffect,useState} from 'react'
import {APIEndpoint} from './api'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {getFormattedDateTime} from '../../Element/function'
import Countdown from 'react-countdown';
import { makeStyles } from "@mui/styles" ;
import {  HubConnectionBuilder,LogLevel } from "@microsoft/signalr"; 
import Checkbox from '@mui/material/Checkbox';


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
  
const StyleImportant = {
   backgroundColor: "beige"
}

const StyleNone = {
  backgroundColor: "#ffffff"
}



export default function Home() {
    const [lstTodo,setListTodo] = useState([])


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
   
    useEffect(() => {
        APIEndpoint().GetMissionInDay()
        .then(res => {
          if(res.status === 200){
            setListTodo(res.data.data)
          }
        })
        .catch(err => {
            console.log('err',err);
        })
    }, [])

    const renderer = ({ hours, minutes, seconds, completed ,row}) => {
      let hh = hours.toString().padStart(2, '0');
      let mm = minutes.toString().padStart(2, '0');
      let sec = seconds.toString().padStart(2, '0');
      if (completed) {
        // Render a completed state
        return <p>Bắt đầu</p>;
      } 
      else if(hours === 0 && minutes === 5 && seconds == 0){
        SendNotificaion ("Công việc " + row.Duan.NameTodo + " sẽ bắt đầu sau 5 phút nữa !!!");
        return <span>{hh}:{mm}:{sec}</span>;
      }
      else {
        // Render a countdown
        return <span>{hh}:{mm}:{sec}</span>;
      }
    };

    const converTime = (time) => {
        let begin  = new Date(time).getTime();
        let Now = new Date().getTime();
        return (begin - Now)
    }

    
    const handldeCheck = (event,item) =>{
        console.log(item)
        let index = lstTodo.indexOf(item);
        lstTodo[index].Duan.Status = event.target.checked;
        setListTodo([...lstTodo]);
        let obj = [
          {
              "op": "replace",
              "path":"/Status",
              "value": item.Duan.Status
          }
        ]
        APIEndpoint().Patch(item.Duan.Id,obj)
        .then(res => {
          console.log('res',res);
        })
        .catch(err => {
          console.log('err',err);
        })

    }

    

    return (
        <div style={{paddingTop: "50px",position:"relative"}}>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>Hoàn thành</TableCell>
                        <TableCell align='center'>Tên công việc</TableCell>
                        <TableCell align='center'>Thời gian bắt đầu</TableCell>
                        <TableCell align='center'>File đính kèm</TableCell>
                        <TableCell align='center'>Thời gian đếm ngược</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lstTodo.map((row) => (
                        <TableRow key={row.Duan.GuiId} style={row.Duan.Important === true ? StyleImportant : StyleNone}>
                          <TableCell align='center' >
                              <Checkbox
                              {...label}
                              checked={row.Duan.Status}
                              onChange={(event) => handldeCheck(event,row)}
                          />
                          </TableCell>
                          <TableCell align='center' >{row.Duan.NameTodo}</TableCell>  
                          <TableCell align='center' >{getFormattedDateTime(row.Duan.DateCreate)}</TableCell>
                          <TableCell align='center'>
                            {
                              row.lstFile.length > 0 ? row.lstFile.map((file) => <a key={file.fileName} href={file.formFiles} download={file.fileName}>{file.fileName}</a>)  : ""
                            }  
                          </TableCell> 
                          <TableCell align='center'>
                            <Countdown date={Date.now() + converTime(row.Duan.DateCreate)} renderer={({ hours, minutes, seconds, completed }) => renderer({ hours, minutes, seconds, completed,row })}/>
                          </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </div>
        
    )
}
