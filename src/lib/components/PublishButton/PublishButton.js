// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from '@translations/i18next';
import _get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon, Message, Modal } from 'semantic-ui-react';
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from '../../DepositFormSubmitContext';
import { DRAFT_PUBLISH_STARTED } from '../../state/types';
import { connect as connectFormik } from 'formik';
import _omit from 'lodash/omit';

class PublishButtonComponent extends Component {
  static contextType = DepositFormSubmitContext;
  state = { isConfirmModalOpen: false };

  openConfirmModal = () => this.setState({ isConfirmModalOpen: true });

  closeConfirmModal = () => this.setState({ isConfirmModalOpen: false });

  handlePublish = (event, handleSubmit, publishWithoutCommunity) => {
    this.context.setSubmitContext(
      publishWithoutCommunity
        ? DepositFormSubmitActions.PUBLISH_WITHOUT_COMMUNITY
        : DepositFormSubmitActions.PUBLISH
    );
    handleSubmit(event);
    this.closeConfirmModal();
  };

  isDisabled = (values, isSubmitting, numberOfFiles) => {
    const filesEnabled = _get(values, 'files.enabled', false);
    const filesMissing = filesEnabled && !numberOfFiles;
    return isSubmitting || filesMissing;
  };

  render() {
    const {
      actionState,
      publishClick,
      numberOfFiles,
      buttonLabel,
      publishWithoutCommunity,
      formik,
      ...ui
    } = this.props;
    const { isConfirmModalOpen } = this.state;
    const { values, isSubmitting, handleSubmit } = formik;

    const uiProps = _omit(ui, ['dispatch']);

    return (
      <>
        <Button
          disabled={this.isDisabled(values, isSubmitting, numberOfFiles)}
          name="publish"
          onClick={this.openConfirmModal}
          positive
          icon="upload"
          loading={isSubmitting && actionState === DRAFT_PUBLISH_STARTED}
          labelPosition="left"
          content={buttonLabel}
          {...uiProps}
        />
        {isConfirmModalOpen && (
          <Modal
            open={isConfirmModalOpen}
            onClose={this.closeConfirmModal}
            size="small"
            closeIcon={true}
            closeOnDimmerClick={false}
          >
            <Modal.Header>
              {i18next.t('Do you want to share this version?')}
            </Modal.Header>
            {/* the modal text should only ever come from backend configuration */}
            <Modal.Content>
              <Message visible warning>
                <p>
                  <Icon name="warning sign" />{' '}
                  {i18next.t(
                    "Once a version of a record is shared, changing its files is no longer permitted. However, modifying its metadata (title, authors, etc) is still allowed."
                  )}
                </p>
              </Message>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.closeConfirmModal} floated="left">
                {i18next.t('Cancel')}
              </Button>
              <Button
                onClick={(event) =>
                  this.handlePublish(
                    event,
                    handleSubmit,
                    publishWithoutCommunity
                  )
                }
                positive
                content={buttonLabel}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    );
  }
}

PublishButtonComponent.propTypes = {
  buttonLabel: PropTypes.string,
  publishWithoutCommunity: PropTypes.bool,
};

PublishButtonComponent.defaultProps = {
  buttonLabel: i18next.t('Share on archive'),
  publishWithoutCommunity: false,
};

const mapStateToProps = (state) => ({
  actionState: state.deposit.actionState,
  numberOfFiles: Object.values(state.files.entries).length,
});

export const PublishButton = connect(
  mapStateToProps,
  null
)(connectFormik(PublishButtonComponent));
