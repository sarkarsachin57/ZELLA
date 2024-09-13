import { useEffect, useRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
// import TextField from "@material-ui/core/TextField";
import TextField from '@mui/material/TextField'
import ButtonBase from "@mui/material/ButtonBase";

const FileInput = ({ label, onChange, error, video_file}) => {
  useEffect(()=>{
    setAttachment(video_file)
    if(!video_file) {
      console.log('video_file is empyt===>', video_file)
      ref.current.value = null;
    }
  }, [video_file])

  const ref = useRef();
  const classes = useStyles();
  const [attachment, setAttachment] = useState(video_file);

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;
    console.log('file=======>', file)
    setAttachment(attachment);
    if (!!onChange) onChange({ file: file });

  };

  return (
    <Box
      position="relative"
      height={60}
    >
      <Box position="absolute" top={-15} bottom={0} left={0} right={0}>
        <TextField
        //   variant="standard"
          className={classes.field}
          // InputProps={{ disableUnderline: true }}
          margin="normal"
          fullWidth
        //   disabled
          label={label} 
          value={attachment?.name || ""}
        />
      </Box>
      <ButtonBase
        className={classes.button}
        component="label"
        onKeyDown={(e) => e.keyCode === 32 && ref.current?.click()}
      >
        <input
          ref={ref}
          id="videoFile"
          name="video"
          type="file"
          // accept="video/*"
          hidden
          onChange={handleChange}
          // onClick={handleChange}
        />
      </ButtonBase>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  field: {
    "& .MuiFormLabel-root.Mui-disabled": {
      color: theme.palette.text.secondary
    }
  },
  button: {
    width: "100%",
    height: "100%",
    overflow: "hidden"
  }
}));

export default FileInput;
