export type PrescriptionMedicineDraft = {
  id: string;
  name: string;
  strength: string;
  dosageForm: string;
  directions: string;
  confirmed: boolean;
};

export type PrescriptionDraft = {
  hospitalName: string;
  doctorName: string;
  prescriptionDate: string;
  medicines: PrescriptionMedicineDraft[];
};

export type PrescriptionOcrMedicine = {
  name: string;
  strength: string;
  dosageForm: string;
  directions: string;
};

export type PrescriptionOcrResult = {
  hospitalName: string;
  doctorName: string;
  prescriptionDate: string;
  medicines: PrescriptionOcrMedicine[];
};
