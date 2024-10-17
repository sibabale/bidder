import { RootState } from '../../index';

export const loggedInUser = (state: RootState) => state.user;
export const isUserLoggedIn = (state: RootState) => state.user.isLoggedIn;
