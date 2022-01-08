import React,{useState} from 'react'
import { Form,Alter,Button } from '../../Element';
import {Grid,Typography} from '@mui/material';
import { APIEndpoint } from './api'

export default function Delete(props) {
    const {setOpen,itemDelete} = props;
    const [notify,setNotify] = useState({isOpen: false, type:'' , message:''})
    const save = () => {
        APIEndpoint().Delete(itemDelete)
        .then(res => {
            if(res.status === 200){
                let succes ={isOpen: true, type:'success' , message:'Xóa Dữ Liệu thành công'}
                setNotify( pre => {
                    return {...pre,...succes}
                })
                setOpen();    
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div>
            <Form encType="multipart/form-data">
                <Grid container>
                    <Typography variant="h4">Bạn chắc chắn muốn xóa dự án</Typography>
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
