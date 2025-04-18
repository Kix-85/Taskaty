// "use client";
// import { useState, useEffect } from "react";


// type CardProps = {
//     type: number;
//     title: string;
//     status: "low" | "medium" | "high" | string;
//     id: string;
//     subscribes: number;
// }

// export default function Card({ type, title, status, id, subscribes }: CardProps) {
//     const [date, setDate] = useState('');
//     useEffect(() => {
//         const now = new Date();
//         const formattedDate = now.toLocaleString("en-US", {
//             month: "short",
//             day: "2-digit",
//         });
//         setDate(formattedDate);
//     }, [])

//     return (
//         <>
//             {type === 1 && (
//                 <div className="">

//                 </div>
//             )}

//         </>
//     )
// }