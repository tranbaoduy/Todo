import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';


export default function Popup(props) {
    const { children , open, setOpen,size ,...other} = props;
    return (
        <Dialog open={open} maxWidth= {size} fullWidth={true} {...other}>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}
