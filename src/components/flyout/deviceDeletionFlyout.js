// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions';
import Spinner from '../spinner/spinner';
import Delete from '../../assets/icons/Delete_dark.svg';
import CancelX from '../../assets/icons/CancelX.svg';
import ApiService from '../../common/apiService';
import lang from '../../common/lang';
import PcsBtn from '../shared/pcsBtn/pcsBtn';
import SummarySection from '../summarySection/summarySection';

class DeviceDeletionFlyout extends React.Component {
  constructor() {
    super();
    this.state = {
      showSpinner: false,
      deviceDeleted: false
    };

    this.onConfirm = this.onConfirm.bind(this);
  }


  onConfirm() {
    const { devices } = this.props;
    this.setState({ showSpinner: true });
    Promise.all(
      devices.map(({ Id }) => ApiService.deleteDevice(Id))
    ).then((res) => {
      this.props.actions.updateDevices(devices);
      this.setState({
        showSpinner: false,
        deviceDeleted: true
      })
    });
  }

  render() {
    const { devices } = this.props;
    return (
      <div className="device-schdule-flyout">
        <div className="device-schdule-content">
          <div className="content-title">
            {lang.DELETE_DEVICE}
          </div>
          <div className="content-description">
            {lang.DELETE_DEVICE_DESCRIPTION}
          </div>
          <SummarySection
            count={devices.length}
            content={this.state.deviceDeleted ? lang.DEVICE_DELETED : lang.AFFECTED_DEVICES} />
          { this.state.deviceDeleted
            ? <div className="btn-group">
                <PcsBtn svg={CancelX} onClick={this.props.onClose}>{lang.CLOSE}</PcsBtn>
              </div>
            : <div className="btn-group">
                <PcsBtn svg={CancelX} onClick={this.props.onClose}>{lang.CANCEL}</PcsBtn>
                {this.state.showSpinner && <Spinner size="medium" />}
                <PcsBtn svg={Delete} className="primary" onClick={this.onConfirm}>{lang.DELETE}</PcsBtn>
              </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { devices: state.flyoutReducer.devices };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceDeletionFlyout);
