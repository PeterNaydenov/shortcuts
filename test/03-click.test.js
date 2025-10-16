import { beforeEach, describe, it, test } from 'vitest'
import { userEvent } from '@vitest/browser/context'

import Block from '../test-components/Block.jsx'
import VisaulController from '@peter.naydenov/visual-controller-for-react'
import '../test-components/style.css'


import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  waitFor,
} from '@testing-library/dom'



import { 
          pluginClick,
          pluginKey
        , pluginForm
        , shortcuts 
                } from '../src/main.js'
import { expect } from 'chai'

import askForPromise from 'ask-for-promise'

const html = new VisaulController ();



describe.skip ( 'Click plugin', () => {

}) // describe