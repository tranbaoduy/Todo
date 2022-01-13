import React,{useState,useEffect} from 'react'
import { Form,Input,DatetimeCustom,Button,Alter } from '../../Element';
import {Grid,Typography} from '@mui/material';
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import {convertIso} from '../../Element/function'
import FormControlLabel from '@mui/material/FormControlLabel';
import { APIEndpoint } from './api'

const newItem = {
    NameTodo : '',
    DateCreate: new Date(),
    Status:0,
    UserName:'',
    Important:false,
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

export default function Edit(props) {
    const {setOpen,itemEdit} = props
    const [InformationList,setInformationList] = useState(newItem);
    const [lstFile,setlstFile] = useState([]);
    const [errors,setErrors] = useState({})
    const [notify,setNotify] = useState({isOpen: false, type:'' , message:''})
    useEffect(() => {
        APIEndpoint().GetInformationList(itemEdit)
        .then(res => {
            if(res.status === 200){
                setlstFile(res.data.data.file);
                setInformationList(res.data.data.InformationList);
            }
        })
        .catch(err => {
            console.log('err',err);
        })
    }, [itemEdit])


    const onChangeInputJob = e => {
        const {name,value} = e.target;
        setJob({
            ...Job,
            [name]:value
        })
       
    }

   

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
           setlstFile([...lstFormData])
        }
    }

    

    const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
    });

   

    function isBase64(encodedString) {
        var regexBase64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        return regexBase64.test(encodedString);   // return TRUE if its base64 string.
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

    const onChangeInput = e => {
        const {name,value} = e.target;
        setInformationList({
            ...InformationList,
            [name]:value
        })
       
    }

    const handlDateCreate = (newValue) => {
        setInformationList(pre => {
            return {
                ...pre,
                DateCreate: newValue
            };
        })
       
    }

    const save = () => {
        if(validate()){
            InformationList.DateCreate = convertIso(InformationList.DateCreate);
            console.log('InformationList',InformationList.DateCreate);
            let editItem = {
                InformationList: InformationList,
                file: lstFile
            }
            console.log('editItem',editItem);
            APIEndpoint().Update(itemEdit,editItem)
            .then(res => {
                if(res.status === 200){
                    let succes ={isOpen: true, type:'success' , message:'Sửa Dữ Liệu thành công'}
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
            <Form>
            <Grid container>
                <Typography variant="h4">Sửa dự án</Typography>
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
