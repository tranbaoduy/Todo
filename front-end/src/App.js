import React from 'react'
import { makeStyles } from "@mui/styles"
import AppBarCustom from './Layout/AppBarCustom';
import Navigation from './Layout/Navigation';
import {Routes,Route} from "react-router-dom";
import Todolist from './Compoment/ToDoList/Todolist';
import Home from './Compoment/Home/Home'
import Cookies from 'js-cookie'

const useStyles = makeStyles({
    root:{
      height: "100vh",
      boxSizing: "border-box"
    },
    maincontent:{
      marginLeft:"250px",
      height: "100vh",
    },
    Content: {
      paddingTop:"50px"
    }
  });

export default function App() {
    const status = Cookies.get('User');
    if(status === undefined){
      window.location.pathname ="/";
    }
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBarCustom/>
            <Navigation/>
            <div className={classes.maincontent}>
            <Routes>
                <Route path="QLCV" element={<Todolist />} />
            </Routes>
            <Routes>
                <Route path="DS" element={<Home />} />
            </Routes>
            </div>
        </div>
    );
}
