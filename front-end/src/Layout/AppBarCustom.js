import React,{useState,useEffect} from 'react'
import { makeStyles } from "@mui/styles"  
import { createTheme, ThemeProvider } from '@mui/material/styles';  
import NotificationsIcon from '@mui/icons-material/Notifications';
import {AppBar,Toolbar,Typography} from '@mui/material'
import {  HubConnectionBuilder,LogLevel } from "@microsoft/signalr";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Cookies from 'js-cookie'
import {Popup} from '../Element'
import EditUser from '../Compoment/User/EditUser'
import ResetPassWord from '../Compoment/User/ResetPassWord'

const theme = createTheme();
const useStyles = makeStyles((theme) => ({
    root : {
        flexGrow : 1,
        '& .MuiAppBar-colorPrimary': {
            backgroundColor: "#fafbfc",
            color: "#6c757d"
        },
        width: "100%",
        height: "64px",
        boxSizing: "border-box"
    },
    menuButton: {
        //marginRight: theme.spacing(2)
    },
    logo : {
        //marginRight: theme.spacing(7)
    },
    title:{
        flexGrow : 1,
        textAlign: "center"
    },
    notification:{
        position:"fixed",
        right:"10px",
        top:"70px",
        borderRadius:"5px",
        height:"85vh",
        width:"250px",
        boxShadow:"0px 1px 10px #868677",
        display:"flex",
        zIndex:"10000",
        flexDirection:"column",
        alignItems:"center",
        backgroundColor:"#454444"
    },
    detail: {
        color:"#fff"
    },
    number : {
        width:"20px",
        height:"20px",
        zIndex:"10000",
        backgroundColor:"red",
        position:"fixed",
        color:"#ffffff",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:"50%",
        top:"30px",
        right:"110px"
    },
    signOut : {
        position:"fixed",
        right:"10px",
        top:"70px",
        borderRadius:"5px",
        width:"250px",
        boxShadow:"0px 1px 10px #868677",
        display:"flex",
        zIndex:"10000",
        flexDirection:"column",
        alignItems:"center",
        backgroundColor:"#ffff"
    },
    signOutDetail : {
        fontWeight:"700",
        cursor:"pointer"
    }

  }));


export default function AppBarCustom() {
    const classes = useStyles();
    const [stateNotify,setStateNotify] = useState('hidden')
    const [stateSignOut,setStateSignOut] = useState('hidden')
    const [connection, setConnection] = useState(null);
    const [lstNotification,setNotification]= useState(localStorage.getItem('notification') !== null ? localStorage.getItem('notification').split(";") : []);
    useEffect(() => {
        const connect = new HubConnectionBuilder()
          .withUrl("https://localhost:5001/notification")
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();
        setConnection(connect);
    }, []);

    useEffect(() => {
        if (connection) {
          connection
            .start()
            .then(()  => {
              connection.on("ReceiveMessage", (message) => {
                   let lstnotifi = localStorage.getItem('notification');
                   if(lstnotifi === null){
                    setNotification(pre => {
                        return [...lstNotification,message];
                    });
                    localStorage.setItem('notification',message);
                   }
                   if(lstnotifi !== null){
                    localStorage.setItem('notification',lstnotifi + ";" + message);
                    lstnotifi = lstnotifi.split(";");
                    lstnotifi.push(message)
                    setNotification(lstnotifi);
                   }
                   
              });
            })
            .catch((error) => console.log(error));
        }
      }, [connection]);

    const handlNotify = async () => {
        try{
            if(stateNotify === 'hidden'){
                setStateNotify('visible')
            }
            if(stateNotify === 'visible'){
                setStateNotify('hidden')
            }
        }
        catch(e)
        {
            console.log(e);
        }
        
    }

    const handlSignOut = async () => {
        try{
            if(stateSignOut === 'hidden'){
                setStateSignOut('visible')
            }
            if(stateSignOut === 'visible'){
                setStateSignOut('hidden')
            }
        }
        catch(e)
        {
            console.log(e);
        }
        
    }

    const handleSignOut = () => {
        Cookies.remove('User', { path: '/' })
        window.location.pathname ="/";
    }

    //Edit User 
    const [openEdit,setOpenEdit] = useState(false);
    const HandlEdit = () => {
        setStateSignOut('hidden')
        setOpenEdit(true);
    }

    const CloseEdit = () => {
        setOpenEdit(false);
    }
    //Reset
    const [openReset,setOpenReset] = useState(false);
    const HandlReset = () => {
        setStateSignOut('hidden')
        setOpenReset(true);
    }

    const CloseReset = () => {
        setOpenReset(false);
    }




    return (
        <ThemeProvider theme = {theme}>
            <div>
                <div className={classes.root}>
                    <AppBar >
                        <Toolbar>
                            <Typography className={classes.logo} noWrap>
                            </Typography>
                            <Typography variant="h6" className={classes.title} noWrap>
                                TodoList
                            </Typography>
                            <NotificationsIcon style={{marginRight:"15px",color:"#1976d2",cursor:"pointer",fontSize:"35px"}} onClick={handlNotify}/>
                            <ArrowDropDownIcon style={{marginRight:"15px",color:"#1976d2",cursor:"pointer",fontSize:"35px"}} onClick={handlSignOut}/>
                            {/* <p style={{cursor:"pointer",color:"#1976d2"}} >Đăng Xuất</p> */}
                        </Toolbar>
                    </AppBar>
                </div>
                <div className={classes.notification} style={{visibility:stateNotify}}>
                    {lstNotification.map(item => (
                        <p key={item} className={classes.detail}>{item}</p>    
                    ))}
                </div>
                <div className={classes.signOut} style={{visibility:stateSignOut}}>
                    <p className={classes.signOutDetail} onClick={HandlEdit}>Cập nhật tài khoản</p>
                    <p className={classes.signOutDetail} onClick={HandlReset}>Thay đổi mật khẩu</p>
                    <p className={classes.signOutDetail} onClick={handleSignOut}>Đăng xuất</p>
                </div>
                <div className={classes.number}>
                      {lstNotification.length}
                </div>
            </div>
            <Popup open={openEdit} setOpen = {CloseEdit} size="sm">
                <EditUser setOpen = {CloseEdit} />
            </Popup>
            <Popup open={openReset} setOpen = {CloseReset} size="sm">
                <ResetPassWord setOpen = {CloseReset}/>
            </Popup>
        </ThemeProvider>
        
    )
}
