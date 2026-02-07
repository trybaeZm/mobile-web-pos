import { UsersType } from "@/types/Customers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Partial<UsersType> = {
    id: "",
    // business_id: "", // might be needed if Customers type has it but UsersType doesn't? UsersType has user_id. 
    // Checking UsersType definition: id: string, user_id: number. No business_id in UsersType but in Customers type. 
    // Dashboard code had business_id in initialState, imply type casting or Partial<UsersType> allows extra?
    // Or UsersType actually has business_id?
    // Let's stick to Dashboard code which had business_id: ""
    // @ts-ignore
    business_id: "",
    created_at: "",
    // customer_type: "", // Same here
    // @ts-ignore
    customer_type: "",
    email: "",
    // gender: "",
    // @ts-ignore
    gender: "",
    location: "",
    name: "",
    phone: "",
    hasSubscription: false,
};

const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState,
    reducers: {
        setUserDetails: (state: Partial<UsersType>, action: PayloadAction<Partial<UsersType>>) => {
            Object.assign(state, action.payload);
            state.hasSubscription = true;
        },
        clearUserDetails: (state: Partial<UsersType>) => {
            Object.assign(state, initialState);
        },
        updateUserField: <K extends keyof Partial<UsersType>>(
            state: Partial<UsersType>,
            action: PayloadAction<{ field: K; value: UsersType[K] }>
        ) => {
            state[action.payload.field] = action.payload.value;
        },
    },
});

export const { setUserDetails, clearUserDetails, updateUserField } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
