import React,{useState} from 'react'
import {Button,Input,Form,Alter} from '../../Element'
import {Grid,Typography} from '@mui/material';
import {APIEndpoint} from './api';
import Cookies from 'js-cookie';

const NewObj =  {
    NewPassWord : "",
    PasswrodAgaint :""
}

export default function ResetPassWord(props) {
    const {setOpen} = props;
    const[Pass,setPass] = useState(NewObj);
    const [errors,setErrors] = useState({})
    const [notify,setNotify] = useState({isOpen: false, type:'' , message:''})

    const onChangeInput = e => {
        const {name,value} = e.target;
        setPass({
            ...Pass,
            [name]:value
        })
    }

    
    const Validate = () =>{
        let temp = {};
        temp.NewPassWord = Pass.NewPassWord ? "" : "Bạn chưa nhập PassWord."
        temp.PasswrodAgaint = (Pass.NewPassWord !== Pass.PasswrodAgaint) ? "Mật khẩu xác nhận chưa chính xác !" : ""
        setErrors(
            pre => {
                return {...pre,...temp}
            }
        )
        return Object.values(temp).every(x => x === "");
    }


    const save = () => {
        console.log(Validate());
        if(Validate()){
            console.log('a')
            let User = {
                UserName : JSON.parse(Cookies.get('User')).UserName,
                PassWord : Pass.NewPassWord,
                Token: JSON.parse(Cookies.get('User')).Token
            }
            APIEndpoint().ChangePassWord(User)
            .then(res => {
                console.log('res',res);
    
            })
            .catch(err => {
                console.log('err',err);
            })
        }
        
    }





    return (
        <div>
            <Form>
                <Grid container>
                    <Typography variant="h4">Đăng ký Tài Khoản</Typography>
                </Grid>
                <Grid container style={{paddingTop:"20px"}}>
                    <Grid item xs={12}>
                        <Input
                        label="Mật khẩu mới"
                        name="NewPassWord"
                        value={Pass.NewPassWord}
                        onChange={onChangeInput}
                        error= {errors.NewPassWord}
                        />
                    </Grid>
                </Grid>
                <Grid container style={{paddingTop:"20px"}}>
                    <Grid item xs={12}>
                        <Input
                        label="Nhập lại mật khẩu mới"
                        name="PasswrodAgaint"
                        value={Pass.PasswrodAgaint}
                        onChange={onChangeInput}
                        error= {errors.PasswrodAgaint}
                        />
                    </Grid>
                </Grid>
                <div style={{paddingTop:"20px"}}>
                    <Button variant="contained" color="primary" onClick={save}>Đổi mật khẩu</Button>
                    <Button variant="contained" color="error" style={{marginLeft:"15px"}} onClick={setOpen}>Hủy Bỏ</Button>
                </div>
            </Form>   
            <Alter notify={notify} />
        </div>
    )
}
