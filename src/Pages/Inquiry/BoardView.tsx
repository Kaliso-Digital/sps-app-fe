import React from "react";
import { InquirySummary } from "../../Interface/InquirySummary";
import { Link } from "react-router-dom";
import { useReferenceData } from "../../Service/ReferenceDataContext";

interface BoardViewProps {
  data: InquirySummary[];
  onViewInquiry: (id: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ data, onViewInquiry }) => {
  const referenceData = useReferenceData();
  // Group data by status
  const groupedData: Record<string, InquirySummary[]> = {};

  referenceData?.stage.forEach(stage => {
    groupedData[stage.name.toLowerCase()] = data.filter(inquiry => inquiry.status.toLowerCase() === stage.name.toLowerCase());
  });

  // const groupedDataa: Record<string, InquirySummary[]> = data.reduce(
  //   (acc: Record<string, InquirySummary[]>, inquiry) => {
  //     const status = inquiry.status.toLowerCase();
  //     if (!acc[status]) {
  //       acc[status] = [];
  //     }
  //     acc[status].push(inquiry);
  //     return acc;
  //   },
  //   {}
  // );

  // Render each group in the board view
  const renderGroups = () => {
    return (
      <div className="px-4 pb-4 h-full overflow-scroll no-horizontal-scrollbar">
        {(Object.entries(groupedData).length > 0) ? (
          <div className="flex flex-row">
            {Object.entries(groupedData).map(([status, inquiries]) => (
              <div key={status} className="board-group mr-4 w-64 flex-shrink-0">
                <div className="sticky top-0 bg-white p-2 ">
                  <div className="board-group-header capitalize text-base font-bold">
                    {status} ({inquiries.length})
                  </div>
                </div>
                <div className="board-group-content ">
                  {inquiries.map(renderInquiry)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          
            <div className="container mx-auto h-full flex flex-col justify-between">
              <div className="rounded-[10px] h-full flex items-center justify-center">
                <h2 className="text-4xl dark:text-gray-600">You have no inquiries</h2>
              </div>
            </div>
        )}
      </div>
    );
  };

  // Render individual inquiry item
  const renderInquiry = (inquiry: InquirySummary) => (
    <div
      key={inquiry.id}
      className="board-item rounded-md p-4 mb-4 w-64 h-58 bg-slate-50 border border-sky-500 border-opacity-40 flex flex-col justify-between"
    >
      <div className="mb-2 text-base font-semibold">{inquiry.productName}</div>
      <div className="flex items-center  flex-row mb-2  gap-16 ">
        <div className="flex flex-col">
          <div className="text-base font-medium">Quantity</div>
          <div className="text-xs text-gray-600">{inquiry.quantity}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-base font-medium">Price</div>
          <div className="text-xs text-gray-600">{inquiry.price}</div>
        </div>
      </div>
      <div className="flex flex-col mb-2">
        <div className="text-base font-medium">Status</div>
        <div className=" text-blue-300 text-lg leading-none font-bold">
          {inquiry.status}
        </div>
      </div>
      <div className="w-full flex justify-end">
      <Link to={`/inquiry/${inquiry.id}`}>
        <button
          onClick={() => onViewInquiry(inquiry.id.toString())}
          className="bg-blue-500 text-white px-3 py-1 rounded flex flex-row-reverse items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          View
        </button>
        </Link>
      </div>
    </div>
  );

  return <div>{renderGroups()}</div>;
};

export default BoardView;
