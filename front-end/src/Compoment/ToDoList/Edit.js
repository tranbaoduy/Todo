import React,{useState,useEffect} from 'react'
import { Form,Input,DatetimeCustom,Button,TableCustom,Alter } from '../../Element';
import {Grid,Typography,TableBody,TableRow,TableCell} from '@mui/material';
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import {getFormattedDate} from '../../Element/function'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { APIEndpoint } from './api'

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

export default function Edit(props) {
    const {setOpen,itemEdit} = props
    const [InformationList,setInformationList] = useState(newItem);
    const [lstDetail,setDetail] = useState([]);
    const [Job,setJob] = useState(itemDetail);
    const [errors,setErrors] = useState({})
    const [notify,setNotify] = useState({isOpen: false, type:'' , message:''})
    useEffect(() => {
        APIEndpoint().getLstJob(itemEdit)
        .then(res => {
            if(res.status === 200){
                res.data.data.lstDetail.forEach(element => {
                    if(element.IsImportan === 1){
                        element.IsImportan = true
                    }else{
                        element.IsImportan = false
                    }
                });
                setDetail(res.data.data.lstDetail);
                setInformationList(res.data.data.InformationList);
            }
        })
        .catch(err => {
            console.log('err',err);
        })
    }, [itemEdit])

    const headcells = [
        {id: 'tenJob' , label : 'Tên Công Việc',align:"center"},
        {id: 'file' , label : 'File Đính kèm',align:"center"},
        {id: 'quantrong' , label : 'QT',align:"center"},
        {id: 'Action' , label : 'Action',align:"center"},
    ]

    const style = undefined;

    const { 
        TblContainer,
        TblHead
    } 
    = TableCustom(headcells,style);

    const getNameAttachFile = (formdata) => {
        let FileName = '';
        for(let i = 0; i < formdata.length; i ++){
            FileName =  FileName + formdata[i].fileName + ',';
        }
        return FileName.substring(0,FileName.length-1);
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

    const onChangeInputJob = e => {
        const {name,value} = e.target;
        setJob({
            ...Job,
            [name]:value
        })
       
    }

    const onChangeInput = e => {
        const {name,value} = e.target;
        setInformationList({
            ...InformationList,
            [name]:value
        })
       
    }

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

    const HandleEdit = (item) => {
        var index = lstDetail.indexOf(item);
        if (index > -1) {
            lstDetail.splice(index, 1);
        }
        setJob(pre => {
            return {
                ...pre,...item
            }
        });
    }

    const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
    });

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

    function isBase64(encodedString) {
        var regexBase64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        return regexBase64.test(encodedString);   // return TRUE if its base64 string.
    }

    const AddNew = async () => {
        if(validateDetail()){
            if(Job.file.length > 0){
                for(let i = 0; i < Job.file.length ; i++){
                    if(isBase64(Job.file[i].formFiles)){
                        Job.file[i].formFiles = await toBase64(Job.file[i].file)
                    }
                }
            }
            let lst = [...lstDetail,Job]
            lst = lst.sort((a, b) => new Date(a.ImplementationDate) - new Date(b.ImplementationDate));
            setDetail(pre => {
                return [...lst]
            })
        }
    }
    const Remove = async (item) => {
        var index = lstDetail.indexOf(item);
        if (index > -1) {
            lstDetail.splice(index, 1);
        }
    }

    const handldeCheck = (event,item) =>{
        let lst = [...lstDetail]
        let itemUpdate = lst.indexOf(item);
        lst[itemUpdate].IsImportan = event.target.checked;
        setDetail(pre => {
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

    const save = () => {
        lstDetail.forEach(item => {
            if(item.IsImportan === true){
                console.log(item.IsImportan);
                item.IsImportan = 1
            }else{
                console.log(item.IsImportan);
                item.IsImportan = 0
            }   
        })
        if(validate()){
            let editItem = {
                InformationList: InformationList,
                lstDetail: lstDetail
            }
            APIEndpoint().Update(editItem)
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
                    label="Tên Dự án"
                    name="NameTodo"
                    value={InformationList.NameTodo}
                    style={{width:"100%"}}
                    onChange={onChangeInput}
                    disabled
                    />
                </Grid>
            </Grid>
            <Grid container style={{paddingTop:"30px"}}>
                <Grid item xs={12}>
                    <Typography variant="h6">Danh Sách Công việc</Typography>               
                </Grid>
            </Grid>     
            <Grid container style={{paddingTop:"30px"}}>
                <Grid item xs={7}>
                    <Input
                    label="Công việc"
                    name="NameJob"
                    value={Job.NameJob}
                    onChange={onChangeInputJob}
                    error= {errors.NameJob}
                    style={{width:"95%"}}
                    />
                </Grid>
                {/* <Grid item xs={3}>
                    <DatetimeCustom
                    typePicker="DateTimePiker"
                    label="Ngày bắt đầu"
                    value={new Date(Job.ImplementationDate)}
                    handleChange = {handlImplementationDate}
                    error= {errors.ImplementationDate}
                    style={{width:"95%"}}
                    />
                </Grid>
                <Grid item xs={3}>
                    <DatetimeCustom
                    typePicker="DateTimePiker"
                    label="Ngày kết thúc"
                    value={Job.DateFinish}
                    handleChange = {handlDateFinish}
                    style={{width:"95%"}}
                    />
                </Grid> */}
                <Grid item xs={5}>
                    <Grid container>
                        <Grid item xs={7}>
                            <input  type="file" name="file" onChange={handleChangeFile}  multiple />
                        </Grid>
                        <Grid item xs={5}>
                            <Button variant="contained" color="primary" onClick={AddNew}>+</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>        
            <Grid container style={{paddingTop:"30px"}}>
                <TblContainer>
                <TblHead></TblHead>
                    <TableBody>
                        {lstDetail.map(item => (
                            <TableRow key={item.NameJob}>
                                <TableCell align='center' style={{width:"25%"}}>{item.NameJob}</TableCell>  
                                {/* <TableCell align='center' style={{width:"10%"}}>{getFormattedDate(item.ImplementationDate)}</TableCell> 
                                <TableCell align='center' style={{width:"10%"}}>{getFormattedDate(item.DateFinish)}</TableCell>  */}
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
                                <TableCell align='center'  style={{width:"10%"}}>
                                    <EditIcon onClick={() => HandleEdit(item)}/><DeleteIcon onClick={() => Remove(item)}/>
                                </TableCell>
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
