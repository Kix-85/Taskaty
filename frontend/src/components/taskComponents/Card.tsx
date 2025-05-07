
import { useState, useEffect } from "react";
import Badge from "./Badge";

type CardProps = {
  type: number;
  title: string;
  status: "low" | "medium" | "high" | string;
  id: string;
  subscribes: number;
}

const Card = ({ type, title, status, id, subscribes }: CardProps) => {
  // Put the date logic with useEffect to prevent hydration mismatch error
  const [date, setDate] = useState('');
  
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", {
      month: "short", 
      day: "2-digit", 
    }); 
    setDate(formattedDate);
  }, []);

  // For Client side rendering
  if (!date) return null;

  return (
    <>
      {/* First type */}
      {type === 1 && (
        <div className="bg-[#070b2e] task-card rounded-xl p-4 flex flex-col justify-between gap-2 w-full h-[137px]">
          <h3 className="text-white text-lg font-bold m-0">{title}</h3>
          <div className="flex items-center">
            <Badge status={status} />
            <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-xl text-sm font-semibold ml-2 bg-[#172473] border border-white/20">#{id}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-xl text-sm font-semibold bg-[#172473] border border-white/20">{subscribes}</div>
            <p className="text-white m-0 mx-2.5">{date}</p>
          </div>
        </div>
      )}

      {/* Second type */}
      {type === 2 && (
        <div className="bg-[#070b2e] task-card rounded-xl p-4 flex flex-col justify-between gap-2 w-full h-[80px]">
          <h3 className="text-white text-lg font-bold m-0">{title}</h3>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-xl text-sm font-semibold bg-[#172473] border border-white/20">{subscribes}</div>
            <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-xl text-sm font-semibold bg-[#172473] border border-white/20">#{id}</div>
          </div>
        </div>
      )}

      {/* Third type */}
      {type === 3 && (
        <div className="bg-[#070b2e] task-card rounded-xl p-2.5 flex flex-row items-center justify-between gap-1 w-full h-[50px] text-white my-1">
          <div className="flex items-center justify-center">
            <div className="text-white text-lg font-bold">{title}</div>
          </div>
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-xl text-sm font-semibold bg-[#172473] border border-white/20">{subscribes}</div>
            |
            <p className="text-white m-0 mx-2.5">{date}</p>
            |
            <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-xl text-sm font-semibold bg-[#172473] border border-white/20">#{id}</div>
            |
            <Badge status={status} />
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
