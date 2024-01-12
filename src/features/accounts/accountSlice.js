import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance = state.balance + action.payload;
      state.isLoading = false;
    },
    withdrawl(state, action) {
      state.balance = state.balance - action.payload;
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
    requestLoan: {
      prepare(loanAmount, loanPurpose) {
        return {
          payload: { loanAmount, loanPurpose },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) return;

        state.balance = state.balance + action.payload.loanAmount;
        state.loan = action.payload.loanAmount;
        state.loanPurpose = action.payload.loanPurpose;
      },
    },
    payLoan(state, action) {
      state.balance = state.balance - state.loan;
      state.loanPurpose = "";
      state.loan = 0;
    },
  },
});

console.log(accountSlice);

export const { withdrawl, requestLoan, payLoan } = accountSlice.actions;

export function deposit(amount, currency) {
  if (currency === "USD") {
    return {
      type: "account/deposit",
      payload: amount,
    };
  }

  return async function (dispatch, getState) {
    // API Call
    dispatch({
      type: "account/convertingCurrency",
    });
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );
    const data = await res.json();

    const converted = data.rates.USD;
    console.log("Converted : ", converted);
    dispatch({
      type: "account/deposit",
      payload: converted,
    });
  };
}

export default accountSlice.reducer;

// export default function accountReducer(state = initialState, action) {
//   switch (action.type) {
//     case "account/deposit": {
//       return {
//         ...state,
//         balance: state.balance + action.payload,
//         isLoading: false,
//       };
//     }
//     case "account/withdrawl": {
//       return {
//         ...state,
//         balance: state.balance - action.payload,
//       };
//     }
//     case "account/convertingCurrency": {
//       return {
//         ...state,
//         isLoading: true,
//       };
//     }
//     case "account/requestLoan": {
//       if (state.loan > 0) {
//         return state;
//       }

//       return {
//         ...state,
//         loan: action.payload.loanAmount,
//         loanPurpose: action.payload.loanPurpose,
//         balance: state.balance + action.payload.loanAmount,
//       };
//     }
//     case "account/payLoan": {
//       return {
//         ...state,
//         loan: 0,
//         loanPurpose: "",
//         balance: state.balance - state.loan,
//       };
//     }
//     default: {
//       return state;
//     }
//   }
// }

// export function deposit(amount, currency) {
//   if (currency === "USD") {
//     return {
//       type: "account/deposit",
//       payload: amount,
//     };
//   }

//   return async function (dispatch, getState) {
//     // API Call
//     dispatch({
//       type: "account/convertingCurrency",
//     });
//     const res = await fetch(
//       `https://api.frankfurter.app/latest?amount=10&from=${currency}&to=USD`
//     );
//     const data = await res.json();

//     const converted = data.rates.USD;
//     console.log("Converted : ", converted);
//     dispatch({
//       type: "account/deposit",
//       payload: converted,
//     });
//   };
// }

// export function withdrawl(amount, currency = "USD") {
//   return {
//     type: "account/withdrawl",
//     payload: amount,
//   };
// }

// export function requestLoan(amount, purpose) {
//   return {
//     type: "account/requestLoan",
//     payload: {
//       loanAmount: amount,
//       loanPurpose: purpose,
//     },
//   };
// }

// export function payLoan() {
//   return {
//     type: "account/payLoan",
//   };
// }
