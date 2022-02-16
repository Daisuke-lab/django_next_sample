import { configureStore } from '@reduxjs/toolkit'
import tableReducer from './reducers/tableReducer'
import userReducer from './reducers/userReducer'
const store =  configureStore({
  reducer: {
    tables: tableReducer,
    users: userReducer}
})
export default store
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch