import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import GridLayout from 'qt-react/QtQuick/Layouts/1.0/GridLayout';
import * as React from 'react';
import Rectangle from 'qt-react/QtQuick/2.7/Rectangle';

import { fillWindow } from '../util/binding';
import AppBar from '../components/AppBar';
import StoryList from '../components/StoryList';

const connectToRedux = connect(null, {
  calibrate: () => push('/calibration'),
  scan: () => push('/scan'),
});

class HomePage extends React.Component {
  render() {
    return (
      <GridLayout {...fillWindow} columns={2} columnSpacing={0}>
        <AppBar
          Layout={{ fillWidth: true, columnSpan: 2, alignment: 'AlignTop' }}
          z={1}
          title="Hacker News"
          leftButtonIcon="menu"
        />
        <Rectangle
          color="#f6f6ef"
          Layout={{
            maximumWidth: 360,
            preferredWidth: 360,
            fillHeight: true,
            alignment: 'AlignTop',
          }}
        >
          <StoryList width={360} />
        </Rectangle>
        <Rectangle
          color="#eee"
          Layout={{
            fillWidth: true,
            fillHeight: true,
            alignment: 'AlignTop',
          }}
        />
      </GridLayout>
    );
  }
}

export default connectToRedux(HomePage);