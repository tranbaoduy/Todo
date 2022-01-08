import React, {useState} from 'react'
import {Grid,Typography} from '@mui/material'
import { makeStyles } from "@mui/styles"
import {Button,Input,Form,Popup} from '../Element'
import Resigter from '../Compoment/Resigter/Resigter'
import {APIEndpoint} from '../Compoment/Resigter/api'
const useStyles = makeStyles({
    root:{
        '& .MuiButton-containedPrimary':{
            width: "90%",
            margin: "30px",
            height:"40px"
        },
        '& .MuiFormControl-root':{
            width: "90%",
            marginLeft: "15px",
            padding:"5px"
        },
        '& .MuiTypography-h3':{
            paddingBottom: "35px"
        },
       backgroundColor:"#efefef",
       height: "100vh",
       display:"flex",
       alignItems:"center",
       justifyContent:"center",
       
    },
    content: {
        backgroundColor:"#fff",
        height:"400px",
        width:"350px",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"column",
        borderRadius:"10px"
    },
  });

const UserLogin = {
    UserName: '',
    PassWord:''
}
export default function Login() {
    const classes = useStyles();
    const [User,setUser] = useState(UserLogin)
    const [openResigter,setOpenResigter] = useState(false)
    const [errors,setErrors] = useState({})
    const onResigter = () => {
        setOpenResigter(true);
    }

    const closeResigter = () => {
        setOpenResigter(false);
    }

    const onChangeInput = e => {
        const {name,value} = e.target;
        setUser({
            ...User,
            [name]:value
        })
    }

    const Validate = () =>{
        let temp = {};
        temp.UserName = User.UserName ? "" : "This field is requiued."
        temp.PassWord = User.PassWord ? "" : "This field is requiued."
        setErrors(
            pre => {
                return {...pre,...temp}
            }
        )
        return Object.values(temp).every(x => x === "");
    }

    const handleError = () => {
        let temp = {};
        temp.UserName =  "UserName hoặc PassWord chưa đúng "
        temp.PassWord =  "UserName hoặc PassWord chưa đúng"
        setErrors(
            pre => {
                return {...pre,...temp}
            }
        )
        return Object.values(temp).every(x => x === "");
    }

    const onLogin = () => {
        if(Validate()){
            APIEndpoint().Login(User)
            .then(res => {
                if(res.data.status === "200"){
                    window.location.pathname ="/Home/DS";
                }
                if(res.data.status === '404'){
                    handleError();
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    return (
        <div className={classes.root}>
            <Form className={classes.content}>
                <Typography variant="h3" component="h2">
                    Đăng Nhập
                </Typography>
                <Grid container>
                    <Input 
                        label="Tên đăng nhập"
                        name="UserName"
                        value={User.UserName}
                        onChange={onChangeInput}
                        error= {errors.UserName}
                    />
                </Grid>
                <Grid container>
                    <Input 
                        label="Mật Khẩu"
                        name="PassWord"
                        type="password"
                        value={User.PassWord}
                        onChange={onChangeInput}
                        error= {errors.PassWord}
                    />
                </Grid>
                <Button variant="contained" color="primary" onClick={onLogin}>Đăng nhập</Button>
                <p style={{cursor:"pointer"}} onClick={onResigter}>Đăng Ký</p>
            </Form>
            <Popup open={openResigter} setOpen = {closeResigter} size="lg">
                <Resigter setOpen = {closeResigter} />
            </Popup>
        </div>
    )
}