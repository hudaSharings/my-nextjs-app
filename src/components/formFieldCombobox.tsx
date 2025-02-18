"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface FormFieldComboboxProps {
  name: string;
  label?: string;
  options: SelectOption[];
  placeholder: string;
  description?: string;
}

export function FormFieldCombobox({
  name,
  label,
  options,
  placeholder,
  description,
}: FormFieldComboboxProps) {
  const { control, setValue } = useFormContext(); // Access form context and setValue
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // Track the state of the popover

  return (
    <div className="flex flex-col">
      {label&&<label className="font-medium text-sm">{label}</label>}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} > {/* Control the popover open state */}
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={isPopoverOpen} className="w-[200px] justify-between">
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <>
                  {field.value
                    ? options.find((option) => option.value === field.value)?.label
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </>
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" style={{ pointerEvents: "auto" }}>
          <Command >
            <CommandInput 
              placeholder="Search language..." 
              onFocus={() => setIsPopoverOpen(true)} // Keep the popover open when focused on the input
            />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    value={option.label}
                    key={option.value}
                    onSelect={() => {
                      // Use setValue directly from useFormContext
                      setValue(name, option.value);
                      setIsPopoverOpen(false); // Close popover after selection
                    }}
                  >
                    <Controller
                      name={name}
                      control={control}
                      render={({ field }) => (
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            option.value === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {description && <small className="text-muted-foreground">{description}</small>}
    </div>
  );
}
