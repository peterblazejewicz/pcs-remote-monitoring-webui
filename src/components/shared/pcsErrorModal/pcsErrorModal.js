// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { PcsBtn } from '../pcsBtn/pcsBtn';
import * as actions from '../../../actions';

import CloseSvg from '../../../assets/icons/Cancel.svg';

import './pcsModal.css';

class PcsErrorModal extends Component {
  render() {
    return (
      <div className="pcs-error-modal-container">
        <div className="pcs-modal-close">
          <span className="pcs-modal-close-btn" >
            <img src={CloseSvg} alt="Modal close icon" />
          </span>
        </div>
        <div className="pcs-modal-content">some rando information</div>
        <div className="pcs-modal-action-btns">
          <PcsBtn>Close</PcsBtn>
          <PcsBtn>Close</PcsBtn>
        </div>
      </div>
    );
  }
}


