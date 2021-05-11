import React, { useState } from 'react';
import {
  Table, Button, Input, Label,
} from 'semantic-ui-react';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

let chartInstName = ''; // chart name to install. default value is

const LocalChart = (props) => {
  const { chart, handleOpenChartClick } = props;
  const [alertInvalidInput, setAlertInvalidInput] = useState('');

  // install helm chart. providing k8s secrets not yet attempted
  function setName(e) {
    chartInstName = e.target.value;
    setAlertInvalidInput('');
  }
  function sanitizeInput(text) {
    // if field is empty, set props.chart.name
    const name = text.trim();
    if (text === '') {
      return props.chart.name;
    }
    // Check if only lowercase alphabets, numbers or dash should are used for Install Name
    const regex = /^[a-z0-9-]+$/;
    // If no invalid characters, return name
    if (regex.test(name)) {
      return name;
    }
    // If invalid characters are included, return error message
    return 'invalid input';
  }

  const installHelmChart = async () => {
    // eslint-disable-next-line no-console
    console.log('chartInstName', chartInstName);
    const helmChart = sanitizeInput(chartInstName);
    // if the input is invalid, show the alert on the label
    if (helmChart === 'invalid input') {
      setAlertInvalidInput(<Label pointing="left" color="red">Invalid input</Label>);
    } else {
    // if the input is valid, install the chart
      const directory = props.dirPath;
      setAlertInvalidInput('');
      // eslint-disable-next-line no-unused-vars
      console.log(`helm install ${helmChart} "${directory}"`);
      const { stdout, stderr } = await exec(`helm install ${helmChart} "${directory}"`);
      props.getDeployedCharts();
    }
  };

  // Prepare the Open Chart button
  const openChartButton = <Button id="openChartBtn" icon="folder open" size="tiny" compact onClick={() => handleOpenChartClick(chart.name)} />;

  // Prepare the Install button
  const installButton = <Button id="installBtn" size="tiny" compact onClick={() => installHelmChart()}>Install</Button>;

  // build the local chart component
  return (
    <Table.Row>
      <Table.Cell>{chart.name}</Table.Cell>
      <Table.Cell colSpan="2">
        <Input
          focus
          placeholder={chart.name}
          onBlur={setName}
          size="mini"
        />
        {alertInvalidInput}
      </Table.Cell>
      <Table.Cell>
        <div className="float-right">
          {installButton}
          {' '}
          {openChartButton}
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

export default LocalChart;
