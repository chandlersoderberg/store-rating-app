import React from 'react';
import Rating from '@mui/material/Rating';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';

const StarRating = ({ value = 0, onChange, readOnly = false, size }) => {
  const muiSize = size === 'small' || size === 'large' ? size : 'medium';

  return (
    <Rating
      value={Number(value)}
      readOnly={readOnly}
      onChange={(event, newValue) => {
        if (onChange) onChange(newValue);
      }}
      size={muiSize}
      icon={<StarRoundedIcon fontSize="inherit" color="secondary" />}
      emptyIcon={<StarBorderRoundedIcon fontSize="inherit" sx={{ color: 'text.disabled' }} />}
    />
  );
};

export default StarRating;
