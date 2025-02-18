import React, { createContext, useState, useEffect } from "react";
import ApiService from "../Service/ApiService";

const ApiContext = createContext();

const ApiProvider = ({ children }) => {
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [personData, setPersonData] = useState(null);
  const [personInterest, setPersonInterest] = useState(null);
  const [personSocial, setPersonSocial] = useState(null);
  const [personGov, setPersonGov] = useState(null);
  const [personContact, setPersonContact] = useState(null);
  const [personAddress, setPersonAddress] = useState(null);
  const [personIncome, setPersonIncome] = useState(null);
  const [personConsent, setPersonConsent] = useState(null);
  const [personExpense, setPersonExpense] = useState(null);
  const [personHealthInsurance, setPersonHealthInsurance] = useState(null);
  const [personImmunization, setPersonImmunization] = useState(null);
  const [personMedicalCondition, setPersonMedicalCondition] = useState(null);
  const [personTribeAffiliation, setPersonTribeAffiliation] = useState(null);
  const [personTribe, setPersonTribe] = useState(null);
  const [personMedication, setPersonMedication] = useState(null);
  const [personMedicationList, setPersonMedicationList] = useState(null);
  const [personEducation, setPersonEducation] = useState(null);
  const [personSchool, setPersonSchool] = useState(null);
  const [personUniversity, setPersonuniversity] = useState(null);
  const [personRelation, setPersonrelationship] = useState(null);
  const [personRelationType, setPersonrelationshipType] = useState(null);
  const [personOrganization, setPersonOrganization] = useState(null);
  const [personEmployment, setPersonEmployment] = useState(null);

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const personApiUrl = `${apiURL}/person`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonData(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };

    const fetchPersonInterest = async () => {
      try {
        const personApiUrl = `${apiURL}/Interest`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonInterest(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };

    const fetchPersonSocial = async () => {
      try {
        const personApiUrl = `${apiURL}/OnlinePresence`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonSocial(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };

    const fetchPersonGovDetails = async () => {
      try {
        const personApiUrl = `${apiURL}/personalIdentifier`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonGov(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonContact = async () => {
      try {
        const personApiUrl = `${apiURL}/phoneEmail`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonContact(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonAddress = async () => {
      try {
        const personApiUrl = `${apiURL}/address`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonAddress(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonIncome = async () => {
      try {
        const personApiUrl = `${apiURL}/Income`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonIncome(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonConsent = async () => {
      try {
        const personApiUrl = `${apiURL}/consent`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonConsent(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonExpense = async () => {
      try {
        const personApiUrl = `${apiURL}/Expense`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonExpense(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonHealthInsurance = async () => {
      try {
        const personApiUrl = `${apiURL}/HealthInsurance`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonHealthInsurance(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };

    const fetchPersonImmunization = async () => {
      try {
        const personApiUrl = `${apiURL}/Immunization`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonImmunization(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonMedicalCondition = async () => {
      try {
        const personApiUrl = `${apiURL}/MedicalCondition`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonMedicalCondition(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonTribeAffiliation = async () => {
      try {
        const personApiUrl = `${apiURL}/tribeAffiliation`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonTribeAffiliation(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonTribe = async () => {
      try {
        const personApiUrl = `${apiURL}/tribe`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonTribe(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };

    const fetchPersonMedication = async () => {
      try {
        const personApiUrl = `${apiURL}/Medication`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonMedication(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };

    const fetchPersonMedicationList = async () => {
      try {
        const personApiUrl = `${apiURL}/MedicationList`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonMedicationList(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonEducation = async () => {
      try {
        const personApiUrl = `${apiURL}/Education`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonEducation(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonschool = async () => {
      try {
        const personApiUrl = `${apiURL}/school`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonSchool(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonuniversity = async () => {
      try {
        const personApiUrl = `${apiURL}/university`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonuniversity(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonrelationship = async () => {
      try {
        const personApiUrl = `${apiURL}/relationship`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonrelationship(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonrelationshipType = async () => {
      try {
        const personApiUrl = `${apiURL}/relationshipType`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonrelationshipType(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonOrganization = async () => {
      try {
        const personApiUrl = `${apiURL}/Organization`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonOrganization(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };
    const fetchPersonEmployment = async () => {
      try {
        const personApiUrl = `${apiURL}/Employment`;
        const data = await ApiService.request("GET", personApiUrl);
        setPersonEmployment(data);
      } catch (error) {
        console.error("Error fetching Intake Member data:", error);
      }
    };

    fetchPersonData();
    fetchPersonInterest();
    fetchPersonSocial();
    fetchPersonGovDetails();
    fetchPersonContact();
    fetchPersonAddress();
    fetchPersonIncome();
    fetchPersonConsent();
    fetchPersonExpense();
    fetchPersonHealthInsurance();
    fetchPersonImmunization();
    fetchPersonMedicalCondition();
    fetchPersonTribeAffiliation();
    fetchPersonTribe();
    fetchPersonMedication();
    fetchPersonMedicationList();
    fetchPersonEducation();
    fetchPersonschool();
    fetchPersonuniversity();
    fetchPersonrelationship();
    fetchPersonrelationshipType();
    fetchPersonOrganization();
    fetchPersonEmployment();
  }, []);

  return (
    <ApiContext.Provider
      value={{
        personData,
        personInterest,
        personSocial,
        personGov,
        personContact,
        personAddress,
        personIncome,
        personConsent,
        personExpense,
        personHealthInsurance,
        personImmunization,
        personMedicalCondition,
        personTribeAffiliation,
        personTribe,
        personMedication,
        personMedicationList,
        personEducation,
        personSchool,
        personUniversity,
        personRelation,
        personRelationType,
        personOrganization,
        personEmployment,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export { ApiProvider, ApiContext };
