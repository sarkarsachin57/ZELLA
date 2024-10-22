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
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } = props

  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ minWidth: headCell.minWidth }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
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

export default function SegmentationClassificationTable(props) {
  const headCells = [
    {
      id: 'no',
      numeric: false,
      disablePadding: true,
      label: 'No'
    },
    {
      id: 'Classes',
      numeric: true,
      disablePadding: false,
      label: 'Class Name'
    },
    {
      id: 'number_images',
      numeric: true,
      disablePadding: false,
      label: 'Image Number'
    },
    {
      id: 'number_instances',
      numeric: true,
      disablePadding: false,
      label: 'Instance Number'
    },
    {
      id: 'Precision',
      numeric: true,
      disablePadding: false,
      label: 'Precision',
    },
    {
      id: 'Recall',
      numeric: true,
      disablePadding: false,
      label: 'Recall'
    },
    {
      id: 'MAP',
      numeric: true,
      disablePadding: false,
      label: 'MAP',
    },
  ]

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('calories')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const { basicData } = props
  const data = [] 
  basicData.Classes.map((item, index)=>{
    const tmp = {
      'Classes': basicData.Classes[index],
      'MAP': basicData.MAP[index],
      'Precision': basicData.Precision[index],
      'Recall': basicData.Recall[index],
      'number_images': basicData.number_images[index],
      'number_instances': basicData.number_instances[index]
    }
    data[index]= tmp
  })

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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0

  const visibleRows = useMemo(() => {
    if (!data || data.length === 0) return []; // Make sure rows are available
    return [...data]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [data, order, orderBy, page, rowsPerPage]);

  return (
    <Box sx={{ width: '100%'}}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='large'>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              headCells={headCells}
            />
              <TableBody>
                {
                  visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.no)
                    const labelId = `enhanced-table-checkbox-${index}`

                    return (
                      <TableRow
                        hover
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell component='th' id={labelId} scope='row' padding='none'>
                          {index+1}
                        </TableCell>
                        <TableCell align='center'>{row.Classes}</TableCell>
                        <TableCell align='center'>{row.number_images}</TableCell>
                        <TableCell align='center'>{row.number_instances}</TableCell>
                        <TableCell align='center'>{row.Precision}</TableCell>
                        <TableCell align='center'>{row.Recall}</TableCell>
                        <TableCell align='center'>{row.MAP}</TableCell>
                      </TableRow>
                    )
                  })
                }
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}
