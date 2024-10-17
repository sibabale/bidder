import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    email: string | null;
    userId: string | null;
    lastName: string | null;
    firstName: string | null;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    email: null,
    userId: null,
    lastName: null,
    firstName: null,
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(
            state,
            action: PayloadAction<{
                email: string;
                userId: string;
                lastName: string;
                firstName: string;
            }>
        ) {
            state.email = action.payload.email;
            state.userId = action.payload.userId;
            state.lastName = action.payload.lastName;
            state.firstName = action.payload.firstName;
            state.isLoggedIn = true;
        },
        logout(state) {
            state.email = null;
            state.userId = null;
            state.isLoggedIn = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
