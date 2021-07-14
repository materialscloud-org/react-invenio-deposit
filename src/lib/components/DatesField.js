// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ArrayField,
  GroupField,
  SelectField,
  TextField,
} from 'react-invenio-forms';
import { Button, Form, Icon } from 'semantic-ui-react';

import { emptyDate } from '../record';
import { i18next } from '../i18next';

export class DatesField extends Component {
  /** Top-level Dates Component */

  render() {
    const { fieldPath, options, label, labelIcon, placeholderDate, required } =
      this.props;

    return (
      <ArrayField
        addButtonLabel={i18next.t('Add date')} // TODO: Pass by prop
        defaultNewValue={emptyDate}
        fieldPath={fieldPath}
        helpText={i18next.t(
          'Format: DATE or DATE/DATE where DATE is YYYY or YYYY-MM or YYYY-MM-DD.'
        )}
        label={label}
        labelIcon={labelIcon}
        required={required}
      >
        {({ array, arrayHelpers, indexPath, key, form }) => (
          <GroupField fieldPath={fieldPath} optimized>
            <TextField
              fieldPath={`${key}.date`}
              label={i18next.t('Date')}
              placeholder={placeholderDate}
              required
              width={5}
            />
            <SelectField
              fieldPath={`${key}.type`}
              label={i18next.t('Type')}
              options={options.type}
              required
              width={5}
              optimized
            />
            <TextField
              fieldPath={`${key}.description`}
              label={i18next.t('Description')}
              width={5}
            />
            <Form.Field width={1}>
              <label>&nbsp;</label>
              <Button
                icon
                onClick={() => arrayHelpers.remove(indexPath)}
                type="button"
              >
                <Icon name="close" />
              </Button>
            </Form.Field>
          </GroupField>
        )}
      </ArrayField>
    );
  }
}

DatesField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  options: PropTypes.shape({
    type: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
  }).isRequired,
  required: PropTypes.bool,
};

DatesField.defaultProps = {
  fieldPath: 'metadata.dates',
  label: i18next.t('Dates'),
  labelIcon: 'calendar',
  placeholderDate: i18next.t('YYYY-MM-DD or YYYY-MM-DD/YYYY-MM-DD'),
};
