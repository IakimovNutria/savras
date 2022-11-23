import {createReducer} from '@reduxjs/toolkit';

import {
  changeGenre
} from './actions';

const initialState = {

};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeGenre, (state, action) => {

    });
});
