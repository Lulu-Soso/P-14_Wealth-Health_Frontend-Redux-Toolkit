import React, { useState } from "react";
import { Link } from "react-router-dom";
import DropdownForm from "../components/DropdownForm";
import DateSelector from "../components/DateSelector";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addEmployee } from "../feature/employees.slice";

/**
 * Composant de la page de création d'employé.
 * @component
 */
const CreateEmployeePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [department, setDepartment] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationTimer, setConfirmationTimer] = useState(null);
  const [showError, setShowError] = useState(false); // État pour gérer l'affichage de l'erreur

  const dispatch = useDispatch();

  /**
   * Gère la soumission du formulaire de création d'employé.
   * @param {Object} e - L'événement de soumission du formulaire.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation du formulaire (exemple : vérifiez si le prénom est vide)
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      birthDate === "" ||
      startDate === "" ||
      street.trim() === "" ||
      city.trim() === "" ||
      state === "" ||
      zipCode.trim() === "" ||
      department === ""
    ) {
      setShowError(true); // Affiche la div d'erreur

      // Masque le message d'erreur après 3 secondes (3000 millisecondes)
      setTimeout(() => {
        setShowError(false);
      }, 3000);

      setShowConfirmation(false); // Masque la fenêtre modale de confirmation
      return; // Arrête la soumission du formulaire
    }

    // Convertit la date de naissance et la date de début en objets Date
    const birthDateObj = new Date(birthDate);
    const startDateObj = new Date(startDate);

    // Obtient les dates formatées en tant que chaînes au format local
    const formattedBirthDate = birthDateObj.toLocaleDateString("fr-FR");
    const formattedStartDate = startDateObj.toLocaleDateString("fr-FR");

    const data = {
      firstName,
      lastName,
      birthDate: formattedBirthDate,
      startDate: formattedStartDate,
      street,
      city,
      state,
      zipCode,
      department,
    };

    const resetFormFields = () => {
      setFirstName("");
      setLastName("");
      setBirthDate(new Date());
      setStartDate(new Date());
      setStreet("");
      setCity("");
      setState("");
      setZipCode("");
      setDepartment("");
    };

    try {
      console.log("Sending request with data:", data);
      const response = await axios.post(
        "http://localhost:5000/employees",
        data
      );
      console.log("Response:", response.data);
      dispatch(addEmployee(response.data));
      setShowConfirmation(true); // Affiche la fenêtre modale de confirmation
      resetFormFields();
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  /**
   * Gère l'affichage de la fenêtre modale de confirmation.
   */
  const handleConfirmation = () => {
    setShowConfirmation(true); // Affiche la fenêtre modale
    clearTimeout(confirmationTimer); // Supprime le minuteur précédent
    const timer = setTimeout(() => {
      setShowConfirmation(false); // Ferme la fenêtre modale après un certain temps
    }, 3000); // 3000 millisecondes (3 secondes)
    setConfirmationTimer(timer); // Stocke le nouveau minuteur
  };

  /**
   * Ferme la fenêtre modale de confirmation.
   */
  const closeConfirmation = () => {
    setShowConfirmation(false); // Ferme la fenêtre modale
  };

  // Tableau d'options pour les États
  const stateOptions = [
    { value: "CA", label: "California" },
    { value: "WA", label: "Washington" },
    { value: "NC", label: "North Carolina" },
    { value: "MI", label: "Michigan" },
    { value: "NY", label: "New York" },
  ];

  const departmentOptions = [
    { value: "Sales", label: "Sales" },
    { value: "Marketing", label: "Marketing" },
    { value: "Engineering", label: "Engineering" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Legal", label: "Legal" },
  ];

  return (
    <div className="create-employee">
      <h2>Create Employee</h2>

      {/* Div d'erreur */}
      {showError && (
        <div className="right-error-message">
          <p>All fields are mandatory.</p>
        </div>
      )}

      <form className="form-container" onSubmit={(e) => handleSubmit(e)}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="first-name">First Name</label>
            <input
              type="text"
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="last-name">Last Name</label>
            <input
              type="text"
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="field-row">
          <DateSelector
            label="Date of Birth"
            value={birthDate}
            onChange={setBirthDate}
          />
          <DateSelector
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
          />
        </div>
        <fieldset className="address">
          <legend>Address</legend>
          <div className="field-row">
            <div className="field">
              <label htmlFor="street">Street</label>
              <input
                id="street"
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="field-row">
                <DropdownForm
                  label="state"
                  options={stateOptions}
                  value={state}
                  onChange={setState}
                />
              <div className="field">
                <label htmlFor="zip-code">Zip Code</label>
                <input
                  className="zip-code"
                  id="zip-code"
                  type="number"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
            </div>
          </div>
        </fieldset>
        <div className="field-row">
          <DropdownForm
            label="Department"
            options={departmentOptions}
            value={department}
            onChange={setDepartment}
          />
          <button
            className="form-btn"
            type="submit"
            onClick={handleConfirmation}
          >
            Save
          </button>
        </div>
      </form>
      <div className="link-employee">
        <Link to="/employees/list">View Current Employees</Link>
      </div>
      <div
        id="confirmation"
        className={`modal ${showConfirmation ? "active" : ""}`}
      >
        <div className="modal-content">
          <p>Employee Created !</p>
          <button onClick={closeConfirmation}>X</button>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeePage;
