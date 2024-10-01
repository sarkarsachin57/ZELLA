import * as React from 'react'
import { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import { visuallyHidden } from '@mui/utils'
import Link from 'next/link'
import { colors } from '@mui/material'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }

  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function EnhancedTableHead(props) {
  const { headCells } = props

  return (
    <TableHead>
      <TableRow>
        <TableCell component='th' id={'epochs'} scope='row' padding='none'>
          Epochs
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            style={{ minWidth: headCell.minWidth }}
          >
            {headCell}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}

export default function ClassificationTable(props) {

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('calories')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const { data } = props

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.id)
      setSelected(newSelected)

      return
    }
    setSelected([])
  }


  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }


  const isSelected = id => selected.indexOf(id) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  // const visibleRows = useMemo(() => {
  //   if (!rows || rows.length === 0) return []; // Make sure rows are available
  //   return [...rows]
  //     .sort(getComparator(order, orderBy))
  //     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  // }, [rows, order, orderBy, page, rowsPerPage]);

  return (
    <Box sx={{ width: '100%'}}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='large'>
            {/* <EnhancedTableHead
              headCells={data.epochs??data.epochs}
            /> */}
              <TableBody>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' id={'class_name'} scope='row' style={{ minWidth: 120 }}>
                    Class Name
                  </TableCell>

                  {data.class_name?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row' align={'center'} >
                      {item}
                    </TableCell>
                  )) || <TableCell>No Data Available</TableCell>}  {/* Fallback if train_loss is null/undefined */}
                </TableRow>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' id={'n_sample'} scope='row' style={{ minWidth: 120 }}>
                    Sample  Num
                  </TableCell>

                  {data.n_sample?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row' align={'center'} >
                      {item}
                    </TableCell>
                  )) || <TableCell>No Data Available</TableCell>}  {/* Fallback if train_loss is null/undefined */}
                </TableRow>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' id={'TP'} scope='row' style={{ minWidth: 120 }}>
                  TP
                  </TableCell>
                  {data.TP?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row' align={'center'} >
                      {item}
                    </TableCell>
                  )) || <TableCell>No Data Available</TableCell>}  {/* Fallback if train_loss is null/undefined */}
                </TableRow>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' id={'FP'} scope='row' style={{ minWidth: 120 }}>
                    FP
                  </TableCell>
                  {data.FP?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row' align={'center'} >
                      {item}
                    </TableCell>
                  )) || <TableCell>No Data Available</TableCell>}  {/* Fallback if train_loss is null/undefined */}
                </TableRow>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' id={'FN'} scope='row' style={{ minWidth: 120 }}>
                    FN
                  </TableCell>
                  {data.FN?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row' align={'center'} >
                      {item}
                    </TableCell>
                  )) || <TableCell>No Data Available</TableCell>}  {/* Fallback if train_loss is null/undefined */}
                </TableRow>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' id={'Precision'} scope='row' style={{ minWidth: 120 }}>
                  Precision
                  </TableCell>

                  {data.Precision?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row' align={'center'} >
                      {item}
                    </TableCell>
                  )) || <TableCell>No Data Available</TableCell>}  {/* Fallback if train_loss is null/undefined */}
                </TableRow>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' id={'Recall'} scope='row' style={{ minWidth: 120 }}>
                  Recall
                  </TableCell>

                  {data.Recall?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row' align={'center'} >
                      {item}
                    </TableCell>
                  )) || <TableCell>No Data Available</TableCell>}  {/* Fallback if train_loss is null/undefined */}
                </TableRow>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' id={'Accuracy'} scope='row' style={{ minWidth: 120 }}>
                    Accuracy
                  </TableCell>

                  {data.Accuracy?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row' align={'center'} >
                      {item}
                    </TableCell>
                  )) || <TableCell>No Data Available</TableCell>}  {/* Fallback if train_loss is null/undefined */}
                </TableRow>
              </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
