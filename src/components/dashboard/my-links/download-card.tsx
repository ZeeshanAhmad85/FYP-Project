"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { formatDate, formatTime12Hour } from "@/lib/utils";

const countTimestamps = (timestamps: any) => {
  const timestampCountMap = timestamps.reduce((acc: any, timestamp: any) => {
    if (acc[timestamp]) {
      acc[timestamp] += 1;
    } else {
      acc[timestamp] = 1;
    }
    return acc;
  }, {});

  return Object.keys(timestampCountMap).map((timestamp) => ({
    date: formatDate(timestamp),
    time: formatTime12Hour(timestamp),
    count: timestampCountMap[timestamp],
  }));
};

const DownloadStatsCard: React.FC<{ downloadData: any[] }> = ({
  downloadData,
}) => {
  const downloadRecords = countTimestamps(downloadData);

  return (
    <Card className="border-none rounded-[6px] p-[16px] xs:p-[24px]">
      <CardHeader className=" px-0">
        <CardDescription>
          <div className="max-w-[1920px] mx-auto">
            <span className="text-[18px] text-[#667085]">
              <span className="text-[#344054] font-[700] text-[18px] rounded-[8px] mr-2">
                {downloadData.length > 0 ? downloadData.length : 0}
              </span>
              Downloads in total
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      {downloadData.length > 0 && (
        <CardContent className="px-0 py-[1.2rem]">
          <div className="max-w-[1920px] mx-auto">
            <table className="w-full text-left border border-[#EAECF0]">
              <thead>
                <tr className="bg-[#EAECF0]">
                  <th className="text-[#667085] pl-6 text-sm py-2">
                    Download Date
                  </th>
                  <th className="text-[#667085] pl-6 text-sm py-2">
                    Download Time
                  </th>
                  <th className="text-[#667085] pl-6 text-sm py-2">Count</th>
                </tr>
              </thead>
              <tbody>
                {downloadRecords.length > 0 ? (
                  downloadRecords.map((record, index) => (
                    <tr key={index} className="border-b-[#EAECF0] border-b py-3">
                      <td className="py-3 pl-6 text-[#344054] text-[14px] font-[500]">
                        {record.date}
                      </td>
                      <td className="py-3 pl-6 text-[#344054] text-[14px] font-[500]">
                        {record.time}
                      </td>
                      <td className="py-3 pl-8 text-[#344054] text-[14px] font-[500]">
                        {record.count}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-3 pl-6 text-[#344054] text-[14px] font-[500]"
                    >
                      No records available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DownloadStatsCard;
