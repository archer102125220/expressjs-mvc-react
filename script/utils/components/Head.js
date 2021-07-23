import React from 'react';
import PropTypes from 'prop-types';
import { defaultPageTitle, pageTitleTemplate } from '@config/globalHeadTage';

export default class Head extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSever: typeof (window) === 'undefined',
      timestamp: Date.now()
    };
  }

  handleTitleTag = (children) => {
    if (children.props?.children) {
      const pageTitleBeforTemplate = children.props.children;
      if (typeof (pageTitleBeforTemplate) !== 'string' || pageTitleBeforTemplate === '') return;
      const pageTitleAfterTemplate = (typeof (pageTitleTemplate) === 'string') ? pageTitleTemplate.replace('{{title}}', pageTitleBeforTemplate) : pageTitleTemplate(pageTitleBeforTemplate);
      document.querySelector('title').innerText = (typeof (pageTitleAfterTemplate) !== 'string' || pageTitleAfterTemplate === '') ? defaultPageTitle : pageTitleAfterTemplate;
    }
  }

  handleHeadChildrenTag = (children, tagName) => {
    const { props } = children || {};
    const tage = document.createElement(tagName);
    Object.keys(props).map(attributeName => {
      if (attributeName !== 'children') {
        tage.setAttribute(attributeName, props[attributeName]);
      }
    });
    if (props?.children) {
      tage.innerHTML = props.children;
    }
    tage.classList.add('__EXPRESS_MVC_REACT_PAGE_HEAD__');
    tage.classList.add(`__HEAD_${this.state.timestamp}__`);
    document.head.appendChild(tage);
  }

  render() {
    const { children } = this.props || {};
    if (this.state.isSever === true) {
      return children;
    }

    if (document.querySelector('.__SSR__')) return '';
    const oldTag = document.querySelectorAll(`.__HEAD_${this.state.timestamp}__`);
    oldTag.forEach(element => {
      element.remove();
    });

    if (Array.isArray(children) === true) {
      children.map(element => {
        if (element.type === 'title') {
          this.handleTitleTag(element);
        } else if (typeof (element.type) === 'string') {
          this.handleHeadChildrenTag(element, element.type);
        }
      });
    } else if (children.type === 'title') {
      this.handleTitleTag(children);
    } else if (typeof (children.type) === 'string') {
      this.handleHeadChildrenTag(children, children.type);
    }

    return '';
  }
  static propTypes = {
    children: PropTypes.node,
  };
}