import React from 'react'
import { makeStyles } from "@mui/styles"
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const useStyles = makeStyles({
    root : {
        '& .MuiSnackbar-root':{
            width: "100%"
        },
        '& .MuiAlert-root': {
            width: "100%",
            padding: "6px 580px",
            fontSize: "15.5px"
        }
    }
  });

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Alter(props) {
    const {notify} = props;
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Snackbar open={notify.isOpen} autoHideDuration={150000}>
                <Alert severity = {notify.type}>
                    {notify.message}
                </Alert>
            </Snackbar>
        </div>
    )
}
