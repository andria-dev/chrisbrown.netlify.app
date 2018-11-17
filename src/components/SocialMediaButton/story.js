import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { WithFigma } from 'storybook-addon-figma';

import React, { useContext } from 'react';
import SocialMediaButton from './';

storiesOf('SocialMediaButton', module)
  .add('basic setup', () => (
    <WithFigma url='https://www.figma.com/file/g7O9K8Y1BVY3TJPSOdTU4EHA/Footer'>
      <SocialMediaButton
        href='https://www.facebook.com/chbchb55'
        title='Check out my Facebook'
      >
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='-9 -1 54 74'>
          <path d='M36 0v14.4h-7.2c-2.484 0-3.6 2.916-3.6 5.4v9H36v14.4H25.2V72H10.8V43.2H0V28.8h10.8V14.4C10.8 6.447 17.247 0 25.2 0H36' />
        </svg>
      </SocialMediaButton>
    </WithFigma>
  ), {
    notes: 'The attributes <code>href</code> and <code>title</code> are required.'
  })
