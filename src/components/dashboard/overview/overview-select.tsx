"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function OverviewSelect({ value, setValue }: any) {
  const handleChange = (newVal: any) => {
    setValue(newVal);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="py-[10px]  md:w-auto shrink-0 px-[16px] border-[1px] border-[#EAECF0] rounded-[8px] shadow-select">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="3-months">3 months</SelectItem>
          <SelectItem value="1-month">1 month</SelectItem>
          <SelectItem value="1-week">1 week</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
