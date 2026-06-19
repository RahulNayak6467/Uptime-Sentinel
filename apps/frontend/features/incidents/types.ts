export type IncidentsInfoProps = {
  title: string;
  information: string | number;
  color: string;
};

export type IncidentStatus = "active" | "resolved";

export type IncidentListItemProps = {
  id: string;
  title: string;
  status: IncidentStatus;
  service: string;
  date: string;
  time: string;
  duration: string;
  description: string;
};
