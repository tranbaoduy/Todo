import React,{useState,useEffect} from 'react'
import { Form,Input,DatetimeCustom,Button,TableCustom,Alter } from '../../Element';
import {Grid,Typography,TableBody,TableRow,TableCell} from '@mui/material';
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import {getFormattedDate} from '../../Element/function'
import { APIEndpoint } from './api'
import {  HubConnectionBuilder,LogLevel } from "@microsoft/signalr";
const newItem = {
    NameTodo : '',
    DateCreate: new Date(),
    Status:0
}

const itemDetail = {
    NameJob: '',
    ImplementationDate: new Date(),
    DateFinish : new Date(),
    Status: 0,
    IsImportan:false,
    file:[]
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


export default function Create(props) {
    const {setOpen} = props;
    const [InformationList,setInformationList] = useState(newItem);
    const [Job,setJob] = useState(itemDetail);
    const [lstDetail,setLstDetail] = useState([]);
    const [errors,setErrors] = useState({})
    const [notify,setNotify] = useState({isOpen: false, type:'' , message:''})
    const handlDateCreate = (newValue) => {
        setInformationList(pre => {
            return {
                ...pre,
                DateCreate: newValue
            };
        })
    }

    const onChangeInput = e => {
        const {name,value} = e.target;
        setInformationList({
            ...InformationList,
            [name]:value
        })
       
    }

    const onChangeInputJob = e => {
        const {name,value} = e.target;
        setJob({
            ...Job,
            [name]:value
        })
       
    }

    const handlImplementationDate = (newValue) => {
        setJob(pre => {
            return {
                ...pre,
                ImplementationDate: newValue
            };
        })
    }
    const handlDateFinish = (newValue) => {
        setJob(pre => {
            return {
                ...pre,
                DateFinish: newValue
            };
        })
    }

    const handleCheckBox = (event) => {
        setJob(pre => {
            return {
                ...pre,
                IsImportan:  event.target.checked
            };
        })
    };

    const validateDetail = () => {
        let temp = {};
        temp.NameJob = Job.NameJob ? "" : "This field is requiued."
        temp.ImplementationDate = Job.ImplementationDate > Job.DateFinish ? "Ngày bắt đầu không thể lớn hơn ngày kết thúc." : ""
        setErrors(
            pre => {
                return {...pre,...temp}
            }
        )
        return Object.values(temp).every(x => x === "");
    }

    const AddNew = async () => {
        
        if(validateDetail()){
            for(let i = 0; i < Job.file.length ; i++){
                Job.file[i].formFiles = await toBase64(Job.file[i].file)
            }
            setLstDetail(pre => {
                return [...lstDetail,Job]
            })
        }
    }

    const getNameAttachFile = (formdata) => {
        let FileName = '';
        for(let i = 0; i < formdata.length; i ++){
            FileName =  FileName + formdata[i].fileName + ',';
        }
        return FileName.substring(0,FileName.length-1);
    }

    const headcells = [
        {id: 'tenJob' , label : 'Tên Công Việc',align:"center"},
        {id: 'ngayBatDau' , label : 'Ngày Bắt Đầu',align:"center"},
        {id: 'ngayKeThuc' , label : 'Ngày Kết thúc',align:"center"},
        {id: 'file' , label : 'File Đính kèm',align:"center"},
        {id: 'quantrong' , label : 'QT',align:"center"},
    ]

    const style = undefined;

    const { 
        TblContainer,
        TblHead
    } 
    = TableCustom(headcells,style);

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

   
    const handleChangeFile =async (event) => {
        let lstFormData = [];
        if (event.target.files.length > 0) {
           for(let i= 0; i < event.target.files.length; i++){
                let newItem = {
                    fileName : event.target.files[i].name,
                    file: event.target.files[i]
                };
                lstFormData.push(newItem);
           }
           setJob(pre => {
            return {
                ...pre,
                file: [...lstFormData]
            };
        })
        }
    }

    const handldeCheck = (event,item) =>{
        let lst = [...lstDetail]
        let itemUpdate = lst.indexOf(item);
        lst[itemUpdate].IsImportan = event.target.checked;
        setLstDetail(pre => {
            return [...lst]
        })
    }

    const validate = () => {
        let temp = {};
        temp.NameTodo = InformationList.NameTodo ? "" : "This field is requiued."
        setErrors(
            pre => {
                return {...pre,...temp}
            }
        )
        return Object.values(temp).every(x => x === "");
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



    const save =  () => {
        lstDetail.forEach(item => {
            if(item.IsImportan === true){
                item.IsImportan = 1
            }else{
                item.IsImportan = 0
            }   
        })
        
        if(validate()){
            let insertItem = {
                InformationList: InformationList,
                lstDetail: lstDetail
            }
            console.log('insertItem',insertItem);
            APIEndpoint().Insert(insertItem)
            .then(res => {
                if(res.status === 200){
                    console.log('res',res);
                    SendNotificaion("Dự án " + res.data.message + " vừa được tạo mới")
                    let succes ={isOpen: true, type:'success' , message:'Thêm mới thành công'}
                    setNotify( pre => {
                        return {...pre,...succes}
                    })
                    setOpen();    
                }
            })
            .catch(err => {
                console.log('err',err)
            })
        }
        
    }


    return (
        <div>
            <Form encType="multipart/form-data">
                <Grid container>
                    <Typography variant="h4">Thêm mới dự án</Typography>
                </Grid>
                <Grid container style={{paddingTop:"20px"}}>
                    <Grid item xs={12}>
                        <Input
                        label="Tên Dự án"
                        name="NameTodo"
                        value={InformationList.NameTodo}
                        onChange={onChangeInput}
                        style={{width:"100%"}}
                        error= {errors.NameTodo}
                        />
                    </Grid>
                </Grid>
                <Grid container style={{paddingTop:"30px"}}>
                    <Grid item xs={3}>
                        <Input
                        label="Công việc"
                        name="NameJob"
                        value={Job.NameJob}
                        onChange={onChangeInputJob}
                        error= {errors.NameJob}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <DatetimeCustom
                        typePicker="DateTimePiker"
                        label="Ngày bắt đầu"
                        value={Job.ImplementationDate}
                        handleChange = {handlImplementationDate}
                        error= {errors.ImplementationDate}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <DatetimeCustom
                        typePicker="DateTimePiker"
                        label="Ngày kết thúc"
                        value={Job.DateFinish}
                        handleChange = {handlDateFinish}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container>
                            <Grid item xs={8}>
                                <input  type="file" name="file" onChange={handleChangeFile}  multiple />
                            </Grid>
                            <Grid item xs={4}>
                                <Button variant="contained" color="primary" onClick={AddNew}>+</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container style={{paddingTop:"30px"}}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Danh Sách Công việc</Typography>               
                    </Grid>
                </Grid>
                <Grid container style={{paddingTop:"30px"}}>
                    <TblContainer>
                    <TblHead></TblHead>
                        <TableBody>
                            {lstDetail.map(item => (
                                <TableRow key={item.NameJob}>
                                    <TableCell align='center' style={{width:"25%"}}>{item.NameJob}</TableCell>  
                                    <TableCell align='center' style={{width:"15%"}}>{getFormattedDate(item.ImplementationDate)}</TableCell> 
                                    <TableCell align='center' style={{width:"15%"}}>{getFormattedDate(item.DateFinish)}</TableCell> 
                                    <TableCell align='center' style={{width:"40%"}}>{getNameAttachFile(item.file)}</TableCell> 
                                    <TableCell align='center' style={{width:"5%"}}><Checkbox
                                                                                                {...label}
                                                                                                checked={item.IsImportan}
                                                                                                sx={{
                                                                                                    color: pink[800],
                                                                                                    '&.Mui-checked': {
                                                                                                    color: pink[600],
                                                                                                    },
                                                                                                }}
                                                                                                onChange={(event) => handldeCheck(event,item)}
                                                                                                /></TableCell>  
                                </TableRow>
                            ))}
                        </TableBody>
                    </TblContainer>            
                </Grid>
                <Grid container style={{paddingTop:"30px",paddingLeft:"35%",paddingBottom:"15px"}} >
                    <div >
                        <Button variant="contained" color="primary" onClick={save}>Lưu</Button>
                        <Button variant="contained" color="error" style={{marginLeft:"15px"}} onClick={setOpen}>Hủy Bỏ</Button>
                    </div>
                </Grid>
            </Form>
            <Alter notify={notify} />
        </div>
    )
}
