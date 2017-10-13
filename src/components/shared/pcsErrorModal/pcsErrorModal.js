// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import * as actions from '../../../actions';

import CloseSvg from '../../../assets/icons/Cancel.svg';

import './pcsModal.css';

class PcsErrorModal extends Component {
  render() {
    const { actions, svg, children, to } = this.props;

    return (
      <div className="pcs-error-modal-container">
        <div className="pcs-modal-close">
          <span className="pcs-modal-close-btn" onClick={actions.hideModal}>
            <img src={CloseSvg} alt="Modal icon" />
          </span>
        </div>
        <div className="pcs-modal-content">{children}</div>
      </div>
    );
  }
}
