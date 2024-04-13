import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items:[]
}
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
        clean: (state) => {
			state.items = [];
		},
        delete: (state, action) => {
			state.items = state.items.filter(i => i.food.id !== action.payload);
		},
        remove: (state, action) => {
			const existed = state.items.find(i => i.food.id === action.payload);
			if (!existed) {
				return;
			}
			if (existed.count === 1) {
				state.items = state.items.filter(i => i.food.id !== action.payload);
			} else {
				state.items.map(i => {
					if (i.food.id === action.payload) {
						i.count -= 1;
					}
					return i;
				});
				return;
			}

		},

        add: (state, action) => {
			const existed = state.items.find(i => i.food.id === action.payload.id);
			if (!existed) {
				state.items.push({ food: action.payload, count: 1 });
				return;
			}
			state.items.map(i => {
				if (i.food.id === action.payload.id) {
					i.count += 1;
				}
				return i;
			});
		}
    }
})


export default cartSlice.reducer;
export const cartActions = cartSlice.actions;