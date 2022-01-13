import React,{useState} from 'react'
import {Button,Input,Form,Alter} from '../../Element'
import {Grid,Typography} from '@mui/material';
import Cookies from 'js-cookie';
import {APIEndpoint} from './api'



export default function EditUser(props) {
    const {setOpen} = props;
    const [User,setUser] = useState(JSON.parse(Cookies.get('User')));
    const [errors,setErrors] = useState({});
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
        temp.UserName = User.UserName ? "" : "This field is requiued."
        temp.FullName = User.FullName ? "" : "This field is requiued."
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
            APIEndpoint().Update(User.Id,User)
            .then(res => {
                if(res.status === 200){
                    let succes ={isOpen: true, type:'success' , message:'cập nhật thành công'}
                    setNotify( pre => {
                        return {...pre,...succes}
                    })
                    setOpen();
                }
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
                    <Typography variant="h4">Cập nhật thông tin tài khoản</Typography>
                </Grid>
                <Grid container style={{paddingTop:"20px"}}>
                    <Grid item xs={12}>
                        <Input
                        label="UserName"
                        name="UserName"
                        value={User.UserName}
                        onChange={onChangeInput}
                        error= {errors.UserName}
                        />
                    </Grid>
                </Grid>
                <Grid container style={{paddingTop:"20px"}}>
                    <Grid item xs={12}>
                        <Input
                        label="Tên Người Dùng"
                        name="FullName"
                        value={User.FullName}
                        onChange={onChangeInput}
                        error= {errors.FullName}
                        />
                    </Grid>
                </Grid>
                <Grid container style={{paddingTop:"20px"}}>
                    <Grid item xs={12}>
                        <Input
                        label="Email"
                        name="Email"
                        value={User.Email}
                        onChange={onChangeInput}
                        error= {errors.Email}
                        />
                    </Grid>
                </Grid>
                <div style={{paddingTop:"20px"}}>
                    <Button variant="contained" color="primary" onClick={save}>Cập nhật</Button>
                    <Button variant="contained" color="error" style={{marginLeft:"15px"}} onClick={setOpen}>Hủy Bỏ</Button>
                </div>
            </Form>
            <Alter notify={notify} />
        </div>
    )
}
