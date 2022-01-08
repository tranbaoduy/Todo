import React from 'react'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import  Input  from './Input';

export default function DatetimeCustom(props) {
    const {typePicker,value,handleChange,label,error} = props
    if(typePicker === "DatePicker"){
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                label={label}
                inputFormat="dd/MM/yyyy"
                value={value}
                onChange={handleChange}
                renderInput={(params) => <Input {...params} error={error}/>}
                />
            </LocalizationProvider>
        )
    }

    if(typePicker === 'DateTimePiker'){
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                inputFormat="dd/MM/yyyy hh:mm"
                label={label}
                value={value}
                onChange={handleChange}
                renderInput={(params) => <Input {...params} error={error}/>}
                />
            </LocalizationProvider>
        )
    }
   
}
