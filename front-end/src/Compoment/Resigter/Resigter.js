import React,{useState} from 'react'
import {Button,Input,Form,Alter} from '../../Element'
import {Grid,Typography} from '@mui/material';
import {APIEndpoint} from './api'

const newUser = {
    UserName:'',
    FullName:'',
    PassWord:'',
    Email:'',
    role:0
}


export default function Resigter(props) 
{   
    const {setOpen} = props
    const [User,setUser] = useState(newUser)
    const [errors,setErrors] = useState({})
    const [notify,setNotify] = useState({isOpen: false, type:'' , message:''})

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    const Validate = () =>{
        let temp = {};
        temp.Username = User.Username ? "" : "This field is requiued."
        temp.FullName = User.FullName ? "" : "This field is requiued."
        temp.PassWord = User.PassWord ? "" : "This field is requiued."
        temp.Email = validateEmail(User.Email) ? "" : "Email not illegal."
        setErrors(
            pre => {
                return {...pre,...temp}
            }
        )
        return Object.values(temp).every(x => x === "");
    }

    const onChangeInput = e => {
        const {name,value} = e.target;
        setUser({
            ...User,
            [name]:value
        })
    }

    const save = () => {
        if(Validate()){
            APIEndpoint().Insert(User)
            .then(res => {
                let succes ={isOpen: true, type:'success' , message:'Thêm mới thành công'}
                setNotify( pre => {
                    return {...pre,...succes}
                })
                setOpen();
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
                    <Typography variant="h4">Đăng ký Tài Khoản</Typography>
                </Grid>
                <Grid container style={{paddingTop:"20px"}}>
                    <Grid item xs={6}>
                        <Input
                        label="Tên Người Dùng"
                        name="FullName"
                        value={User.FullName}
                        onChange={onChangeInput}
                        error= {errors.FullName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Input
                        label="User Name"
                        name="Username"
                        value={User.Username}
                        onChange={onChangeInput}
                        error= {errors.Username}
                        />
                    </Grid>
                </Grid>
                <Grid container style={{paddingTop:"20px"}}>
                    <Grid item xs={6}>
                        <Input
                        label="Email"
                        name="Email"
                        value={User.Email}
                        onChange={onChangeInput}
                        error= {errors.Email}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Input
                        label="Mật Khẩu"
                        name="PassWord"
                        value={User.PassWord}
                        onChange={onChangeInput}
                        error= {errors.PassWord}
                        type="password"
                        />
                    </Grid>
                </Grid>
                <div style={{paddingTop:"20px"}}>
                    <Button variant="contained" color="primary" onClick={save}>Đăng nhập</Button>
                    <Button variant="contained" color="error" style={{marginLeft:"15px"}} onClick={setOpen}>Hủy Bỏ</Button>
                </div>
            </Form>   
            <Alter notify={notify} />
        </div>
       
    )
}
