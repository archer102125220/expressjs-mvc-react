import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@utils/components/Button';

const styles = {
  SearchButton: {
    padding: '0',
  },
  SearchOutlined: {
    fontSize: 40
  }
};

const useStyles = makeStyles(styles);

function SearchBar({ width, input, placeholder, onSubmit }) {
  const classes = useStyles();
  const [searchInput, setSearchInput] = useState(input || '');
  useEffect(() => {
    setSearchInput(input);
  }, [input]);
  const onKeyDown = (e) => {
    if (e.keyCode === 13 && searchInput !== '') {
      onSubmit(searchInput, e);
    }
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: width || '100%' }}>
      <TextField
        fullWidth
        label={placeholder}
        variant='outlined'
        size='small'
        value={searchInput}
        onInput={(e) => setSearchInput(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <Button variant='outlined' className={classes.SearchButton} onClick={(e) => onSubmit(searchInput, e)}>
        <SearchOutlined style={styles.SearchOutlined} color='primary' />
      </Button>
    </Box>
  );
}

SearchBar.propTypes = {
  width: PropTypes.string,
  input: PropTypes.string,
  placeholder: PropTypes.string,
  onSubmit: PropTypes.func,
};

SearchBar.defaultProps = {
  width: '',
  input: '',
  placeholder: '搜尋',
  onSubmit: () => { }
};

export default SearchBar;