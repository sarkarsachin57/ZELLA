import * as React from 'react'
import { useEffect, useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export default function HistoryTable(props) {

  const { data } = props

  return (
    <Box sx={{ width: '100%'}}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='large'>
              <TableBody>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' id={'train_loss'} scope='row' style={{ minWidth: 120 }}>
                    Epochs
                  </TableCell>

                  {data.epochs?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row'>
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
                  <TableCell component='th' id={'train_iou'} scope='row' style={{ minWidth: 120 }}>
                    Train IOU
                  </TableCell>

                  {data.train_iou?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row'>
                      {item}
                    </TableCell>
                  )) || <TableCell>No Data Available</TableCell>}  
                </TableRow>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' id={'train_loss'} scope='row' style={{ minWidth: 120 }}>
                    Train Loss
                  </TableCell>

                  {data.train_loss?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row'>
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
                  <TableCell component='th' id={'val_class_average_iou'} scope='row' style={{ minWidth: 120 }}>
                  Val Class Average IOU
                  </TableCell>

                  {data.val_class_average_iou?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row'>
                      {item}
                    </TableCell>
                  )) || <TableCell>No Data Available</TableCell>}
                </TableRow>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' id={'val_iou'} scope='row' style={{ minWidth: 120 }}>
                  Val IOU
                  </TableCell>

                  {data.val_iou?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row'>
                      {item}
                    </TableCell>
                  )) || <TableCell>No Data Available</TableCell>}
                </TableRow>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' id={'val_loss'} scope='row' style={{ minWidth: 120 }}>
                  Val Loss
                  </TableCell>

                  {data.val_loss?.map((item, index) => (
                    <TableCell component='th' key={index} scope='row'>
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