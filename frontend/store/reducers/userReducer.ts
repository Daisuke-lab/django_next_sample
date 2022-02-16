import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface StateType {
    pg_id: null | number
}
let pgId:null | number = null

if (typeof sessionStorage !== "undefined") {
    console.log("type::", typeof sessionStorage)
    pgId = sessionStorage.getItem('pg_id') !== null?parseInt(sessionStorage.getItem('pg_id') as string):null
}
const initialState:StateType = {
    pg_id: pgId
  }

  export const userSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        updatePgId: (state, action) => {
            sessionStorage.setItem('pg_id', action.payload)
            state.pg_id = action.payload
    }
}
})

export const { updatePgId} = userSlice.actions
  
  export default userSlice.reducer