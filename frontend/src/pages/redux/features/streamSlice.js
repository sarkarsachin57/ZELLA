import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [

  ],
  images:[

  ]
}

export const streamSlice = createSlice({
  name: 'streamSlice',
  initialState: initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload]
    },

    setMessages: (state, action) => {
      state.messages = action.payload
    },

    updateMessage: (state, action) => {
      state.messages = [...state.messages, action.payload]
    },

    deleteMessage: (state, action) => {
      state.messages = (state.messages).filter((Message)=> Message.id != action.payload.id)
    }
  }
});

export const { addMessage, setMessages, updateMessage, deleteMessage } = streamSlice.actions;

export default streamSlice.reducer

