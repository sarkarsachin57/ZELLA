import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import CustomModalLayout from './CustomModalLayout';
import DialogContent from '@mui/material/DialogContent';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';

import DatasetCard from 'src/views/settings/DatasetCard';
import SimpleImageModal from './SimpleImageModal';

export default function ViewObjectSampleModal(props) {
  const {
    width,
    isOpen,
    onHandleModalClose,
    email,
    project_name,
    data_name,
    getsemanticViewSample,
    getSimpleImageUrl
  } = props;

  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [sample_image_url, setSampleImageUrl] = useState([]);
  const [total_img_num, setTotalImgNum] = useState(0);
  const [page_num, setPageNum] = useState(1);

  useEffect(() => {
    handleViewSample(1);
  }, []);

  const handleViewSample = async (currentPageNum) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('project_name', project_name);
    formData.append('data_name', data_name);
    formData.append('show_samples', '1');
    formData.append('page_number', currentPageNum);

    try {
      const res = await getsemanticViewSample(formData);
      setSampleImageUrl(res.data.sample_paths);
      setTotalImgNum(res.data.number_of_samples);
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleChange = (event, value) => {
    setPageNum(value); // Update the page number state
    console.log('value: ',value)
    console.log('page_num: ',page_num)
    handleViewSample(value); // Call with the new page number
  };

  const handleSimpleImageOpen = () => {
    setIsChildModalOpen(true);
  };

  const handleSimpleImageClose = () => {
    setIsChildModalOpen(false);
  };

  return (
    <CustomModalLayout
      width={width}
      isOpen={isOpen}
      title={'Training Result Information'}
      onHandleModalClose={onHandleModalClose}
    >
      <DialogContent>
        <CardContent
          sx={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            flexDirection: 'column'
          }}
        >
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12}
              sx={{
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'right',
                position: 'relative',
              }}
            >
              {total_img_num > 0 && (
                <Pagination 
                  count={Math.ceil(total_img_num / 24)} // Calculate total pages
                  page={page_num}
                  color='primary'
                  onChange={handleChange}
                />
              )}
            </Grid>
          </Grid>
          <Grid container spacing={6}>
            {sample_image_url.length > 0 ? (
              sample_image_url.map((item, index) => (
                <Grid item xs={12} sm={1.5} key={index}>
                  <DatasetCard 
                    url={item} 
                    getSimpleImageUrl={getSimpleImageUrl}
                    email={email}
                    project_name={project_name}
                    handleSimpleImageOpen={handleSimpleImageOpen}
                  />
                </Grid>
              ))
            ) : null}
          </Grid>
        </CardContent>
        <SimpleImageModal 
          isOpen={isChildModalOpen}
          onHandleModalClose={handleSimpleImageClose}
        />
      </DialogContent>
    </CustomModalLayout>
  );
}