type InfoBoxProps = {
  waitingTime: string;
  cost: string;
  documents: string[];
  healthCenter?: string;
  pharmacy?: string;
};

export default function InfoBox({
  waitingTime,
  cost,
  documents,
  healthCenter,
  pharmacy,
}: InfoBoxProps) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Experience Details
      </p>
      <div className="grid grid-cols-2 gap-3">
        <InfoItem label="Waiting Time" value={waitingTime} />
        <InfoItem label="Cost" value={cost} highlight />
        {healthCenter && <InfoItem label="Health Center" value={healthCenter} span />}
        {pharmacy && <InfoItem label="Pharmacy" value={pharmacy} span />}
      </div>
      <div className="mt-3 border-t border-gray-200 pt-3">
        <p className="mb-2 text-xs text-gray-500">Documents</p>
        <div className="flex flex-wrap gap-1.5">
          {documents.map((doc) => (
            <span
              key={doc}
              className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200"
            >
              {doc}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  highlight,
  span,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`mt-0.5 text-sm font-semibold ${highlight ? "text-primary" : "text-gray-900"}`}
      >
        {value}
      </p>
    </div>
  );
}
