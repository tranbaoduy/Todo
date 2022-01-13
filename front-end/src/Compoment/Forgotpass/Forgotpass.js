import React,{useState} from 'react'
import {Button,Input,Form,Alter} from '../../Element'
import {Grid,Typography} from '@mui/material';
import {APIEndpoint} from './api'


const newUser = {
    UserName:'',
}

const pass = {
    NewPassWord: '',
    NewPassWordAgaint: ''
}



export default function Forgotpass(props) 
{   
    const {setOpen} = props
    const [errors,setErrors] = useState({})
    const [notify,setNotify] = useState({isOpen: false, type:'' , message:''})
    const [Sended,setSended] = useState(1) 
    const [Userout,setUserOut] = useState(newUser)
    const [Token,setToken] = useState('');

    const UnSended = () => {
        const [User,setUser] = useState(newUser)
        const Validate = () =>{
            let temp = {};
            temp.UserName = User.UserName ? "" : "UserName không được bỏ trống."
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
            setUserOut(User)
            if(Validate()){
                APIEndpoint().CheckUser(User)
                .then(res => {
                    if(res.status === 200){
                        setSended(2)
                    }
                })
                .catch(err => console.log(err));
            }
        }

        return (
            <>
            <Grid container style={{paddingTop:"20px"}}>
            <Grid item xs={12}>
                <Input
                label="User Name"
                name="UserName"
                value={User.UserName}
                onChange={onChangeInput}
                error= {errors.UserName}
                />
            </Grid>
            </Grid>
            <div style={{paddingTop:"20px"}}>
                    <Button variant="contained" color="primary" onClick={save}>Gửi yêu cầu</Button>
                    <Button variant="contained" color="error" style={{marginLeft:"15px"}} onClick={setOpen}>Hủy Bỏ</Button>
            </div>   
            </>
        )
    }

    const Sending = (props) => {
        const {Userout} = props;
        const [Code,setCode] = useState('');

        const onChangeInputCode = e => {
            const {name,value} = e.target;
            setCode(value)
        }

        const Validate = () =>{
            let temp = {};
            temp.Code = Code ? "" : "Bạn chưa nhập mã code"
            
            setErrors(
                pre => {
                    return {...pre,...temp}
                }
            )
            return Object.values(temp).every(x => x === "");
        }

        const save = () => {
            let User = {
                UserName: Userout.UserName,
                CodeReset: parseInt(Code)
            }
            if(Validate()){
                APIEndpoint().CheckCode(User)
                .then(res => {
                    if(res.status === 200){
                        setSended(3)
                        setToken(res.data.data);
                    }
                    if(res.status === 404){
                        let temp = {};
                        temp.Code = "Mã code chưa chính xác. Vui lòng kiểm tra lại !!";
                        setErrors(
                            pre => {
                                return {...pre,...temp}
                            }
                        )
                    }
                })
                .catch(err => console.log(err));
            }
        }

        return (
            <>
            <Grid container style={{paddingTop:"20px"}}>
                <Grid item xs={12}>
                    <Input
                    label="Mã code"
                    name="Code"
                    value={Code}
                    onChange={onChangeInputCode}
                    error= {errors.Code}
                    />
                </Grid>
            </Grid>
            <Grid container style={{paddingTop:"20px"}}>
                <Grid item xs={12}>
                    <p style={{color:"red"}}>Mã code đã được gửi về email của bạn .Mời bạn nhập mã code !</p>
                </Grid>
            </Grid>     
            <div style={{paddingTop:"20px"}}>
                <Button variant="contained" color="primary" onClick={save}>Gửi yêu cầu</Button>
                <Button variant="contained" color="error" style={{marginLeft:"15px"}} onClick={setOpen}>Hủy Bỏ</Button>
            </div>    
            </>
        )
    }

    const ChangePass = (props) => {
        const {Userout} = props;
        const [Pass,setPass] = useState(pass);

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
            temp.NewPassWordAgaint = (Pass.NewPassWord !== Pass.NewPassWordAgaint) ? "Mật khẩu xác nhận chưa chính xác !" : ""
            setErrors(
                pre => {
                    return {...pre,...temp}
                }
            )
            return Object.values(temp).every(x => x === "");
        }

        const save = () =>{
            let User = {
                UserName: Userout.UserName,
                PassWord : Pass.NewPassWord,
                Token : Token
            }
            APIEndpoint().ChangePassWord(User)
            .then(res => {
                if(res.status === 200){
                    setSended(4);
                }
            })
            .catch(err => {
                setSended(5);
            })
        }



        return (
            <>
            <Grid container style={{paddingTop:"20px"}}>
                <Grid item xs={12}>
                    <Input
                    label="Mật khẩu mới"
                    name="NewPassWord"
                    value = {Pass.NewPassWord}
                    onChange = {onChangeInput}
                    error= {errors.NewPassWord}
                    type="password"
                    />
                </Grid>
            </Grid>
            <Grid container style={{paddingTop:"20px"}}>
                <Grid item xs={12}>
                    <Input
                        label="Nhập lại mật khẩu mới"
                        name="NewPassWordAgaint"
                        value = {Pass.NewPassWordAgaint}
                        onChange = {onChangeInput}
                        error= {errors.NewPassWordAgaint}
                        type="password"
                    />
                </Grid>
            </Grid>     
            <div style={{paddingTop:"20px"}}>
                <Button variant="contained" color="primary" onClick={save}>Đổi mật khẩu</Button>
                <Button variant="contained" color="error" style={{marginLeft:"15px"}} onClick={setOpen}>Hủy Bỏ</Button>
            </div>    
            </>
        )
    }

    const Success = () =>{
        return (
            <>
            <h3>Thay đổi mật khẩu thành công !!</h3>
            <div style={{paddingTop:"20px"}}>
                <Button variant="contained" color="error" style={{marginLeft:"15px"}} onClick={setOpen}>Hủy Bỏ</Button>
            </div>
            </>
        )
    }

    const Fail = () =>{
        return (
            <>
            <h3>Thay đổi mật khẩu thất bại !!</h3>
            <div style={{paddingTop:"20px"}}>
                <Button variant="contained" color="error" style={{marginLeft:"15px"}} onClick={setOpen}>Hủy Bỏ</Button>
            </div>
            </>
        )
    }

    const Contetn = (props) => {
        const {Sended} = props;
        if(Sended === 1){
            return (
                <UnSended />
            )
        }
        if(Sended === 2)
        {
            return (
                <Sending Userout={Userout}/>
            )
        }
        if(Sended === 3){
            return (
                <ChangePass Userout={Userout}/>
            )
        }
        if(Sended === 4){
            return (
                <Success />
            )
        }
        if(Sended === 5){
            return (
                <Fail />
            )
        }
    }

    return (
        <div>
            <Form>
                <Grid container>
                    <Typography variant="h4">Cấp Lại mật khẩu</Typography>
                </Grid>
                <Contetn Sended={Sended}/>
            </Form>   
            <Alter notify={notify} />
        </div>
       
    )
}
