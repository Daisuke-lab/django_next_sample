import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface StateType {
    mc_id: null | number
}
let mcId:null | number = null

if (typeof sessionStorage !== "undefined") {
    console.log("type::", typeof sessionStorage)
    mcId = sessionStorage.getItem('mc_id') !== null?parseInt(sessionStorage.getItem('mc_id') as string):null
}
const initialState:StateType = {
    mc_id: mcId
  }

  export const userSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        updateMcId: (state, action) => {
            sessionStorage.setItem('mc_id', action.payload)
            state.mc_id = action.payload
    }
}
})

export const { updateMcId} = userSlice.actions
  
  export default userSlice.reducer