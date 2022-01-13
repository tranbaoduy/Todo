import React,{useState,useEffect} from 'react'
import { Form,Input,DatetimeCustom,Button,TableCustom,Alter } from '../../Element';
import {Grid,Typography,TableBody,TableRow,TableCell} from '@mui/material';
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import Cookies from 'js-cookie'
import { APIEndpoint } from './api'
import {  HubConnectionBuilder,LogLevel } from "@microsoft/signalr";
import FormControlLabel from '@mui/material/FormControlLabel';
const newItem = {
    NameTodo : '',
    DateCreate: new Date(),
    Status:false,
    UserName:'',
    Important:false,
}


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


export default function Create(props) {
    const {setOpen} = props;
    const [InformationList,setInformationList] = useState(newItem);
    const [lstFile,setLstFile] = useState([])
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

    

    useEffect(() => {
        setInformationList(pre => {
            return {
                ...pre,
                UserName: JSON.parse(Cookies.get('User')).UserName
            };
        })
    }, [])  





    const getNameAttachFile = (formdata) => {
        let FileName = '';
        for(let i = 0; i < formdata.length; i ++){
            FileName =  FileName + formdata[i].fileName + ',';
        }
        return FileName.substring(0,FileName.length-1);
    }

   

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
                    formFiles: await toBase64(event.target.files[i])
                };
                lstFormData.push(newItem);
           }
           setLstFile([...lstFormData])
        }
    }

    const handldeCheck = (event,item) =>{
        setInformationList(pre => {
            return {
                ...pre,
                Important: event.target.checked,
            };
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
        if(validate()){
            let insertItem = {
                InformationList: InformationList,
                file: lstFile
            }
            APIEndpoint().Insert(insertItem)
            .then(res => {
                if(res.status === 200){
                    SendNotificaion("Công việc " + res.data.message + " vừa được tạo mới")
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
                    <Typography variant="h4">Thêm mới Công Việc</Typography>
                </Grid>
                <Grid container style={{paddingTop:"20px"}}>
                    <Grid item xs={12}>
                        <Input
                        label="Tên Công Việc"
                        name="NameTodo"
                        value={InformationList.NameTodo}
                        onChange={onChangeInput}
                        error= {errors.NameTodo}
                        />
                    </Grid>
                </Grid>
                <Grid container style={{paddingTop:"20px"}}>
                    <Grid item xs={12} >
                        <DatetimeCustom
                            typePicker="DateTimePiker"
                            label="Ngày giờ thực hiện"
                            value={InformationList.DateCreate}
                            handleChange = {handlDateCreate}    
                        />
                    </Grid>
                </Grid>
                <Grid container style={{paddingTop:"20px"}}>
                    <Grid item xs={12}>
                        <input  type="file" name="file" onChange={handleChangeFile}  multiple />
                    </Grid>
                </Grid>
                <Grid container style={{paddingTop:"20px"}}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            label="Quan Trọng"
                            control={
                                <Checkbox
                                {...label}
                                checked={InformationList.Important}
                                sx={{
                                    color: pink[800],
                                    '&.Mui-checked': {
                                    color: pink[600],
                                    },
                                }}
                                onChange={(event) => handldeCheck(event)}
                            />
                            }
                        />
                    </Grid>
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
