import React from 'react';
import gql from 'graphql-tag';
import {
  combineValidators,
  composeValidators,
  isRequired,
  isAlphabetic,
  isNumeric,
} from 'revalidate';
import FormSchema from '../src/Schema';
import createForm from '../src/withForm';
import FormProvider from '../src/FormProvider';
import { Input } from './Inputs';

function SubmitControls() {
  return <button type="submit">Submit</button>;
}

const sampleMutation = gql`
  mutation($inputData: PersonInput) {
    createSample(inputData: $inputData)
  }
`;

const fragment = gql`
  fragment client on ClientData {
    name
    age
  }
`;

const query = gql`
  {
    sampleForm @client {
      name
      age
    }
  }
  ${fragment}
`;

const errorsQuery = gql`
  {
    sampleFormErrors @client {
      name
      age
    }
  }
  ${fragment}
`;

const Form = createForm({
  mutation: sampleMutation,
  inputQuery: query,
  errorsQuery: errorsQuery,
})(FormProvider);

const sampleValidator = combineValidators({
  name: composeValidators(isRequired, isAlphabetic)('Name'),
  age: composeValidators(isRequired, isNumeric)('Age'),
});

const initialData = {
  name: null,
  age: null,
};

export default function SimpleForm() {
  return (
    <Form
      validator={sampleValidator}
      initialData={initialData}
      onSuccess={() => {
        return console.log('Submitted!');
      }}
      onError={() => {
        console.log('ERRORED');
      }}
      onErrorMessage={(errorMessage) => {
        const errorKeys = Object.keys(errorMessage);
        console.log('**** ERRORS', errorMessage[errorKeys[0]]);
      }}
      formName="sampleForm"
    >
      <Input field="name" />
      <Input type="number" field="age" />
      <SubmitControls />
    </Form>
  );
}
