import React from 'react'
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { makeStyles } from "@mui/styles"
const useStyles = makeStyles({
    table : {
        marginTop: "15px",
        '& thead th':{
            fontWeight: '600',
            color: "white",
            backgroundColor: "#6c7ae0",
        },
        '& tbody td': {
            fontWeight: '300',
        },
        '& tbody tr:hover': {
            backgroundColor: '#fffbf2',
            cursor: 'pointer'
        }
    }
  });


export default function TableCustom(headcells,style,page, handleChangePage,pages,rowsPerPage, handleChangeRowsPerPage,totalCount) {
    const classes = useStyles();
    const TblContainer = props => (
            <Table className={style === undefined ? classes.table : style}>
                {props.children}
            </Table>
    )

    const TblHead = props => {
        return(
        <TableHead>
            <TableRow>
                {headcells.map(row => (
                    <TableCell key={row.id} align= {row.align === "center" ? row.align : "inherit"} >
                            {row.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
        )
    }

    const TblPagination = () => {
        return(
       <TablePagination 
           component="div"
           page = {page}
           rowsPerPageOptions= {pages}
           rowsPerPage= {rowsPerPage} 
           count = {totalCount}
           onPageChange={handleChangePage}
           onRowsPerPageChange = {handleChangeRowsPerPage}
       />
       
   )}

    return {
        TblContainer,
        TblHead,
        TblPagination
    }
        
   
}
