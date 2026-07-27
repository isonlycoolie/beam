export type DoctorCheckStatus = "pass" | "warn" | "fail";

export type DoctorCheck = {
  id: string;
  label: string;
  status: DoctorCheckStatus;
  message: string;
  fix?: string;
};
