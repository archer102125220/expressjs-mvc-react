import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@utils/components/Button';

const styles = {
  SearchButton: {
    padding: '0',
  },
  SearchOutlined: {
    fontSize: 40
  }
};

function SearchBar({ classes, width, input, placeholder, onSubmit }) {
  const [searchInput, setSearchInput] = useState(input || '');
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: width || '100%' }}>
      <TextField
        fullWidth
        label={placeholder}
        variant='outlined'
        size='small'
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Button variant='outlined' className={classes.SearchButton} onClick={(e) => onSubmit(searchInput, e)}>
        <SearchOutlined style={styles.SearchOutlined} color='primary' />
      </Button>
    </Box>
  );
}

SearchBar.propTypes = {
  classes: PropTypes.object,
  width: PropTypes.string,
  input: PropTypes.string,
  placeholder: PropTypes.string,
  onSubmit: PropTypes.func,
};

SearchBar.defaultProps = {
  classes: {},
  width: '',
  input: '',
  placeholder: '搜尋',
  onSubmit: () => { }
};

export default withStyles(styles)(SearchBar);