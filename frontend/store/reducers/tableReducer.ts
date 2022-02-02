import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface StateType {
    rows: any[],
    checkeds: number[]
}

const initialState:StateType = {
    rows: [],
    checkeds: []
  }
export const tableSlice = createSlice({
  name: 'tables',
  initialState: initialState,
  reducers: {
    insertRows: (state, action) => {
        state.rows = action.payload
    },
    appendCheckedRow: (state, action) => {
        state.checkeds = [...state.checkeds, action.payload]
    }}
})

// Action creators are generated for each case reducer function
export const { insertRows, appendCheckedRow } = tableSlice.actions

export default tableSlice.reducer