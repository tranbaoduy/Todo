import React from 'react'
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
root: {
    '& .MuiFormControl-root': {
        width: '90%',
    },
}
});


export default function Form(props) {
    const classes  = useStyles();
    const {children, ...other} = props;
    return (
        <form className={classes.root}  autoComplete="off" { ...other}>
            {children}
        </form>
        
    )
}
