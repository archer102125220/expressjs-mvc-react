import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const styles = {
  Footer: {
    height: '5vh',
    lineHeight: '5vh'
  }
};

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  // https://zh-hant.reactjs.org/docs/hooks-intro.html
  // 宣告一個新的 state 變數，我們稱作為「CopyrightYear」。
  // const [CopyrightYear, setCopyrightYear] = useState(new Date().getFullYear());
  const [CopyrightYear] = useState(new Date().getFullYear());
  return (
    <footer className={props.className || classes.Footer}>
      <p>
        Copyright © {CopyrightYear} Parker Chen. All rights reserved.
      </p>
    </footer>
  );
}

Footer.propTypes = {
  className: PropTypes.string,
};

Footer.defaultProps = {
  className: '',
};