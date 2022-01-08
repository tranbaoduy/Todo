import React,{useState,useEffect} from 'react'
import { makeStyles } from "@mui/styles"
import {Toolbar ,Typography,Grid,TableBody,TableRow,TableCell }from '@mui/material';
import {Input,Button,Form,Popup,TableCustom,} from '../../Element'
import {getFormattedDate} from '../../Element/function'
import Create from './Create'
import Edit from './Edit'
import { APIEndpoint } from './api'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from './Delete';
const useStyles = makeStyles({
    root:{
        '& .MuiOutlinedInput-input':{
            width: "90%",
            height:"15px",
        },
        '& .MuiButton-root':{
            height:"45px",
        },
        paddingTop:"25px"
    },
  });


export default function Todolist() {
    const classes = useStyles()

    //Index
    const[TodoList,setTodoList] = useState([]);
    const pages = [5,10,15];
    const [page,setPage] = useState(0);
    const [rowsPerPage,setRowPerPage] = useState(pages[page])
    const [totalCount,setTotalCount] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = event => {
        setRowPerPage(parseInt(event.target.value,10))
    }

    useEffect(() => {
        const filterData = () => {
            var obj = {
                PageSize:rowsPerPage,
                Page:page + 1,
                filter:filter
            }
            APIEndpoint().Paging(obj)
            .then(res => {
                setTodoList(res.data.data.data)
                setTotalCount(res.data.data.cout );
            })
            .catch(err => console.log(err))
        }
        filterData();
    }, [page,rowsPerPage])


    const [filter,setFilter] = useState('')
    const filterDataa = () => {
        var obj = {
            PageSize:rowsPerPage,
            Page:page + 1,
            filter:filter
        }
        APIEndpoint().Paging(obj)
        .then(res => {
            setTodoList(res.data.data.data)
            setTotalCount(res.data.data.cout );
        })
        .catch(err => console.log(err))
    }
    const inputFilterChange = e => {
        setFilter(e.target.value);
    }

    const filterChange = e =>{
        if (e.key === 'Enter') {
            filterDataa()
        }
    }

    const headcells = [
        {id: 'tenDuan' , label : 'Tên Dự Án',align:"center"},
        {id: 'ngayBatDau' , label : 'Ngày Bắt Đầu',align:"center"},
        {id: 'ngayKeThuc' , label : 'Ngày Kết thúc',align:"center"},
        {id: 'Action' , label : 'Action',align:"center"},
    ]

    const style = undefined;

    const { 
        TblContainer,
        TblHead,
        TblPagination
    } 
    = TableCustom(headcells,style,page,handleChangePage,pages,rowsPerPage, handleChangeRowsPerPage,totalCount); 

    //Create
    const[openCreate,setOpenCreate] = useState(false)
    const AddNew = () => {
        setOpenCreate(true);
    }
    const closeAddNew = () => {
        setOpenCreate(false);
        filterDataa()
    }

    //Edit
    const[openEdit,setOpenEdit] = useState(false)
    const[itemEdit,setItemEdit] = useState('')
    const HandleEdit = (item) => {
        setItemEdit(item);
        setOpenEdit(true);
    }
    const closeEdit = () => {
        setOpenEdit(false);
        filterDataa();
    }
    //Delete
    const[openDelete,setOpenDelete] = useState(false)
    const[itemDelete,setItemDelete] = useState('')
    const HandleDelelte = (item) => {
        setItemDelete(item);
        setOpenDelete(true);
    }
    const closeDelete = () => {
        setOpenDelete(false);
        filterDataa();
    }
    return (
        <div className={classes.root}>
            <Form>
            <Typography variant="h4" style={{paddingLeft:"15px"}}>Quản Lý công việc</Typography>
            <Toolbar style={{paddingTop:"25px"}}>
                 <Input
                  name="filter"
                  value = {filter}
                  onChange = {inputFilterChange}
                  onKeyDown = {filterChange}
                  placeholder = "Tìm Kiếm ...."
                 />
                 <Button variant="contained" color="primary" style={{marginRight:"15px"}} onClick={AddNew}>Thêm mới</Button>
            </Toolbar>
            <div>
                <Grid container>
                    <Grid item xs = {12}>
                    <TblContainer>
                    <TblHead></TblHead>
                        <TableBody>
                            {TodoList.map(item => (
                                <TableRow key={item.NameTodo}>
                                    <TableCell align='center' >{item.NameTodo}</TableCell>  
                                    <TableCell align='center' >{getFormattedDate(item.DateBegin)}</TableCell> 
                                    <TableCell align='center' >{getFormattedDate(item.DateEnd)}</TableCell> 
                                    <TableCell align='center'>
                                        <EditIcon onClick={() => HandleEdit(item.NameTodo)}/><DeleteIcon onClick={() => HandleDelelte(item.NameTodo)}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TblContainer> 
                    <TblPagination/>
                    </Grid>
                </Grid>
            </div>
            </Form>
            <Popup open={openCreate} setOpen = {closeAddNew} size="lg">
                <Create setOpen = {closeAddNew} />
            </Popup>
            <Popup open={openEdit} setOpen = {closeEdit} size="lg">
                <Edit setOpen = {closeEdit} itemEdit={itemEdit}/>
            </Popup>
            <Popup open={openDelete} setOpen = {closeDelete} size="lg">
                <Delete setOpen = {closeDelete} itemDelete={itemDelete}/>
            </Popup>
        </div>
       
    )
}
