import { createSlice } from "@reduxjs/toolkit";

const safeParse = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch (error) {
    console.warn(`Error parsing ${key} from localStorage:`, error);
    return null;
  }
};

const employeesDataFromLocalStorage = safeParse("employees");
const employeeInfoFromLocalStorage = safeParse("employeeInfo");

const initialState = {
  employeesData: employeesDataFromLocalStorage || [],
  employeeInfo: employeeInfoFromLocalStorage || null,
  error: null,
  filteredResults: [],
  searchValue: "",
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    // setEmployeesData: (state, action) => {
    setEmployeesData: (state, { payload }) => {
      // state.employees = action.payload;
      state.employeesData = payload;
      localStorage.setItem("employees", JSON.stringify(state.employeesData));
    },
    addEmployee: (state, { payload }) => {
      state.employeesData.push(payload);
      localStorage.setItem("employeeInfo", JSON.stringify(payload));
      localStorage.setItem("employees", JSON.stringify(state.employeesData));
    },
    setError: (state, { payload }) => {
      state.error = payload;
    },
    setEntriesToShow: (state, { payload }) => {
      state.pagination.entriesToShow = payload;
    },
    setSearch: (state, { payload }) => {
      // Définit la valeur de recherche dans le state
      state.searchValue = payload;
      // Si une valeur de recherche est définie
      if (state.searchValue) {
        // Convertit la valeur de recherche en minuscules
        const searchValueLowerCase = state.searchValue.toLowerCase();
        // Filtre les résultats en fonction de la valeur de recherche
        state.filteredResults = state.employeesData.filter(employee =>
          // Vérifie si l'une des valeurs de l'employé contient la valeur de recherche
          Object.values(employee).some(value =>
            String(value).toLowerCase().includes(searchValueLowerCase)
          )
        );
      } else {
        // Si aucune valeur de recherche n'est définie, réinitialise les résultats filtrés
        state.filteredResults = [];
      }
    }, 
  },
});

export const {
  setEmployeesData,
  addEmployee,
  setError,
  setEntriesToShow,
  setSearch,
} = employeesSlice.actions;
export default employeesSlice.reducer;
