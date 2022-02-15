import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface StateType {
    rows: any[],
    checkedRows: number[],
    mode: "edit" | "new"| "delete" | ""
    openedForm: string,
    currentRow: any,
    rowsCount: number,
    currentPage: number,
    endpoint: string,
}

const initialState:StateType = {
    rows: [],
    checkedRows: [],
    mode: "",
    openedForm: "",
    currentRow: null,
    rowsCount: 0,
    currentPage: 1,
    endpoint: ""
  }
export const tableSlice = createSlice({
  name: 'tables',
  initialState: initialState,
  reducers: {
    insertRows: (state, action) => {
        state.rows = action.payload
    },
    addRow: (state, action) => {
      state.rows = [...state.rows, action.payload]
    },
    insertCheckedRows: (state, action) => {
      state.checkedRows = action.payload
    },
    addCheckedRow: (state, action) => {
        state.checkedRows = [...state.checkedRows, action.payload]
    },
    resetCheckedRows: (state) => {
      state.checkedRows = []
    },
    changeMode: (state, action) => {
      state.mode = action.payload
    },
    changeOpendForm: (state, action) => {
      state.openedForm = action.payload
    },
    closeForm: (state) => {
      state.mode = ""
      state.openedForm = ""
      state.currentRow = null
    },
    changeCurrentRow: (state, action) => {
      const newRow = {...action.payload, button: null}
      state.currentRow = action.payload
    },
    deleteRow: (state, action) => {
      state.rows = state.rows.filter((row) => row !== action.payload)
    },
    insertRowsCount: (state, action) => {
      state.rowsCount = action.payload
    },
    changeCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    changeEndpoint: (state,action) => {
      state.endpoint = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { insertRows, addCheckedRow, addRow, changeMode, changeOpendForm, closeForm,
  deleteRow, changeCurrentRow, insertCheckedRows,
  insertRowsCount, changeCurrentPage, changeEndpoint, resetCheckedRows} = tableSlice.actions

export default tableSlice.reducer